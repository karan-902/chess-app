import type { GameCategory } from "@gopvp/chess/src/types/index";
import {
 BOARD_ENTRANCE_FILE_MS,
 BOARD_ENTRANCE_RANK_MS,
 BOARD_MOTION_FRAME_SAMPLES,
 PIECE_MOVE_BASE_MS,
 PIECE_MOVE_PER_SQUARE_MS,
} from "@gopvp/chess/src/constants/limit";

export function oppositeSide(side: "w" | "b"): "w" | "b" {
 return side === "w" ? "b" : "w";
}
export function msToSeconds(ms: number): number {
 return ms / 1000;
}
export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
export const smoothStep = (value: number) => {
 const p = clamp01(value);
 return p * p * (3 - 2 * p);
};
export const easeOutCubic = (value: number) => 1 - (1 - clamp01(value)) ** 3;
export const prefersReducedMotion = () =>
 window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const easeOutQuart = (p: number) => 1 - (1 - p) ** 4;
export const easeOutBack = (p: number) =>
 1 + 2.2 * (p - 1) ** 3 + 1.2 * (p - 1) ** 2;
export const easeInOutCubic = (p: number) =>
 p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2;
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const sampleFrames = (frameAt: (p: number) => Keyframe) =>
 Array.from({ length: BOARD_MOTION_FRAME_SAMPLES + 1 }, (_, i) =>
  frameAt(i / BOARD_MOTION_FRAME_SAMPLES),
 );
export const pieceFrame = (
 x: number,
 y: number,
 opacity = 1,
 scaleX = 1,
 scaleY = scaleX,
 rotate = 0,
): Keyframe => ({
 transform: `translate3d(${x * 100}%, ${y * 100}%, 0) scale(${scaleX}, ${scaleY}) rotate(${rotate}deg)`,
 opacity,
});
export const fxFrame = (
 x: number,
 y: number,
 scale: number,
 opacity: number,
): Keyframe => ({
 transform: `translate3d(${x * 100}%, ${y * 100}%, 0) scale(${scale})`,
 opacity,
});
export const pieceMoveMs = (fromX: number, fromY: number, toX: number, toY: number) =>
 PIECE_MOVE_BASE_MS +
 Math.hypot(toX - fromX, toY - fromY) * PIECE_MOVE_PER_SQUARE_MS;
export const pieceMoveFrames = (
 fromX: number,
 fromY: number,
 toX: number,
 toY: number,
) =>
 sampleFrames((p) => {
  const e = easeOutCubic(p);
  const lift = Math.sin(Math.PI * p);
  return pieceFrame(
   lerp(fromX, toX, e),
   lerp(fromY, toY, e) - 0.08 * lift,
   1,
   1 + 0.05 * lift,
  );
 });
export const pieceLandFrames = (x: number, y: number, isCapture: boolean) => {
 const squash = isCapture ? 0.06 : 0.035;
 return sampleFrames((p) => {
  const k = Math.sin(Math.PI * p) * (1 - p * 0.4);
  return pieceFrame(x, y, 1, 1 + squash * k, 1 - squash * k);
 });
};
export const pieceEntranceFrames = (x: number, fromY: number, toY: number) =>
 sampleFrames((p) =>
  pieceFrame(x, lerp(fromY, toY, easeOutBack(p)), Math.min(p * 3, 1)),
 );
export const pieceShakeFrames = (x: number, y: number) =>
 sampleFrames((p) =>
  pieceFrame(x + 0.05 * Math.sin(p * Math.PI * 6) * (1 - p), y),
 );
export const boardNudgeFrames = () =>
 sampleFrames((p) => ({
  transform: `translate3d(0, ${2 * Math.sin(Math.PI * p)}px, 0)`,
 }));
export const boardSweepFrames = () =>
 sampleFrames((p) =>
  fxFrame(lerp(-1.5, 9, easeInOutCubic(p)), 0, 1, Math.sin(Math.PI * p)),
 );
export const entranceDelayMs = (col: number, row: number) =>
 (row >= 4 ? 7 - row : row) * BOARD_ENTRANCE_RANK_MS +
 Math.abs(col - 3.5) * BOARD_ENTRANCE_FILE_MS;
export function deriveCategory(timeSeconds: number): GameCategory {
 if (timeSeconds <= 120) return "BULLET";
 if (timeSeconds <= 420) return "BLITZ";
 if (timeSeconds <= 1200) return "RAPID";
 return "CLASSICAL";
}
