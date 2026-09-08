import { useEffect } from "react";
import type { IgameEndedResponse } from "@/types/types";
import type { IPvcSnapshot } from "@/types/components";
import { loadPvcSnapshot, savePvcSnapshot } from "@/utils/storage";

interface IProps {
    isPvc: boolean;
    gameId: string | undefined;
    turn: "w" | "b";
    computerSide: "w" | "b";
    playerSide: "w" | "b";
    isGameOver: boolean;
    isCheckmate: boolean;
    isStalemate: boolean;
    timedOut: "w" | "b" | null;
    myUserId: string | undefined;
    moveLog: IPvcSnapshot["moves"];
    whiteTimeMs: number;
    blackTimeMs: number;
    gameEnded: IgameEndedResponse | null;
    restoreGame: (moves: IPvcSnapshot["moves"]) => void;
    syncClock: (whiteRemainingMs: number, blackRemainingMs: number) => void;
    setGameEnded: (ended: IgameEndedResponse) => void;
}

export function usePvcGameEnd({
    isPvc,
    gameId,
    turn,
    computerSide,
    playerSide,
    isGameOver,
    isCheckmate,
    isStalemate,
    timedOut,
    myUserId,
    moveLog,
    whiteTimeMs,
    blackTimeMs,
    gameEnded,
    restoreGame,
    syncClock,
    setGameEnded,
}: IProps) {
    const endPvcGame = (winnerId: string | null, reason: string) => {
        setGameEnded({
            game_id: gameId ?? "pvc",
            winner_id: winnerId,
            reason,
            settlement: null,
        });
    };

    useEffect(() => {
        if (!isPvc || !gameId) return;
        const snapshot = loadPvcSnapshot(gameId);
        if (!snapshot) return;
        restoreGame(snapshot.moves);
        syncClock(snapshot.whiteMs, snapshot.blackMs);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPvc, gameId]);

    useEffect(() => {
        if (!isPvc || !gameId || moveLog.length === 0) return;
        savePvcSnapshot(gameId, {
            moves: moveLog,
            whiteMs: whiteTimeMs,
            blackMs: blackTimeMs,
        });
    }, [isPvc, gameId, moveLog, whiteTimeMs, blackTimeMs]);

    useEffect(() => {
        if (!isPvc || !isGameOver || gameEnded) return;
        const winnerIsMe = isCheckmate && turn === computerSide;
        endPvcGame(
            !isCheckmate ? null : winnerIsMe ? (myUserId ?? "me") : "computer",
            isCheckmate ? "checkmate" : isStalemate ? "stalemate" : "draw",
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        isPvc,
        isGameOver,
        isCheckmate,
        isStalemate,
        gameEnded,
        turn,
        computerSide,
        gameId,
        myUserId,
    ]);

    useEffect(() => {
        if (!isPvc || !timedOut || gameEnded) return;
        endPvcGame(
            timedOut === playerSide ? "computer" : (myUserId ?? "me"),
            "timeout",
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPvc, timedOut, gameEnded, gameId, myUserId, playerSide]);

    return { endPvcGame };
}
