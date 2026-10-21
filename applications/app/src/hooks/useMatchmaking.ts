import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getSocket } from "@gopvp/common/src/util/socket";
import { useSocket } from "@gopvp/app/src/context/SocketContext";
import {
 useReduxSelector,
 useReduxDispatch,
} from "@gopvp/app/src/redux/hooks";
import { setOpeningMatchId } from "@gopvp/app/src/redux/socketModals/slice";
// import { showToast } from "@gopvp/app/src/redux/common/slice";
import { showAckErrorToast } from "@gopvp/common/src/util/api";
import { buildMatchUrl } from "@gopvp/app/src/utils";
import { useGame } from "@gopvp/app/src/hooks/useGame";
import { useCountdown } from "@gopvp/common/src/hooks/useCountdown";
import { shouldReduceMotion } from "@gopvp/common/src/util/motion";
import {
 POOL_TIMEOUT_SECONDS,
 MATCH_REVEAL_MS,
} from "@gopvp/app/src/constants/limit";
// import { noOpponentFoundText } from "@gopvp/app/src/constants/message";
import type {
 IPoolResponse,
 IMatchmakingResponse,
 IPoolMatchedEvent,
 IPoolRemovedEvent,
 IMatchPlayer,
 ISocketAckError,
} from "@gopvp/common/src/types/response";
import { SOCKET_EVENTS } from "@gopvp/common/src/constants/event";
import { ERROR_TYPES } from "@gopvp/common/src/constants/mapper";

export type MatchmakingStatus =
 | "idle"
 | "joining"
 | "queued"
 | "revealing"
 | "found"
 | "timeout";

export function useMatchmaking() {
 const [status, setStatus] = useState<MatchmakingStatus>("idle");
 const [queuedPool, setQueuedPool] = useState<IPoolResponse | null>(null);
 const [queueDeadlineAt, setQueueDeadlineAt] = useState<number | null>(null);
 const [opponentName, setOpponentName] = useState("");
 const revealTimerRef = useRef<ReturnType<typeof setTimeout>>();
 const myId = useReduxSelector((state) => state.auth.session?.id);
 const secondsLeft = useCountdown(queueDeadlineAt);
 const poolRef = useRef<IPoolResponse | null>(null);
 const joinPendingRef = useRef(false);
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
  joinPendingRef.current = false;
 }, []);

 const markTimedOut = useCallback(() => {
  if (!poolRef.current) return;
  poolRef.current = null;
  setQueueDeadlineAt(null);
  setStatus("timeout");
 }, []);

 const leaveQueue = useCallback(() => {
  if (poolRef.current) getSocket()?.emit(SOCKET_EVENTS.POOL_LEAVE, () => {});
  resetStatus();
 }, [resetStatus]);

 const openMatch = useCallback(
  (matchId: string, players?: IMatchPlayer[]) => {
   if (!poolRef.current) return;
   poolRef.current = null;
   dispatch(setOpeningMatchId(matchId));
   setQueueDeadlineAt(null);
   setOpponentName(players?.find((p) => p.id !== myId)?.username ?? "");
   setStatus("revealing");
   const delay = shouldReduceMotion() ? 0 : MATCH_REVEAL_MS;
   revealTimerRef.current = setTimeout(() => {
    setStatus("found");
    navigate(buildMatchUrl(game, matchId), { replace: true });
   }, delay);
  },
  [game, navigate, myId, dispatch],
 );

 const emitPoolJoin = useCallback(
  (pool: IPoolResponse) => {
   getSocket()?.emit(
    SOCKET_EVENTS.POOL_JOIN,
    { game, bet: pool.bet, time: pool.time },
    (err: ISocketAckError | null, data: IMatchmakingResponse) => {
     if (!poolRef.current) return;
     if (err) {
      if (err.errors[0]?.type === ERROR_TYPES.POOL_JOIN_IN_PROGRESS) return;
      showAckErrorToast(err);
      resetStatus();
      return;
     }
     if (data.status === "MATCHED" && data.match_type === "POOL") {
      openMatch(data.match_id, data.players);
      return;
     }
     setStatus("queued");
    },
   );
  },
  [game, resetStatus, openMatch],
 );

 const joinQueue = (pool: IPoolResponse) => {
  poolRef.current = pool;
  setQueuedPool(pool);
  setQueueDeadlineAt(Date.now() + POOL_TIMEOUT_SECONDS * 1000);
  setStatus("joining");
  joinPendingRef.current = !getSocket()?.connected;
  if (!joinPendingRef.current) emitPoolJoin(pool);
 };

 const retryQueue = () => {
  if (queuedPool) joinQueue(queuedPool);
 };

 useEffect(() => {
  const socket = ctxSocket ?? getSocket();
  if (!socket) return;

  const onMatched = (data: IPoolMatchedEvent) => {
   if (!data.matchId || !poolRef.current) return;
   openMatch(data.matchId, data.players);
  };

  const onPoolTimeout = () => {
   markTimedOut();
   // dispatch(
   //  showToast({
   //   isToastOpen: true,
   //   toastMessage: noOpponentFoundText,
   //   toastVariant: "info",
   //  }),
   // );
  };

  const onPoolRemoved = (data: IPoolRemovedEvent) => {
   showAckErrorToast(data);
   resetStatus();
  };

  const onReconnect = () => {
   joinPendingRef.current = false;
   if (!poolRef.current) return;
   setQueueDeadlineAt(Date.now() + POOL_TIMEOUT_SECONDS * 1000);
   emitPoolJoin(poolRef.current);
  };

  socket.on(SOCKET_EVENTS.MATCHED, onMatched);
  socket.on(SOCKET_EVENTS.POOL_TIMEOUT, onPoolTimeout);
  socket.on(SOCKET_EVENTS.POOL_REMOVED, onPoolRemoved);
  socket.on(SOCKET_EVENTS.CONNECT, onReconnect);
  if (socket.connected && joinPendingRef.current) onReconnect();
  // socket.on("queue_joined", onQueueJoined);
  // socket.on("match_found", onMatchFound);
  // socket.on("queue_left", onQueueLeft);
  // socket.on("queue_error", onQueueError);
  // socket.on("queue_timeout", onQueueTimeout);

  return () => {
   socket.off(SOCKET_EVENTS.MATCHED, onMatched);
   socket.off(SOCKET_EVENTS.POOL_TIMEOUT, onPoolTimeout);
   socket.off(SOCKET_EVENTS.POOL_REMOVED, onPoolRemoved);
   socket.off(SOCKET_EVENTS.CONNECT, onReconnect);
  };
 }, [ctxSocket, openMatch, emitPoolJoin, markTimedOut, resetStatus]);

 useEffect(() => {
  if (secondsLeft !== 0 || (status !== "queued" && status !== "joining")) return;
  getSocket()?.emit(SOCKET_EVENTS.POOL_LEAVE, markTimedOut);
 }, [secondsLeft, status, markTimedOut]);

 useEffect(
  () => () => {
   clearTimeout(revealTimerRef.current);
   if (poolRef.current) getSocket()?.emit(SOCKET_EVENTS.POOL_LEAVE, () => {});
  },
  [],
 );

 return {
  status,
  isSearching:
   status === "joining" || status === "queued" || status === "revealing",
  queuedPool,
  opponentName,
  secondsLeft: secondsLeft ?? 0,
  joinQueue,
  retryQueue,
  leaveQueue,
  resetStatus,
 };
}
