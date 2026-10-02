import { useCallback, useEffect } from "react";
import type { MatchOutcome } from "@gopvp/common/src/types/index";
import type { IMatchResultResponse } from "@gopvp/common/src/types/response";
import type { IPvcSnapshot } from "@gopvp/chess/src/types/component";
import {
 loadPvcSnapshot,
 savePvcSnapshot,
} from "@gopvp/chess/src/utils/storage";
import { PVC_RESULTS } from "@gopvp/chess/src/constants/mapper";

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
 moveLog: IPvcSnapshot["moves"];
 whiteTimeMs: number;
 blackTimeMs: number;
 gameEnded: IMatchResultResponse | null;
 restoreGame: (moves: IPvcSnapshot["moves"]) => void;
 syncClock: (whiteRemainingMs: number, blackRemainingMs: number) => void;
 setGameEnded: (ended: IMatchResultResponse) => void;
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
 moveLog,
 whiteTimeMs,
 blackTimeMs,
 gameEnded,
 restoreGame,
 syncClock,
 setGameEnded,
}: IProps) {
 const endPvcGame = useCallback(
  (outcome: MatchOutcome, endReason: string) => {
   setGameEnded({
    id: gameId ?? "pvc",
    result: PVC_RESULTS[outcome],
    amount: 0,
    end_reason: endReason,
    score_change: 0,
   });
  },
  [gameId, setGameEnded],
 );

 useEffect(() => {
  if (!isPvc || !gameId) return;
  const snapshot = loadPvcSnapshot(gameId);
  if (!snapshot) return;
  restoreGame(snapshot.moves);
  syncClock(snapshot.whiteMs, snapshot.blackMs);
 }, [isPvc, gameId, restoreGame, syncClock]);

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
   !isCheckmate ? "draw" : winnerIsMe ? "win" : "loss",
   isCheckmate ? "CHECKMATE" : isStalemate ? "STALEMATE" : "DRAW",
  );
 }, [
  isPvc,
  isGameOver,
  isCheckmate,
  isStalemate,
  gameEnded,
  turn,
  computerSide,
  endPvcGame,
 ]);

 useEffect(() => {
  if (!isPvc || !timedOut || gameEnded) return;
  endPvcGame(timedOut === playerSide ? "loss" : "win", "TIMEOUT");
 }, [isPvc, timedOut, gameEnded, playerSide, endPvcGame]);

 return { endPvcGame };
}
