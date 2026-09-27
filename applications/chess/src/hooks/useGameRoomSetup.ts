import { useState } from "react";
import type { GameMode } from "@gopvp/chess/src/types/component";
import { shortenUsername } from "@gopvp/common/src/util/format";
import { oppositeSide } from "@gopvp/chess/src/utils";
import { isGameFinished } from "@gopvp/chess/src/utils/storage";
import { useChessSelector } from "@gopvp/chess/src/redux/chessHooks";

export function useGameRoomSetup(mode: GameMode) {
 const isPvc = mode === "pvc";
 const pvc = useChessSelector((state) => state.pvc);
 const match = useChessSelector((state) => state.match);
 const { self, opponent } = isPvc ? pvc : match;
 const gameId = isPvc ? (pvc.gameId ?? undefined) : match.state?.match_id;
 const playerSide = self?.color ?? "w";

 const [wasAlreadyFinished] = useState(
  () => !!gameId && isGameFinished(gameId),
 );

 return {
  isPvc,
  difficulty: pvc.difficulty,
  gameId,
  startingMs: isPvc ? pvc.time : (match.state?.time ?? 0),
  betAmount: isPvc ? 0 : (match.state?.bet ?? 0),
  playerSide,
  computerSide: oppositeSide(playerSide),
  myName: shortenUsername(self?.name ?? ""),
  myScoreLabel: self?.scoreLabel ?? "",
  opponentName: shortenUsername(opponent?.name ?? ""),
  opponentScoreLabel: opponent?.scoreLabel ?? "",
  wasAlreadyFinished,
 };
}
