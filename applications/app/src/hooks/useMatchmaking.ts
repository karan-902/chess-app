import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getSocket } from "@gopvp/common/src/util/socket";
import { useSocket } from "@gopvp/app/src/context/SocketContext";
import { useReduxDispatch, useReduxSelector } from "@gopvp/app/src/redux/hooks";
import { showToast } from "@gopvp/app/src/redux/common/slice";
import { showAckErrorToast } from "@gopvp/common/src/util/api";
import { buildMatchUrl } from "@gopvp/app/src/utils";
import { useGame } from "@gopvp/app/src/hooks/useGame";
import { useCountdown } from "@gopvp/common/src/hooks/useCountdown";
import {
 POOL_TIMEOUT_SECONDS,
 MATCH_REVEAL_MS,
} from "@gopvp/app/src/constants/limit";
import { noOpponentFoundText } from "@gopvp/app/src/constants/message";
import type {
 IPoolResponse,
 IMatchmakingResponse,
 IPoolMatchedEvent,
 IMatchPlayer,
 ISocketAckError,
} from "@gopvp/common/src/types/response";
import { SOCKET_EVENTS } from "@gopvp/common/src/constants/event";

export type MatchmakingStatus =
 | "idle"
 | "joining"
 | "queued"
 | "revealing"
 | "found";

export function useMatchmaking() {
 const [status, setStatus] = useState<MatchmakingStatus>("idle");
 const [queuedPool, setQueuedPool] = useState<IPoolResponse | null>(null);
 const [queueDeadlineAt, setQueueDeadlineAt] = useState<number | null>(null);
 const [opponentName, setOpponentName] = useState("");
 const revealTimerRef = useRef<ReturnType<typeof setTimeout>>();
 const myId = useReduxSelector((state) => state.auth.session?.id);
 const secondsLeft = useCountdown(queueDeadlineAt);
 const poolRef = useRef<IPoolResponse | null>(null);
 const navigate = useNavigate();
 const { game } = useGame();
 const { socket: ctxSocket } = useSocket();
 const dispatch = useReduxDispatch();

 const resetStatus = useCallback(() => {
  clearTimeout(revealTimerRef.current);
  setStatus("idle");
  setQueuedPool(null);
  setQueueDeadlineAt(null);
  setOpponentName("");
  poolRef.current = null;
 }, []);

 const leaveQueue = useCallback(() => {
  if (poolRef.current) getSocket()?.emit(SOCKET_EVENTS.POOL_LEAVE, () => {});
  resetStatus();
 }, [resetStatus]);

 const openMatch = useCallback(
  (matchId: string, players?: IMatchPlayer[]) => {
   if (!poolRef.current) return;
   poolRef.current = null;
   setQueueDeadlineAt(null);
   setOpponentName(players?.find((p) => p.id !== myId)?.username ?? "");
   setStatus("revealing");
   const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? 0
    : MATCH_REVEAL_MS;
   revealTimerRef.current = setTimeout(() => {
    setStatus("found");
    navigate(buildMatchUrl(game, matchId), { replace: true });
   }, delay);
  },
  [game, navigate, myId],
 );

 const emitPoolJoin = useCallback(
  (pool: IPoolResponse) => {
   getSocket()?.emit(
    SOCKET_EVENTS.POOL_JOIN,
    { game, bet: pool.bet, time: pool.time },
    (err: ISocketAckError | null, data: IMatchmakingResponse) => {
     if (!poolRef.current) return;
     if (err) {
      showAckErrorToast(err);
      resetStatus();
      return;
     }
     if (data.status === "MATCHED" && data.match_type === "POOL") {
      openMatch(data.match_id, data.players);
      return;
     }
     setQueueDeadlineAt(Date.now() + POOL_TIMEOUT_SECONDS * 1000);
     setStatus("queued");
    },
   );
  },
  [game, resetStatus, openMatch],
 );

 const joinQueue = (pool: IPoolResponse) => {
  if (!getSocket()) return;
  poolRef.current = pool;
  setQueuedPool(pool);
  setStatus("joining");
  emitPoolJoin(pool);
 };

 useEffect(() => {
  const socket = ctxSocket ?? getSocket();
  if (!socket) return;

  const onMatched = (data: IPoolMatchedEvent) => {
   if (!data.matchId || !poolRef.current) return;
   openMatch(data.matchId, data.players);
  };

  const onPoolTimeout = () => {
   resetStatus();
   dispatch(
    showToast({
     isToastOpen: true,
     toastMessage: noOpponentFoundText,
     toastVariant: "info",
    }),
   );
  };

  const onReconnect = () => {
   if (poolRef.current) emitPoolJoin(poolRef.current);
  };

  socket.on(SOCKET_EVENTS.MATCHED, onMatched);
  socket.on(SOCKET_EVENTS.POOL_TIMEOUT, onPoolTimeout);
  socket.on(SOCKET_EVENTS.CONNECT, onReconnect);
  // socket.on("queue_joined", onQueueJoined);
  // socket.on("match_found", onMatchFound);
  // socket.on("queue_left", onQueueLeft);
  // socket.on("queue_error", onQueueError);
  // socket.on("queue_timeout", onQueueTimeout);

  return () => {
   socket.off(SOCKET_EVENTS.MATCHED, onMatched);
   socket.off(SOCKET_EVENTS.POOL_TIMEOUT, onPoolTimeout);
   socket.off(SOCKET_EVENTS.CONNECT, onReconnect);
  };
 }, [ctxSocket, dispatch, openMatch, resetStatus, emitPoolJoin]);

 useEffect(
  () => () => {
   clearTimeout(revealTimerRef.current);
   if (poolRef.current) getSocket()?.emit(SOCKET_EVENTS.POOL_LEAVE, () => {});
  },
  [],
 );

 return {
  status,
  queuedPool,
  opponentName,
  secondsLeft: secondsLeft ?? 0,
  joinQueue,
  leaveQueue,
  resetStatus,
 };
}
