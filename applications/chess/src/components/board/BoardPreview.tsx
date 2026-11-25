import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import Box from "@gopvp/common/src/components/Box/Box";
import CanvasAnimation from "@gopvp/common/src/components/CanvasAnimation/CanvasAnimation";
import { PieceIcon } from "@gopvp/common/src/components/constants";
import { clamp01 } from "@gopvp/common/src/util/easing";
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
 PIECE_SHADOW_COLOR,
} from "@gopvp/chess/src/constants/color";
import {
 BOARD_ENTRANCE_LANDING_MS,
 BOARD_FRAME_PX,
 BOARD_LABEL_INSET_REM,
 BOARD_NUDGE_MS,
 BOARD_SWEEP_MS,
 PIECE_FILL_RATIO,
 PIECE_LAND_MS,
 PIECE_SHADOW_PX,
 PIECE_SHAKE_MS,
 PIECE_SPRITE_PAD_RATIO,
} from "@gopvp/chess/src/constants/limit";
import {
 boardNudgeMotion,
 boardSweepMotion,
 easeOutQuart,
 entranceDelayMs,
 fxMotion,
 lerp,
 pieceEntranceMotion,
 pieceLandMotion,
 pieceMotion,
 pieceMoveMotion,
 pieceMoveMs,
 pieceShakeMotion,
} from "@gopvp/chess/src/utils";
import type { IFxMotion, IPieceMotion } from "@gopvp/chess/src/types/index";
import type {
 ICanvasAnimationProps,
 IGamePreviewProps,
} from "@gopvp/common/src/types/component";

interface ISegment<T> {
 start: number;
 duration: number;
 at: (p: number) => T;
 isRaised?: boolean;
}

type FxName = "flash" | "glow" | "ring" | "check" | "sweep";
type FxState = IFxMotion & { isDanger?: boolean };

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

const buildTimeline = () => {
 const pieceTracks: Record<string, ISegment<IPieceMotion>[]> =
  Object.fromEntries(START_PIECES.map(({ id }) => [id, []]));
 const fxTracks: Record<FxName, ISegment<FxState>[]> = {
  flash: [],
  glow: [],
  ring: [],
  check: [],
  sweep: [],
 };
 const nudgeTrack: ISegment<number>[] = [];
 const positions: Record<string, { x: number; y: number }> = {};
 const captured = new Set<string>();
 const board: Record<string, string> = {};

 const add = <T,>(
  track: ISegment<T>[],
  start: number,
  duration: number,
  at: (p: number) => T,
  isRaised = false,
 ) => {
  track.push({ start, duration, at, isRaised });
  return start + duration;
 };

 let clock = Math.max(
  ...START_PIECES.map(({ id, square }) => {
   const { x, y } = squareOf(square);
   positions[id] = { x, y };
   board[square] = id;
   return add(
    pieceTracks[id],
    entranceDelayMs(x, y),
    BOARD_ENTRANCE_LANDING_MS,
    pieceEntranceMotion(x, id[0] === "w" ? 9 : -2, y),
   );
  }),
 );

 const sweep = () => {
  clock = Math.max(
   add(fxTracks.sweep, clock, BOARD_SWEEP_MS, boardSweepMotion),
   ...Object.entries(positions)
    .filter(([id]) => !captured.has(id))
    .map(([id, { x, y }]) =>
     add(pieceTracks[id], clock + x * 55, 420, (p) =>
      pieceMotion(x, y, 1, 1 + 0.06 * Math.sin(Math.PI * p)),
     ),
    ),
  );
 };

 const check = (square: string) => {
  const { x, y } = squareOf(square);
  const start = clock;
  add(fxTracks.glow, start, 220, (p) => fxMotion(x, y, 1, p));
  add(
   pieceTracks[board[square]],
   start,
   PIECE_SHAKE_MS,
   pieceShakeMotion(x, y),
  );
  for (let i = 0; i < 2; i++)
   clock = add(fxTracks.check, clock, 750, (p) =>
    fxMotion(x, y, lerp(0.6, 1.8, easeOutQuart(p)), 0.7 * (1 - p)),
   );
  clock = add(
   fxTracks.glow,
   Math.max(clock, start + 220, start + PIECE_SHAKE_MS),
   320,
   (p) => fxMotion(x, y, 1, 1 - p),
  );
 };

 const move = (from: string, to: string, checkSquare?: string) => {
  const id = board[from];
  const a = squareOf(from);
  const b = squareOf(to);
  const capturedId = board[to];
  clock = add(
   pieceTracks[id],
   clock,
   pieceMoveMs(a.x, a.y, b.x, b.y),
   pieceMoveMotion(a.x, a.y, b.x, b.y),
   true,
  );
  delete board[from];
  board[to] = id;
  positions[id] = b;
  const ends = [
   add(
    pieceTracks[id],
    clock,
    PIECE_LAND_MS,
    pieceLandMotion(b.x, b.y, !!capturedId),
   ),
   add(fxTracks.ring, clock, 680, (p) => ({
    ...fxMotion(b.x, b.y, lerp(0.35, 1.25, easeOutQuart(p)), 0.9 * (1 - p)),
    isDanger: !!capturedId,
   })),
  ];
  if (capturedId) {
   captured.add(capturedId);
   ends.push(
    add(nudgeTrack, clock, BOARD_NUDGE_MS, boardNudgeMotion),
    add(fxTracks.flash, clock, 420, (p) => fxMotion(b.x, b.y, 1, 1 - p)),
    add(pieceTracks[capturedId], clock, 340, (p) => {
     const scale = lerp(1, 1.35, easeOutQuart(p));
     return pieceMotion(b.x, b.y, 1 - p, scale, scale, 14 * p);
    }),
   );
  }
  clock = Math.max(...ends);
  if (checkSquare) check(checkSquare);
 };

 sweep();
 MOVES.forEach(([from, to, checkSquare]) => {
  move(from, to, checkSquare);
  clock += 380;
 });
 sweep();
 return { pieceTracks, fxTracks, nudgeTrack, loopMs: clock + 700 };
};

