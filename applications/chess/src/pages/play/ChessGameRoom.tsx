import { Navigate, useSearchParams } from "react-router-dom";
import { useGameContext } from "@gopvp/common/src/contexts/GameContext";
import GameRoom from "@gopvp/chess/src/pages/play/GameRoom";
import MatchLoader from "@gopvp/chess/src/pages/play/MatchLoader";
import { useChessSelector } from "@gopvp/chess/src/redux/chessHooks";

export default function ChessGameRoom() {
 const [searchParams] = useSearchParams();
 const { playPath } = useGameContext();
 const pvcGameId = useChessSelector((state) => state.pvc.gameId);
 const matchId = searchParams.get("match");
 const gameId = searchParams.get("game_id");

 if (matchId) return <MatchLoader matchId={matchId} />;

 return gameId === pvcGameId ? (
  <GameRoom mode="pvc" />
 ) : (
  <Navigate to={playPath} replace />
 );
}
