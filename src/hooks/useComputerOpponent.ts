import { useEffect } from "react";
import type { Difficulty, GameMode } from "@/types/components";

const COMPUTER_MOVE_DELAY_MS = 3000;

interface IProps {
    mode: GameMode;
    difficulty: Difficulty;
    fen: string;
    turn: "w" | "b";
    computerSide: "w" | "b";
    gameEnded: boolean;
    bestMove: string | null;
    makeMove: (
        from: string,
        to: string,
    ) => { fen: string; promotion?: string } | null;
    getRandomMove: () => { from: string; to: string } | null;
}

export function useComputerOpponent({
    mode,
    difficulty,
    fen,
    turn,
    computerSide,
    gameEnded,
    bestMove,
    makeMove,
    getRandomMove,
}: IProps) {
    useEffect(() => {
        if (
            mode !== "pvc" ||
            difficulty !== "easy" ||
            turn !== computerSide ||
            gameEnded
        )
            return;
        const t = setTimeout(() => {
            const move = getRandomMove();
            if (move) makeMove(move.from, move.to);
        }, COMPUTER_MOVE_DELAY_MS);
        return () => clearTimeout(t);
    }, [fen, turn, computerSide, mode, difficulty, gameEnded]);

    useEffect(() => {
        if (
            mode !== "pvc" ||
            difficulty === "easy" ||
            turn !== computerSide ||
            !bestMove ||
            gameEnded
        ) {
            return;
        }
        const t = setTimeout(
            () => makeMove(bestMove.slice(0, 2), bestMove.slice(2, 4)),
            COMPUTER_MOVE_DELAY_MS,
        );
        return () => clearTimeout(t);
    }, [bestMove, turn, computerSide, mode, difficulty, gameEnded]);

    useEffect(() => {
        if (
            mode !== "pvc" ||
            difficulty === "easy" ||
            turn !== computerSide ||
            gameEnded
        )
            return;
        const fallback = setTimeout(() => {
            const move = getRandomMove();
            if (move) makeMove(move.from, move.to);
        }, 6000);
        return () => clearTimeout(fallback);
    }, [turn, computerSide, mode, difficulty, gameEnded]);
}
