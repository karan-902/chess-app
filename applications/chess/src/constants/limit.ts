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
