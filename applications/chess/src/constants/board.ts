export const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const RANKS = ["8", "7", "6", "5", "4", "3", "2", "1"];
export const FILES_FLIP = ["h", "g", "f", "e", "d", "c", "b", "a"];
export const RANKS_FLIP = ["1", "2", "3", "4", "5", "6", "7", "8"];

export const BACK_RANK_PIECES = ["R", "N", "B", "Q", "K", "B", "N", "R"];

export const PIECE_LETTER: Record<string, string> = {
 p: "P",
 n: "N",
 b: "B",
 r: "R",
 q: "Q",
 k: "K",
};

export const CAPTURE_ORDER = ["p", "n", "b", "r", "q"] as const;

export const STARTING_COUNTS: Record<string, number> = {
 p: 8,
 n: 2,
 b: 2,
 r: 2,
 q: 1,
};

export const PIECE_VALUES: Record<string, number> = {
 p: 1,
 n: 3,
 b: 3,
 r: 5,
 q: 9,
};

export const PROMOTION_PIECES = ["q", "r", "b", "n"] as const;
