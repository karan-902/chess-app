import { useEffect } from "react";
import type { MatchResult } from "@gopvp/common/src/types/index";
import type { IMatchResultResponse } from "@gopvp/common/src/types/response";
import type { IPvcSnapshot } from "@gopvp/chess/src/types/component";
import type { MatchOutcome } from "@gopvp/chess/src/types/index";
import { loadPvcSnapshot, savePvcSnapshot } from "@gopvp/chess/src/utils/storage";

const PVC_RESULTS: Record<MatchOutcome, MatchResult> = {
 win: "WIN",
 loss: "BET",
 draw: "DRAW",
};

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
 const endPvcGame = (outcome: MatchOutcome, endReason: string) => {
  setGameEnded({
   id: gameId ?? "pvc",
   result: PVC_RESULTS[outcome],
   amount: 0,
   end_reason: endReason,
   score_change: 0,
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
   !isCheckmate ? "draw" : winnerIsMe ? "win" : "loss",
   isCheckmate ? "CHECKMATE" : isStalemate ? "STALEMATE" : "DRAW",
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
 ]);

 useEffect(() => {
  if (!isPvc || !timedOut || gameEnded) return;
  endPvcGame(timedOut === playerSide ? "loss" : "win", "TIMEOUT");
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [isPvc, timedOut, gameEnded, gameId, playerSide]);

 return { endPvcGame };
}
