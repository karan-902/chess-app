import { useEffect } from "react";
import type { GameMode } from "@gopvp/chess/src/types/component";
import {
 COMPUTER_FALLBACK_MOVE_MS,
 COMPUTER_MOVE_MIN_DELAY_MS,
 COMPUTER_MOVE_MAX_DELAY_MS,
} from "@gopvp/chess/src/constants/limit";

interface IProps {
 mode: GameMode;
 turn: "w" | "b";
 computerSide: "w" | "b";
 gameEnded: boolean;
 bestMove: string | null;
 randomMoves: boolean;
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
 randomMoves,
 makeMove,
 getRandomMove,
}: IProps) {
 useEffect(() => {
  if (mode !== "pvc" || turn !== computerSide || gameEnded) return;
  if (!randomMoves && !bestMove) return;
  const t = setTimeout(
   () => {
    const move =
     bestMove && !randomMoves
      ? { from: bestMove.slice(0, 2), to: bestMove.slice(2, 4) }
      : getRandomMove();
    if (move) makeMove(move.from, move.to);
   },
   COMPUTER_MOVE_MIN_DELAY_MS +
    Math.random() * (COMPUTER_MOVE_MAX_DELAY_MS - COMPUTER_MOVE_MIN_DELAY_MS),
  );
  return () => clearTimeout(t);
 }, [
  bestMove,
  randomMoves,
  turn,
  computerSide,
  mode,
  gameEnded,
  makeMove,
  getRandomMove,
 ]);

 useEffect(() => {
  if (mode !== "pvc" || turn !== computerSide || gameEnded) return;
  const fallback = setTimeout(() => {
   const move = getRandomMove();
   if (move) makeMove(move.from, move.to);
  }, COMPUTER_FALLBACK_MOVE_MS);
  return () => clearTimeout(fallback);
 }, [turn, computerSide, mode, gameEnded, getRandomMove, makeMove]);
}
