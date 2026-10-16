export const COMPUTER_MOVE_MIN_DELAY_MS = 2500;
export const COMPUTER_MOVE_MAX_DELAY_MS = 4500;
export const FIRST_MOVE_URGENT_SECONDS = 10;
export const CLOCK_LOW_TIME_MS = 20000;
export const PREMOVE_QUEUE_SOUND_VOLUME = 0.25;
export const PREMOVE_FIRE_VIBRATE_MS = 10;
export const COMPUTER_FALLBACK_MOVE_MS = 8000;
export const MATCH_END_FALLBACK_MS = 5000;
export const BOARD_ENTRANCE_WAVE_MS = 160;
export const BOARD_ENTRANCE_WAVE_COUNT = 4;
export const BOARD_ENTRANCE_LANDING_MS = 600;
export const PIECE_FILL_RATIO = 0.92;
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
   | "end",
   number
  >
 >
> = {
 win: { rise: 0.35, burst: 1.3, count: 1.4, countDur: 0.85, sparks: 1.96, stamp: 2.35, glare: 2.75, end: 3.4 },
 loss: { rise: 0.35, count: 1.3, countDur: 0.6, stamp: 2.1, end: 2.6 },
 draw: { rise: 0.35, count: 1.4, countDur: 0.8, glare: 2.3, stamp: 2.35, end: 3.4 },
 quick: { rise: 0.35, stamp: 1.45, sparks: 1.67, glare: 1.95, end: 2.8 },
};
// export const PIECE_MOVE_SPRING = {
//  type: "spring",
//  stiffness: 380,
//  damping: 34,
//  mass: 1,
// } as const;
export const PIECE_MOVE_SPRING = {
 type: "spring",
 stiffness: 400,
 damping: 55,
 mass: 3.5,
} as const;
