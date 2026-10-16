import { useEffect, useRef } from "react";
import Box from "@gopvp/common/src/components/Box/Box";
import PieceIcon from "@gopvp/chess/src/components/board/PieceIcon";
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

interface PieceState {
 x: number;
 y: number;
 sx: number;
 sy: number;
 r: number;
 o: number;
}

interface Tween {
 start: number;
 dur: number;
 update: (p: number) => void;
 resolve: () => void;
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

const easeOutQuart = (p: number) => 1 - (1 - p) ** 4;
const easeOutBack = (p: number) => 1 + 2.2 * (p - 1) ** 3 + 1.2 * (p - 1) ** 2;
const easeInOutCubic = (p: number) =>
 p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2;
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export default function BoardPreview() {
 const rootRef = useRef<HTMLDivElement>(null);
 const gridRef = useRef<HTMLDivElement>(null);
 const pieceEls = useRef<Record<string, HTMLDivElement | null>>({});
 const fxEls = useRef<Partial<Record<FxName, HTMLDivElement | null>>>({});
 const isReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
 ).matches;

 useEffect(() => {
  if (isReducedMotion) return;
  let cancelled = false;
  let frame = 0;
  let clock = 0;
  let last = 0;
  let isVisible = true;
  let isOnScreen = true;
  let tweens: Tween[] = [];
  const pieces: Record<string, PieceState> = {};
  let board: Record<string, string> = {};

  const paint = (id: string) => {
   const el = pieceEls.current[id];
   const s = pieces[id];
   if (!el) return;
   el.style.transform = `translate3d(${s.x * 100}%, ${s.y * 100}%, 0) scale(${s.sx}, ${s.sy}) rotate(${s.r}deg)`;
   el.style.opacity = `${s.o}`;
  };

  const fx = (
   name: FxName,
   x: number,
   y: number,
   scale: number,
   opacity: number,
  ) => {
   const el = fxEls.current[name];
   if (!el) return;
   el.style.transform = `translate3d(${x * 100}%, ${y * 100}%, 0) scale(${scale})`;
   el.style.opacity = `${opacity}`;
  };

  const tween = (dur: number, update: (p: number) => void) =>
   new Promise<void>((resolve) => {
    tweens.push({ start: clock, dur, update, resolve });
   });
  const wait = (ms: number) => tween(ms, () => {});

  const tick = (time: number) => {
   const delta = last ? Math.min(time - last, 50) : 16;
   last = time;
   if (isVisible && isOnScreen) {
    clock += delta;
    const running = tweens;
    tweens = [];
    running.forEach((t) => {
     const p = Math.min((clock - t.start) / t.dur, 1);
     t.update(p);
     if (p < 1) tweens.push(t);
     else t.resolve();
    });
   }
   frame = requestAnimationFrame(tick);
  };

  const entrance = async () => {
   board = {};
   START_PIECES.forEach(({ id, square }) => {
    const { x } = squareOf(square);
    pieces[id] = { x, y: id[0] === "w" ? 9 : -2, sx: 1, sy: 1, r: 0, o: 0 };
    board[square] = id;
    paint(id);
   });
   await Promise.all(
    START_PIECES.map(({ id, square }) => {
     const { x, y } = squareOf(square);
     const fromY = pieces[id].y;
     const wave = (id[0] === "w" ? 7 - y : y) * 70 + Math.abs(x - 3.5) * 22;
     return wait(wave).then(() =>
      tween(640, (p) => {
       pieces[id].y = lerp(fromY, y, easeOutBack(p));
       pieces[id].o = Math.min(p * 3, 1);
       paint(id);
      }),
     );
    }),
   );
  };

  const sweep = async () => {
   const ids = Object.keys(pieces).filter((id) => pieces[id].o > 0);
   const pulse = Promise.all(
    ids.map((id) =>
     wait(pieces[id].x * 55).then(() =>
      tween(420, (p) => {
       const s = 1 + 0.06 * Math.sin(Math.PI * p);
       pieces[id].sx = s;
       pieces[id].sy = s;
       paint(id);
      }),
     ),
    ),
   );
   await tween(1100, (p) => {
    fx("sweep", lerp(-1.5, 9, easeInOutCubic(p)), 0, 1, Math.sin(Math.PI * p));
   });
   await pulse;
  };

  const ring = (x: number, y: number, isDanger: boolean) => {
   fxEls.current.ring?.classList.toggle("danger", isDanger);
   return tween(680, (p) =>
    fx("ring", x, y, lerp(0.35, 1.25, easeOutQuart(p)), 0.9 * (1 - p)),
   );
  };

  const capture = async (id: string, x: number, y: number) => {
   const nudge = tween(200, (p) => {
    if (gridRef.current)
     gridRef.current.style.transform = `translate3d(0, ${2 * Math.sin(Math.PI * p)}px, 0)`;
   });
   const flash = tween(420, (p) => fx("flash", x, y, 1, 1 - p));
   await tween(340, (p) => {
    pieces[id].sx = pieces[id].sy = lerp(1, 1.35, easeOutQuart(p));
    pieces[id].r = 14 * p;
    pieces[id].o = 1 - p;
    paint(id);
   });
   await Promise.all([nudge, flash]);
  };

  const check = async (square: string) => {
   const { x, y } = squareOf(square);
   const kingId = board[square];
   const glowIn = tween(220, (p) => fx("glow", x, y, 1, p));
   const shake = kingId
    ? tween(450, (p) => {
       pieces[kingId].x = x + 0.05 * Math.sin(p * Math.PI * 6) * (1 - p);
       paint(kingId);
      })
    : wait(0);
   for (let i = 0; i < 2; i++) {
    await tween(750, (p) =>
     fx("check", x, y, lerp(0.6, 1.8, easeOutQuart(p)), 0.7 * (1 - p)),
    );
   }
   await Promise.all([glowIn, shake]);
   await tween(320, (p) => fx("glow", x, y, 1, 1 - p));
  };

  const move = async (from: string, to: string, checkSquare?: string) => {
   const id = board[from];
   if (!id) return;
   const a = squareOf(from);
   const b = squareOf(to);
   const capturedId = board[to];
   const distance = Math.hypot(b.x - a.x, b.y - a.y);
   const dur = 420 + distance * 40;
   const el = pieceEls.current[id];
   if (el) el.style.zIndex = "3";
   await tween(dur, (p) => {
    const e = easeOutQuart(p);
    const lift = Math.sin(Math.PI * p);
    pieces[id].x = lerp(a.x, b.x, e);
    pieces[id].y = lerp(a.y, b.y, e) - 0.22 * lift;
    pieces[id].sx = pieces[id].sy = 1 + 0.1 * lift;
    paint(id);
   });
   if (el) el.style.zIndex = "";
   delete board[from];
   board[to] = id;
   const squash = capturedId ? 0.06 : 0.035;
   const land = tween(240, (p) => {
    const k = Math.sin(Math.PI * p) * (1 - p * 0.4);
    pieces[id].sx = 1 + squash * k;
    pieces[id].sy = 1 - squash * k;
    paint(id);
   });
   const effects = [land, ring(b.x, b.y, !!capturedId)];
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
  };
  const observer = new IntersectionObserver(([entry]) => {
   isOnScreen = entry.isIntersecting;
  });
  if (rootRef.current) observer.observe(rootRef.current);
  document.addEventListener("visibilitychange", onVisibility);
  frame = requestAnimationFrame(tick);
  run();

  return () => {
   cancelled = true;
   cancelAnimationFrame(frame);
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
