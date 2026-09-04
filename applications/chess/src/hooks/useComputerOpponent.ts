import { useEffect } from "react";
import type { GameMode } from "@/types/components";

const COMPUTER_MOVE_DELAY_MS = 2500;

interface IProps {
    mode: GameMode;
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
    turn,
    computerSide,
    gameEnded,
    bestMove,
    makeMove,
    getRandomMove,
}: IProps) {
    useEffect(() => {
        if (mode !== "pvc" || turn !== computerSide || !bestMove || gameEnded) {
            return;
        }
        const t = setTimeout(
            () => makeMove(bestMove.slice(0, 2), bestMove.slice(2, 4)),
            COMPUTER_MOVE_DELAY_MS,
        );
        return () => clearTimeout(t);
    }, [bestMove, turn, computerSide, mode, gameEnded]);

    useEffect(() => {
        if (mode !== "pvc" || turn !== computerSide || gameEnded) return;
        const fallback = setTimeout(() => {
            const move = getRandomMove();
            if (move) makeMove(move.from, move.to);
        }, 6000);
        return () => clearTimeout(fallback);
    }, [turn, computerSide, mode, gameEnded]);
}
