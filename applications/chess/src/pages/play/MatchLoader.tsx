import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import Box from "@gopvp/common/src/components/Box/Box";
import GameRoom from "./GameRoom";
import { useSocket } from "@/context/SocketContext";
import { useGame } from "@/hooks/useGame";
import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import { clearMatchState } from "@/redux/match/slice";
import { loadMatchState } from "@/redux/match/thunk";

export default function MatchLoader({ matchId }: { matchId: string }) {
 const { socket } = useSocket();
 const { routes } = useGame();
 const dispatch = useReduxDispatch();
 const loadedMatchId = useReduxSelector((state) => state.match.state?.match_id);
 const [notFound, setNotFound] = useState(false);

 useEffect(() => {
  if (!socket) return;
  setNotFound(false);
  dispatch(loadMatchState(matchId))
   .unwrap()
   .then((isLoaded) => {
    if (isLoaded) return;
    dispatch(clearMatchState());
    setNotFound(true);
   });
 }, [socket, matchId, dispatch]);

 if (notFound) return <Navigate to={routes.PLAY} replace />;

 if (loadedMatchId !== matchId) {
  return (
   <Box customClass="modal-loader">
    <CircularProgress size={28} />
   </Box>
  );
 }

 return <GameRoom mode="pvp" />;
}