const TIMELINE = buildTimeline();

const segmentAt = <T,>(track: ISegment<T>[], t: number) =>
 track.reduce<ISegment<T> | undefined>(
  (current, segment) => (segment.start <= t ? segment : current),
  undefined,
 );

const progressOf = <T,>(segment: ISegment<T>, t: number) =>
 clamp01((t - segment.start) / segment.duration);

const pieceCodes = [...new Set(START_PIECES.map(({ code }) => code))];
const pieceHost = document.createElement("div");
const pieceRoot = createRoot(pieceHost);
flushSync(() =>
 pieceRoot.render(
  pieceCodes.map((code) => (
   <PieceIcon key={code} code={code} width={45} height={45} />
  )),
 ),
);
const pieceImages: Record<string, HTMLImageElement> = Object.fromEntries(
 pieceCodes.map((code, i) => {
  const image = new Image();
  image.src = `data:image/svg+xml,${encodeURIComponent(
   new XMLSerializer().serializeToString(pieceHost.children[i]),
  )}`;
  return [code, image];
 }),
);
pieceRoot.unmount();

let sprites: { size: number; byCode: Record<string, HTMLCanvasElement> } = {
 size: 0,
 byCode: {},
};

const spriteOf = (code: string, square: number) => {
 const dpr = window.devicePixelRatio;
 const size = Math.round(square * (1 + PIECE_SPRITE_PAD_RATIO * 2) * dpr);
 if (sprites.size !== size) sprites = { size, byCode: {} };
 const image = pieceImages[code];
 const spriteCtx =
  !sprites.byCode[code] && image.naturalWidth
   ? document.createElement("canvas").getContext("2d")
   : null;
 if (spriteCtx) {
  const piece = square * PIECE_FILL_RATIO * dpr;
  spriteCtx.canvas.width = spriteCtx.canvas.height = size;
  spriteCtx.shadowColor = PIECE_SHADOW_COLOR;
  spriteCtx.shadowOffsetY = PIECE_SHADOW_PX * dpr;
  spriteCtx.shadowBlur = PIECE_SHADOW_PX * dpr;
  spriteCtx.drawImage(
   image,
   (size - piece) / 2,
   (size - piece) / 2,
   piece,
   piece,
  );
  sprites.byCode[code] = spriteCtx.canvas;
 }
 return sprites.byCode[code];
};

const withAlpha = (
 ctx: CanvasRenderingContext2D,
 color: string,
 alpha: number,
) => {
 ctx.fillStyle = color;
 return `${ctx.fillStyle}${Math.round(alpha * 255)
  .toString(16)
  .padStart(2, "0")}`;
};

