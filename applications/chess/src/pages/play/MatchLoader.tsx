import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import Box from "@gopvp/common/src/components/Box/Box";
import { useGameContext } from "@gopvp/common/src/contexts/GameContext";
import GameRoom from "@gopvp/chess/src/pages/play/GameRoom";
import {
 useChessDispatch,
 useChessSelector,
} from "@gopvp/chess/src/redux/chessHooks";
import { clearMatchState } from "@gopvp/chess/src/redux/match/slice";
import { loadMatchState } from "@gopvp/chess/src/redux/match/thunk";

export default function MatchLoader({ matchId }: { matchId: string }) {
 const { socket, playPath, userId } = useGameContext();
 const dispatch = useChessDispatch();
 const loadedMatchId = useChessSelector((state) => state.match.state?.match_id);
 const [notFound, setNotFound] = useState(false);

 useEffect(() => {
  if (!socket) return;
  setNotFound(false);
  dispatch(loadMatchState({ matchId, userId }))
   .unwrap()
   .then((isLoaded) => {
    if (isLoaded) return;
    dispatch(clearMatchState());
    setNotFound(true);
   });
 }, [socket, matchId, userId, dispatch]);

 if (notFound) return <Navigate to={playPath} replace />;

 if (loadedMatchId !== matchId) {
  return (
   <Box customClass="modal-loader">
    <CircularProgress size={28} />
   </Box>
  );
 }

 return <GameRoom mode="pvp" />;
}
