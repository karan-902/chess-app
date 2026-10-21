import { useEffect, useRef } from "react";
import Box from "@gopvp/common/src/components/Box/Box";
import { PieceIcon } from "@gopvp/common/src/components/constants";
import "./board.scss";
import {
 FILES,
 RANKS,
 BACK_RANK_PIECES,
} from "@gopvp/chess/src/constants/board";
import {
 LIGHT_SQUARE_COLOR,
 DARK_SQUARE_COLOR,
 LIGHT_SQUARE_LABEL_COLOR,
 DARK_SQUARE_LABEL_COLOR,
} from "@gopvp/chess/src/constants/color";
import {
 BOARD_ENTRANCE_LANDING_MS,
 BOARD_NUDGE_MS,
 BOARD_SWEEP_MS,
 PIECE_LAND_MS,
 PIECE_SHAKE_MS,
} from "@gopvp/chess/src/constants/limit";
import {
 boardNudgeFrames,
 boardSweepFrames,
 easeOutQuart,
 entranceDelayMs,
 fxFrame,
 lerp,
 pieceEntranceFrames,
 pieceFrame,
 pieceLandFrames,
 pieceMoveFrames,
 pieceMoveMs,
 pieceShakeFrames,
 sampleFrames,
} from "@gopvp/chess/src/utils";
import { shouldReduceMotion } from "@gopvp/common/src/util/motion";

interface PieceState {
 x: number;
 y: number;
 o: number;
}

type FxName = "ring" | "flash" | "check" | "glow" | "sweep";

const START_PIECES = FILES.flatMap((file, i) => [
 {
  id: `b${BACK_RANK_PIECES[i]}-${file}8`,
  code: `b${BACK_RANK_PIECES[i]}`,
  square: `${file}8`,
 },
 { id: `bP-${file}7`, code: "bP", square: `${file}7` },
 { id: `wP-${file}2`, code: "wP", square: `${file}2` },
 {
  id: `w${BACK_RANK_PIECES[i]}-${file}1`,
  code: `w${BACK_RANK_PIECES[i]}`,
  square: `${file}1`,
 },
]);

const MOVES: [string, string, string?][] = [
 ["e2", "e4"],
 ["e7", "e5"],
 ["d1", "h5"],
 ["b8", "c6"],
 ["f1", "c4"],
 ["g8", "f6"],
 ["h5", "f7", "e8"],
];

const squareOf = (square: string) => ({
 x: FILES.indexOf(square[0]),
 y: RANKS.indexOf(square[1]),
});

