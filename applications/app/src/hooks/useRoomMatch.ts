import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getSocket } from "@gopvp/common/src/util/socket";
import { useSocket } from "@gopvp/app/src/context/SocketContext";
import { showAckErrorToast } from "@gopvp/common/src/util/api";
import { buildMatchUrl } from "@gopvp/app/src/utils";
import { useGame } from "@gopvp/app/src/hooks/useGame";
import { useCountdown } from "@gopvp/common/src/hooks/useCountdown";
import { useReduxSelector } from "@gopvp/app/src/redux/hooks";
import { shortenUsername } from "@gopvp/common/src/util/format";
import type {
 ICreateRoomResponse,
 IMatchPlayer,
 IMatchmakingResponse,
 IMatchStartedEvent,
 IRoomMatchedEvent,
 ISocketAckError,
 IStartMatchResponse,
} from "@gopvp/common/src/types/response";
import { SOCKET_EVENTS } from "@gopvp/common/src/constants/event";

export type RoomStatus =
 "idle" | "creating" | "waiting" | "joining" | "ready" | "starting" | "found";

type TRoomInfo = { code: string; bet: number; time: number };

export function useRoomMatch(onRoomExpired?: () => void) {
 const [status, setStatus] = useState<RoomStatus>("idle");
 const [isOwner, setIsOwner] = useState(false);
 const [roomCode, setRoomCode] = useState<string | null>(null);
 const [players, setPlayers] = useState<IMatchPlayer[]>([]);
 const userId = useReduxSelector((state) => state.auth.session?.id);
 const [expiryAt, setExpiryAt] = useState<number | null>(null);
 const isRoomOpen =
  status === "waiting" || status === "ready" || status === "starting";
 const expiresInSeconds = useCountdown(
  isOwner && isRoomOpen ? expiryAt : null,
 );
 const roomRef = useRef<TRoomInfo | null>(null);
 const requestIdRef = useRef(0);
 const statusRef = useRef<RoomStatus>("idle");
 statusRef.current = status;
 const onRoomExpiredRef = useRef(onRoomExpired);
 onRoomExpiredRef.current = onRoomExpired;
 const navigate = useNavigate();
 const { game } = useGame();
 const { socket: ctxSocket } = useSocket();

 const resetStatus = useCallback(() => {
  requestIdRef.current++;
  setStatus("idle");
  setIsOwner(false);
  setRoomCode(null);
  roomRef.current = null;
 }, []);

 const enterRoom = (
  room: TRoomInfo,
  owner: boolean,
  nextStatus: RoomStatus,
 ) => {
  roomRef.current = room;
  setRoomCode(room.code);
  setIsOwner(owner);
  setStatus(nextStatus);
 };

 const openMatch = useCallback(
  (matchId: string) => {
   if (!roomRef.current) return;
   setStatus("found");
   navigate(buildMatchUrl(game, matchId), { replace: true });
  },
  [game, navigate],
 );

 const createRoom = (bet: number, timeSeconds: number) => {
  const socket = getSocket();
  if (!socket) return;
  const requestId = requestIdRef.current;
  setStatus("creating");
  socket.emit(
   SOCKET_EVENTS.ROOM_CREATE,
   { game, bet, time: timeSeconds * 1000 },
   (err: ISocketAckError | null, data: ICreateRoomResponse) => {
    if (requestId !== requestIdRef.current) {
     if (!err)
      socket.emit(
       SOCKET_EVENTS.ROOM_CANCEL,
       { room_code: data.room_code },
       () => {},
      );
     return;
    }
    if (err) {
     showAckErrorToast(err);
     resetStatus();
     return;
    }
    setExpiryAt(data.expiry);
    enterRoom(
     { code: data.room_code, bet: data.bet, time: data.time },
     true,
     "waiting",
    );
   },
  );
 };

 const joinRoom = (code: string) => {
  const socket = getSocket();
  if (!socket) return;
  const requestId = requestIdRef.current;
  setStatus("joining");
  socket.emit(
   SOCKET_EVENTS.ROOM_JOIN,
   { room_code: code },
   (err: ISocketAckError | null, data: IMatchmakingResponse) => {
    if (requestId !== requestIdRef.current) {
     if (!err)
      socket.emit(SOCKET_EVENTS.ROOM_LEAVE, { room_code: code }, () => {});
     return;
    }
    if (err) {
     showAckErrorToast(err);
     resetStatus();
     return;
    }
    if (data.status === "MATCHED" && data.match_type === "ROOM") {
     setPlayers(data.players);
     enterRoom(
      { code: data.room_code, bet: data.bet, time: data.time },
      false,
      "ready",
     );
    }
   },
  );
 };

 const startRoom = () => {
  const socket = getSocket();
  const room = roomRef.current;
  if (!socket || !room) return;
  setStatus("starting");
  socket.emit(
   SOCKET_EVENTS.ROOM_START,
   { room_code: room.code },
   (err: ISocketAckError | null, data: IStartMatchResponse) => {
    if (err) {
     showAckErrorToast(err);
     setStatus("ready");
     return;
    }
    if (data.status === "MATCHED") openMatch(data.match_id);
   },
  );
 };

 const cancelRoom = () => {
  const socket = getSocket();
  const room = roomRef.current;
  if (socket && room) {
   socket.emit(
    isOwner ? SOCKET_EVENTS.ROOM_CANCEL : SOCKET_EVENTS.ROOM_LEAVE,
    { room_code: room.code },
    () => {},
   );
  }
  resetStatus();
 };

 useEffect(() => {
  const socket = ctxSocket ?? getSocket();
  if (!socket) return;

  const onMatched = (data: IRoomMatchedEvent) => {
   if (data.matchType !== "ROOM" || statusRef.current !== "waiting") return;
   setPlayers(data.players);
   setStatus("ready");
  };

  const onMatchStarted = (data: IMatchStartedEvent) => openMatch(data.matchId);

  const onRoomLeft = () => {
   if (statusRef.current === "ready") setStatus("waiting");
  };

  socket.on(SOCKET_EVENTS.MATCHED, onMatched);
  socket.on(SOCKET_EVENTS.MATCH_STARTED, onMatchStarted);
  socket.on(SOCKET_EVENTS.ROOM_LEFT, onRoomLeft);

  return () => {
   socket.off(SOCKET_EVENTS.MATCHED, onMatched);
   socket.off(SOCKET_EVENTS.MATCH_STARTED, onMatchStarted);
   socket.off(SOCKET_EVENTS.ROOM_LEFT, onRoomLeft);
  };
 }, [ctxSocket, openMatch]);

 useEffect(() => {
  if ((status !== "waiting" && status !== "ready") || expiresInSeconds !== 0)
   return;
  resetStatus();
  onRoomExpiredRef.current?.();
 }, [status, expiresInSeconds, resetStatus]);

 return {
  status,
  isOwner,
  roomCode,
  opponentName: shortenUsername(
   players.find((player) => player.id !== userId)?.username ?? "",
  ),
  expiresInSeconds: expiresInSeconds ?? 0,
  createRoom,
  joinRoom,
  startRoom,
  cancelRoom,
  resetStatus,
 };
}
