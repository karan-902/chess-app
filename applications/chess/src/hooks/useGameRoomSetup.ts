import { useState } from "react";
import type { TimeControl, GameMode, Difficulty } from "@/types/components";
import type { GameCategory } from "@/types/types";
import { oppositeSide, shortenUsername } from "@/utils";
import { isGameFinished, getPvcColor, setPvcColor } from "@/utils/storage";
import {
    playOpponentFallbackOpponent,
    playOpponentFallbackComputer,
} from "@/constants/messages";

export function useGameRoomSetup(params: URLSearchParams, usdValue: number) {
    const mode: GameMode = params.get("mode") === "pvc" ? "pvc" : "pvp";
    const isPvc = mode === "pvc";
    const difficulty: Difficulty =
        (params.get("difficulty") as Difficulty) || "medium";
    const gameId = params.get("game_id") ?? undefined;
    const timeControl = (params.get("time") as TimeControl) || "rapid";
    const myCategory = timeControl.toUpperCase() as GameCategory;
    const playerSide: "w" | "b" = params.get("color") === "black" ? "b" : "w";
    const computerSide = oppositeSide(playerSide);
    const opponentName = isPvc
        ? playOpponentFallbackComputer
        : params.get("opponent")
          ? shortenUsername(decodeURIComponent(params.get("opponent")!))
          : playOpponentFallbackOpponent;
    const isRoomMatch = params.get("room") === "1";
    const opponentRating = Number(params.get("opp_rating") ?? 0);
    const opponentId = params.get("opp_id") ?? undefined;
    const stakeAmount = Number(params.get("stake_amount") ?? 0);
    const canAffordRematch = usdValue >= stakeAmount;

    const [wasAlreadyFinished] = useState(
        () => !!gameId && isGameFinished(gameId),
    );

    const [pvcColorRedirect] = useState<string | null>(() => {
        if (!isPvc || !gameId) return null;
        const urlColor = params.get("color") ?? "white";
        const storedColor = getPvcColor(gameId);
        if (!storedColor) {
            setPvcColor(gameId, urlColor);
            return null;
        }
        if (storedColor === urlColor) return null;
        const corrected = new URLSearchParams(params);
        corrected.set("color", storedColor);
        return `/play?${corrected.toString()}`;
    });

    return {
        mode,
        isPvc,
        difficulty,
        gameId,
        timeControl,
        myCategory,
        playerSide,
        computerSide,
        opponentName,
        isRoomMatch,
        opponentRating,
        opponentId,
        stakeAmount,
        canAffordRematch,
        wasAlreadyFinished,
        pvcColorRedirect,
    };
}
