import type { Difficulty } from "@gopvp/chess/src/types/component";

export const DIFFICULTY_CONFIG: Record<
 Difficulty,
 { depth: number; strength: number }
> = {
 easy: { depth: 2, strength: 100 },
 medium: { depth: 6, strength: 1600 },
 hard: { depth: 12, strength: 3000 },
};
