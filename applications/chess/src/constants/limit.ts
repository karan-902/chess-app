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
export const WIN_BURST_LEAD_S = 0.3;
export const WIN_BURST_END_S = 2.6;
export const WIN_BURST_COIN_COUNT = 7;
export const WIN_BURST_SPARK_COUNT = 5;
export const WIN_BURST_CONFETTI_COUNT = 3;
export const WIN_BURST_STREAK_COUNT = 8;
export const WIN_BURST_POP_COUNT = 5;
export const WIN_BURST_SEED = 90210;
export const RESULT_COUNT_TIMING: Partial<
 Record<"win" | "loss" | "draw", { startS: number; durationS: number }>
> = {
 win: { startS: 1.25, durationS: 0.6 },
 loss: { startS: 0.35, durationS: 0.65 },
 draw: { startS: 0.35, durationS: 0.65 },
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
