import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getSocket } from "@/lib/socket";
import { useSocket } from "@/context/SocketContext";
import { buildMatchUrl, showAckErrorToast } from "@/utils";
import { useGame } from "@/hooks/useGame";
import { useCountdown } from "@/hooks/useCountdown";
import type {
 ICreateRoomResponse,
 IMatchmakingResponse,
 IMatchStartedEvent,
 IRoomMatchedEvent,
 ISocketAckError,
 IStartMatchResponse,
} from "@gopvp/common/src/types/response";

export type RoomStatus =
 | "idle"
 | "creating"
 | "waiting"
 | "joining"
 | "ready"
 | "starting"
 | "found";

type TRoomInfo = { code: string; bet: number; time: number };

export function useRoomMatch(onRoomExpired?: () => void) {
 const [status, setStatus] = useState<RoomStatus>("idle");
 const [isOwner, setIsOwner] = useState(false);
 const [roomCode, setRoomCode] = useState<string | null>(null);
 const [expiryAt, setExpiryAt] = useState<number | null>(null);
 const expiresInSeconds = useCountdown(status === "waiting" ? expiryAt : null);
 const roomRef = useRef<TRoomInfo | null>(null);
 const statusRef = useRef<RoomStatus>("idle");
 statusRef.current = status;
 const onRoomExpiredRef = useRef(onRoomExpired);
 onRoomExpiredRef.current = onRoomExpired;
 const navigate = useNavigate();
 const { game } = useGame();
 const { socket: ctxSocket } = useSocket();

 const resetStatus = useCallback(() => {
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
  setStatus("creating");
  socket.emit(
   "room:create",
   { game, bet, time: timeSeconds * 1000 },
   (err: ISocketAckError | null, data: ICreateRoomResponse) => {
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
  setStatus("joining");
  socket.emit(
   "room:join",
   { room_code: code },
   (err: ISocketAckError | null, data: IMatchmakingResponse) => {
    if (err) {
     showAckErrorToast(err);
     resetStatus();
     return;
    }
    if (data.status === "MATCHED" && data.match_type === "ROOM") {
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
   "room:start",
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
    isOwner ? "room:cancel" : "room:leave",
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
   setStatus("ready");
  };

  const onMatchStarted = (data: IMatchStartedEvent) => openMatch(data.matchId);

  const onRoomLeft = () => {
   if (statusRef.current === "ready") setStatus("waiting");
  };

  socket.on("matched", onMatched);
  socket.on("match:started", onMatchStarted);
  socket.on("room:left", onRoomLeft);

  return () => {
   socket.off("matched", onMatched);
   socket.off("match:started", onMatchStarted);
   socket.off("room:left", onRoomLeft);
  };
 }, [ctxSocket, openMatch]);

 useEffect(() => {
  if (status !== "waiting" || expiresInSeconds !== 0) return;
  resetStatus();
  onRoomExpiredRef.current?.();
 }, [status, expiresInSeconds, resetStatus]);

 return {
  status,
  isOwner,
  roomCode,
  expiresInSeconds: expiresInSeconds ?? 0,
  createRoom,
  joinRoom,
  startRoom,
  cancelRoom,
  resetStatus,
 };
}
