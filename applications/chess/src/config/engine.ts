import type { Difficulty } from "@gopvp/chess/src/types/component";

export const DIFFICULTY_CONFIG: Record<
 Difficulty,
 { depth: number; strength: number; randomMoves: boolean }
> = {
 easy: { depth: 2, strength: 100, randomMoves: true },
 medium: { depth: 6, strength: 1600, randomMoves: false },
 hard: { depth: 12, strength: 3000, randomMoves: false },
};