const drawPreview: ICanvasAnimationProps["draw"] = (
 ctx,
 { elapsed, width, style },
) => {
 const t = elapsed % TIMELINE.loopMs;
 const square = (width - BOARD_FRAME_PX * 2) / 8;
 const dpr = window.devicePixelRatio;
 const edge = (i: number) => Math.round(i * square * dpr) / dpr;
 const gold = style.getPropertyValue("--preview-gold").trim();
 const danger = style.getPropertyValue("--preview-danger").trim();

 const fxAt = (name: FxName) => {
  const segment = segmentAt(TIMELINE.fxTracks[name], t);
  return segment?.at(progressOf(segment, t));
 };

 const inSquare = (state: FxState | undefined, paint: () => void) => {
  if (!state || state.opacity <= 0) return;
  ctx.save();
  ctx.globalAlpha = state.opacity;
  ctx.translate((state.x + 0.5) * square, (state.y + 0.5) * square);
  ctx.scale(state.scale, state.scale);
  paint();
  ctx.restore();
 };

 const strokeRing = (color: string) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, square / 2 - 1, 0, Math.PI * 2);
  ctx.stroke();
 };

 const drawPiece = (
  code: string,
  { x, y, opacity, scaleX, scaleY, rotate }: IPieceMotion,
 ) => {
  const sprite = spriteOf(code, square);
  if (!sprite || opacity <= 0) return;
  const size = square * (1 + PIECE_SPRITE_PAD_RATIO * 2);
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate((x + 0.5) * square, (y + 0.5) * square);
  ctx.scale(scaleX, scaleY);
  ctx.rotate((rotate * Math.PI) / 180);
  ctx.drawImage(sprite, -size / 2, -size / 2, size, size);
  ctx.restore();
 };

 ctx.fillStyle = style.getPropertyValue("--preview-edge").trim();
 ctx.fillRect(0, 0, width, width);
 ctx.save();
 ctx.beginPath();
 ctx.rect(BOARD_FRAME_PX, BOARD_FRAME_PX, square * 8, square * 8);
 ctx.clip();
 const nudge = segmentAt(TIMELINE.nudgeTrack, t);
 ctx.translate(
  BOARD_FRAME_PX,
  BOARD_FRAME_PX + (nudge ? nudge.at(progressOf(nudge, t)) : 0),
 );

 for (let r = 0; r < 8; r++)
  for (let c = 0; c < 8; c++) {
   ctx.fillStyle = (r + c) % 2 === 0 ? LIGHT_SQUARE_COLOR : DARK_SQUARE_COLOR;
   ctx.fillRect(edge(c), edge(r), edge(c + 1) - edge(c), edge(r + 1) - edge(r));
  }

 inSquare(fxAt("flash"), () => {
  ctx.globalAlpha *= 0.55;
  ctx.fillStyle = danger;
  ctx.fillRect(-square / 2, -square / 2, square, square);
 });
 inSquare(fxAt("glow"), () => {
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, square / 2);
  glow.addColorStop(0, withAlpha(ctx, danger, 0.75));
  glow.addColorStop(1, withAlpha(ctx, danger, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(-square / 2, -square / 2, square, square);
 });
 const ring = fxAt("ring");
 inSquare(ring, () => strokeRing(ring?.isDanger ? danger : gold));
 inSquare(fxAt("check"), () => strokeRing(danger));

 let raised: [string, IPieceMotion] | undefined;
 START_PIECES.forEach(({ id, code }) => {
  const segment = segmentAt(TIMELINE.pieceTracks[id], t);
  if (!segment) return;
  const p = progressOf(segment, t);
  if (segment.isRaised && p < 1) raised = [code, segment.at(p)];
  else drawPiece(code, segment.at(p));
 });

 const sweep = fxAt("sweep");
 if (sweep && sweep.opacity > 0) {
  const boardSize = square * 8;
  const bandWidth = square * 1.8;
  const bandHeight = boardSize * 1.2;
  const angle = (100 * Math.PI) / 180;
  const dx = Math.sin(angle);
  const dy = -Math.cos(angle);
  const half = (Math.abs(bandWidth * dx) + Math.abs(bandHeight * dy)) / 2;
  const band = ctx.createLinearGradient(
   -dx * half,
   -dy * half,
   dx * half,
   dy * half,
  );
  band.addColorStop(0, withAlpha(ctx, gold, 0));
  band.addColorStop(0.4, withAlpha(ctx, gold, 0.22));
  band.addColorStop(0.5, withAlpha(ctx, gold, 0.4));
  band.addColorStop(0.6, withAlpha(ctx, gold, 0.22));
  band.addColorStop(1, withAlpha(ctx, gold, 0));
  ctx.save();
  ctx.globalAlpha = sweep.opacity;
  ctx.translate((sweep.x + 0.5) * square, boardSize / 2);
  ctx.transform(1, 0, Math.tan((-18 * Math.PI) / 180), 1, 0, 0);
  ctx.fillStyle = band;
  ctx.fillRect(-bandWidth / 2, -bandHeight / 2, bandWidth, bandHeight);
  ctx.restore();
 }

 const fontSize = parseFloat(style.fontSize);
 const inset =
  parseFloat(getComputedStyle(document.documentElement).fontSize) *
  BOARD_LABEL_INSET_REM;
 ctx.font = `${style.fontSize} ${style.fontFamily}`;
 ctx.textBaseline = "middle";
 const drawLabel = (text: string, c: number, r: number, isFile: boolean) => {
  const isLight = (r + c) % 2 === 0;
  const textWidth = ctx.measureText(text).width;
  const left = isFile ? edge(c + 1) - inset - textWidth : edge(c) + inset;
  const top = isFile ? edge(r + 1) - inset - fontSize : edge(r) + inset;
  ctx.fillStyle = isLight ? LIGHT_SQUARE_COLOR : DARK_SQUARE_COLOR;
  ctx.fillRect(left, top, textWidth, fontSize);
  ctx.fillStyle = isLight ? LIGHT_SQUARE_LABEL_COLOR : DARK_SQUARE_LABEL_COLOR;
  ctx.fillText(text, left, top + fontSize / 2);
 };
 RANKS.forEach((rank, r) => drawLabel(rank, 0, r, false));
 FILES.forEach((file, c) => drawLabel(file, c, 7, true));

 if (raised) drawPiece(...raised);
 ctx.restore();
 return true;
};

export default function BoardPreview({ isPaused = false }: IGamePreviewProps) {
 return (
  <Box customClass="chess-board fit-board">
   <CanvasAnimation
    customClass="board-preview-canvas"
    isPaused={isPaused}
    draw={drawPreview}
   />
  </Box>
 );
}
