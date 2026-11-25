export const COMPACT_AMOUNT_FROM = 1000;
export const DRAWER_ENTER_MS = 420;
export const DRAWER_EXIT_MS = 260;
export const DRAWER_ENTER_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
export const DRAWER_EXIT_EASING = "cubic-bezier(0.4, 0, 1, 1)";
export const DRAWER_RESIZE_MS = 380;
export const DRAWER_RESIZE_MIN_PX = 4;
export const SELECT_SKELETON_ROWS = 6;
export const SLIDE_CONFIRM_THRESHOLD = 0.85;
export const CANVAS_MAX_FRAME_MS = 100;
export const LOGO_LOADER_SWEEP_MS = 1800;
export const LOGO_LOADER_BAND_RATIO = 0.3;
export const SPLIT_REVEAL_PRESS_MS = 120;
export const SPLIT_REVEAL_SHORT_MS = 300;
export const SPLIT_REVEAL_LONG_MS = 600;
export const SPLIT_REVEAL_TARGET_TIMEOUT_MS = 4000;
export const SPLIT_REVEAL_DEBRIS_COUNT = 16;
export const SPLIT_REVEAL_TOOTH_PX = 8;
export const SPLIT_REVEAL_TEAR_VIBRATE = [18, 30, 12];
export const SPLIT_REVEAL_LAND_VIBRATE_MS = 8;
export const PAYOUT_COIN_COUNT = 7;
export const PAYOUT_SPARK_COUNT = 8;
export const PAYOUT_TIMING: Record<
 "win" | "loss" | "draw" | "quick",
 Partial<
  Record<
   | "rise"
   | "burst"
   | "count"
   | "countDur"
   | "sparks"
   | "stamp"
   | "glare"
   | "shake"
   | "end",
   number
  >
 >
> = {
 win: { rise: 0.35, burst: 1.3, count: 1.4, countDur: 0.85, sparks: 1.96, stamp: 2.35, glare: 2.75, end: 3.4 },
 loss: { rise: 0.35, count: 1.3, countDur: 0.6, shake: 1.9, stamp: 2.1, end: 2.6 },
 draw: { rise: 0.35, count: 1.4, countDur: 0.8, glare: 2.3, stamp: 2.35, end: 3.4 },
 quick: { rise: 0.35, stamp: 1.45, sparks: 1.67, glare: 1.95, end: 2.8 },
};
