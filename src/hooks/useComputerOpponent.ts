import { useEffect } from "react";
import type { Difficulty, GameMode } from "@/types/components";

interface IProps {
    mode: GameMode;
    difficulty: Difficulty;
    fen: string;
    turn: "w" | "b";
    gameEnded: boolean;
    bestMove: string | null;
    makeMove: (from: string, to: string) => { fen: string; promotion?: string } | null;
    getRandomMove: () => { from: string; to: string } | null;
}

export function useComputerOpponent({ mode, difficulty, fen, turn, gameEnded, bestMove, makeMove, getRandomMove }: IProps) {
    // Easy: random move after a short delay
    useEffect(() => {
        if (mode !== "pvc" || difficulty !== "easy" || turn !== "b" || gameEnded) return;
        const t = setTimeout(() => {
            const move = getRandomMove();
            if (move) makeMove(move.from, move.to);
        }, 600);
        return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fen, turn, mode, difficulty, gameEnded]);

    // Medium / Hard: Stockfish best move
    useEffect(() => {
        if (mode !== "pvc" || difficulty === "easy" || turn !== "b" || !bestMove || gameEnded) return;
        const t = setTimeout(() => makeMove(bestMove.slice(0, 2), bestMove.slice(2, 4)), 800);
        return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bestMove, turn, mode, difficulty, gameEnded]);
}
