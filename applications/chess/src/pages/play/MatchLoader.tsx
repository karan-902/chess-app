import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Box from "@gopvp/common/src/components/Box/Box";
import { useGameContext } from "@gopvp/common/src/contexts/GameContext";
import GameRoomGuard from "@gopvp/chess/src/pages/play/GameRoomGuard";
import {
 useChessDispatch,
 useChessSelector,
} from "@gopvp/chess/src/redux/chessHooks";
import { clearMatchState } from "@gopvp/chess/src/redux/match/slice";
import { loadMatchState } from "@gopvp/chess/src/redux/match/thunk";
import type { IMatchLoaderProps } from "@gopvp/chess/src/types/component";

export default function MatchLoader({ matchId }: IMatchLoaderProps) {
 const { socket, playPath, userId } = useGameContext();
 const dispatch = useChessDispatch();
 const loadedMatchId = useChessSelector((state) => state.match.state?.match_id);
 const [notFound, setNotFound] = useState(false);

 useEffect(() => {
  if (!socket) return;
  setNotFound(false);
  const loadMatch = async () => {
   const isLoaded = await dispatch(
    loadMatchState({ matchId, userId }),
   ).unwrap();
   if (isLoaded) return;
   dispatch(clearMatchState());
   setNotFound(true);
  };
  loadMatch();
 }, [socket, matchId, userId, dispatch]);

 if (notFound) return <Navigate to={playPath} replace />;

 if (loadedMatchId !== matchId) {
  return (
   <Box customClass="modal-loader">
    <Box customClass="logo-loader" role="progressbar" />
   </Box>
  );
 }

 return <GameRoomGuard mode="pvp" />;
}
