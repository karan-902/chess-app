export type GameMode = "pvp" | "pvc";
export type Difficulty = "easy" | "medium" | "hard";
export type TimeControl = "bullet" | "blitz" | "rapid" | "classical";
export type GamePhase = "lobby" | "playing";

export const TIME_SECONDS: Record<TimeControl, number> = {
    bullet: 60,
    blitz: 300,
    rapid: 600,
    classical: 1800,
};

export const DIFFICULTY_CONFIG: Record<Difficulty, { rating: number; depth: number; elo: number }> = {
    easy:   { rating: 100,  depth: 2,  elo: 100  },
    medium: { rating: 1600, depth: 8,  elo: 1600 },
    hard:   { rating: 3000, depth: 18, elo: 3000 },
};