export default function BoardPreview() {
 const rootRef = useRef<HTMLDivElement>(null);
 const gridRef = useRef<HTMLDivElement>(null);
 const pieceEls = useRef<Record<string, HTMLDivElement | null>>({});
 const fxEls = useRef<Partial<Record<FxName, HTMLDivElement | null>>>({});
 const isReducedMotion = shouldReduceMotion();

 useEffect(() => {
  if (isReducedMotion) return;
  let cancelled = false;
  let isVisible = true;
  let isOnScreen = true;
  const animations = new Set<Animation>();
  const pieces: Record<string, PieceState> = {};
  let board: Record<string, string> = {};

  const animate = (
   el: Element | null | undefined,
   keyframes: Keyframe[],
   duration: number,
   delay = 0,
  ) => {
   if (cancelled || !el) return Promise.resolve();
   const animation = el.animate(keyframes, { duration, delay, fill: "both" });
   animations.add(animation);
   if (!(isVisible && isOnScreen)) animation.pause();
   return animation.finished.then(
    () => {
     animations.delete(animation);
     if (cancelled) return;
     if (keyframes.length) animation.commitStyles();
     animation.cancel();
    },
    () => {},
   );
  };

  const wait = (ms: number) => animate(rootRef.current, [], ms);

  const syncPlayback = () => {
   const isActive = isVisible && isOnScreen;
   animations.forEach((animation) =>
    isActive ? animation.play() : animation.pause(),
   );
  };

  const entrance = () => {
   board = {};
   return Promise.all(
    START_PIECES.map(({ id, square }) => {
     const { x, y } = squareOf(square);
     pieces[id] = { x, y, o: 1 };
     board[square] = id;
     return animate(
      pieceEls.current[id],
      pieceEntranceFrames(x, id[0] === "w" ? 9 : -2, y),
      BOARD_ENTRANCE_LANDING_MS,
      entranceDelayMs(x, y),
     );
    }),
   );
  };

  const sweep = () =>
   Promise.all([
    ...Object.entries(pieces)
     .filter(([, { o }]) => o > 0)
     .map(([id, { x, y }]) =>
      animate(
       pieceEls.current[id],
       sampleFrames((p) =>
        pieceFrame(x, y, 1, 1 + 0.06 * Math.sin(Math.PI * p)),
       ),
       420,
       x * 55,
      ),
     ),
    animate(fxEls.current.sweep, boardSweepFrames(), BOARD_SWEEP_MS),
   ]);

  const ring = (x: number, y: number, isDanger: boolean) => {
   fxEls.current.ring?.classList.toggle("danger", isDanger);
   return animate(
    fxEls.current.ring,
    sampleFrames((p) =>
     fxFrame(x, y, lerp(0.35, 1.25, easeOutQuart(p)), 0.9 * (1 - p)),
    ),
    680,
   );
  };

  const capture = (id: string, x: number, y: number) => {
   pieces[id].o = 0;
   return Promise.all([
    animate(gridRef.current, boardNudgeFrames(), BOARD_NUDGE_MS),
    animate(
     fxEls.current.flash,
     sampleFrames((p) => fxFrame(x, y, 1, 1 - p)),
     420,
    ),
    animate(
     pieceEls.current[id],
     sampleFrames((p) => {
      const scale = lerp(1, 1.35, easeOutQuart(p));
      return pieceFrame(x, y, 1 - p, scale, scale, 14 * p);
     }),
     340,
    ),
   ]);
  };

  const check = async (square: string) => {
   const { x, y } = squareOf(square);
   const glowIn = animate(
    fxEls.current.glow,
    sampleFrames((p) => fxFrame(x, y, 1, p)),
    220,
   );
   const shake = animate(
    pieceEls.current[board[square]],
    pieceShakeFrames(x, y),
    PIECE_SHAKE_MS,
   );
   for (let i = 0; i < 2; i++) {
    await animate(
     fxEls.current.check,
     sampleFrames((p) =>
      fxFrame(x, y, lerp(0.6, 1.8, easeOutQuart(p)), 0.7 * (1 - p)),
     ),
     750,
    );
   }
   await Promise.all([glowIn, shake]);
   await animate(
    fxEls.current.glow,
    sampleFrames((p) => fxFrame(x, y, 1, 1 - p)),
    320,
   );
  };

  const move = async (from: string, to: string, checkSquare?: string) => {
   const id = board[from];
   const el = pieceEls.current[id];
   if (!id || !el) return;
   const a = squareOf(from);
   const b = squareOf(to);
   const capturedId = board[to];
   el.style.zIndex = "3";
   await animate(
    el,
    pieceMoveFrames(a.x, a.y, b.x, b.y),
    pieceMoveMs(a.x, a.y, b.x, b.y),
   );
   el.style.zIndex = "";
   delete board[from];
   board[to] = id;
   pieces[id].x = b.x;
   pieces[id].y = b.y;
   const effects: Promise<unknown>[] = [
    animate(el, pieceLandFrames(b.x, b.y, !!capturedId), PIECE_LAND_MS),
    ring(b.x, b.y, !!capturedId),
   ];
   if (capturedId) effects.push(capture(capturedId, b.x, b.y));
   await Promise.all(effects);
   if (checkSquare) await check(checkSquare);
  };

  const run = async () => {
   while (!cancelled) {
    await entrance();
    await sweep();
    for (const [from, to, checkSquare] of MOVES) {
     if (cancelled) return;
     await move(from, to, checkSquare);
     await wait(380);
    }
    await sweep();
    await wait(700);
   }
  };

  const onVisibility = () => {
   isVisible = document.visibilityState === "visible";
   syncPlayback();
  };
  const observer = new IntersectionObserver(([entry]) => {
   isOnScreen = entry.isIntersecting;
   syncPlayback();
  });
  if (rootRef.current) observer.observe(rootRef.current);
  document.addEventListener("visibilitychange", onVisibility);
  run();

  return () => {
   cancelled = true;
   animations.forEach((animation) => animation.cancel());
   observer.disconnect();
   document.removeEventListener("visibilitychange", onVisibility);
  };
 }, [isReducedMotion]);

 return (
  <Box ref={rootRef} customClass="chess-board fit-board">
   <Box ref={gridRef} customClass="chess-board-grid">
    {Array.from({ length: 8 }, (_, r) =>
     Array.from({ length: 8 }, (_, c) => {
      const isLight = (r + c) % 2 === 0;
      const squareColor = isLight ? LIGHT_SQUARE_COLOR : DARK_SQUARE_COLOR;
      const labelStyle = {
       color: isLight ? LIGHT_SQUARE_LABEL_COLOR : DARK_SQUARE_LABEL_COLOR,
       backgroundColor: squareColor,
      };
      return (
       <Box
        key={`${r}-${c}`}
        customClass="chess-board-square"
        style={{ backgroundColor: squareColor }}
       >
        {c === 0 && (
         <span className="sq-corner-label sq-rank" style={labelStyle}>
          {RANKS[r]}
         </span>
        )}
        {r === 7 && (
         <span className="sq-corner-label sq-file" style={labelStyle}>
          {FILES[c]}
         </span>
        )}
       </Box>
      );
     }),
    )}

    <Box customClass="board-preview-layer">
     {(["flash", "glow", "ring", "check"] as const).map((name) => (
      <Box
       key={name}
       ref={(el: HTMLDivElement | null) => {
        fxEls.current[name] = el;
       }}
       customClass={`board-preview-fx ${name}`}
      />
     ))}
     {START_PIECES.map(({ id, code, square }) => {
      const { x, y } = squareOf(square);
      return (
       <Box
        key={id}
        ref={(el: HTMLDivElement | null) => {
         pieceEls.current[id] = el;
        }}
        customClass="board-preview-piece"
        style={{
         transform: `translate3d(${x * 100}%, ${y * 100}%, 0)`,
         opacity: isReducedMotion ? 1 : 0,
        }}
       >
        <PieceIcon code={code} className="board-preview-piece-svg" />
       </Box>
      );
     })}
     <Box
      ref={(el: HTMLDivElement | null) => {
       fxEls.current.sweep = el;
      }}
      customClass="board-preview-fx sweep"
     />
    </Box>
   </Box>
  </Box>
 );
}
