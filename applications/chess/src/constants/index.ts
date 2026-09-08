import { Difficulty } from "@/types/components";
import { GameCategory } from "@/types/types";

export const TIME_SECONDS: Record<GameCategory, number> = {
    BULLET: 60,
    BLITZ: 180,
    RAPID: 600,
    CLASSICAL: 1800,
};

// Stockfish config for mode

export const DIFFICULTY_CONFIG: Record<
    Difficulty,
    { rating: number; depth: number; elo: number }
> = {
    easy: { rating: 100, depth: 2, elo: 100 },
    medium: { rating: 1600, depth: 6, elo: 1600 },
    hard: { rating: 3000, depth: 12, elo: 3000 },
};
