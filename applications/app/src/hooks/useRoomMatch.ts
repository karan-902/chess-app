import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Socket } from "socket.io-client";
import { getSocket } from "@gopvp/common/src/util/socket";
import { useSocket } from "@gopvp/app/src/context/SocketContext";
import { showAckErrorToast } from "@gopvp/common/src/util/api";
import { buildMatchUrl } from "@gopvp/app/src/utils";
import { useGame } from "@gopvp/app/src/hooks/useGame";
import { useCountdown } from "@gopvp/common/src/hooks/useCountdown";
import { useGameContext } from "@gopvp/common/src/contexts/GameContext";
import { snapshotMatchTicket } from "@gopvp/app/src/components/common/MatchTicket";
import {
 useReduxSelector,
 useReduxDispatch,
} from "@gopvp/app/src/redux/hooks";
import { setOpeningMatchId } from "@gopvp/app/src/redux/socketModals/slice";
import { shortenUsername } from "@gopvp/common/src/util/format";
import { readStorage, writeStorage } from "@gopvp/common/src/util/storage";
import { ROOM_STORAGE_KEY_PREFIX } from "@gopvp/app/src/constants/storageKey";
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

type TRoomInfo = {
 code: string;
 bet: number;
 time: number;
 win?: number;
 expiry: number;
 isOwner: boolean;
};

export function useRoomMatch(onRoomExpired?: () => void) {
 const userId = useReduxSelector((state) => state.auth.session?.id);
 const roomStorageKey = `${ROOM_STORAGE_KEY_PREFIX}${userId}`;
 const [savedRoom] = useState<TRoomInfo | null>(() => {
  const raw = readStorage(sessionStorage, roomStorageKey);
  const room: TRoomInfo | null = raw ? JSON.parse(raw) : null;
  return room && room.expiry > Date.now() ? room : null;
 });
 const [status, setStatus] = useState<RoomStatus>(
  savedRoom ? (savedRoom.isOwner ? "waiting" : "ready") : "idle",
 );
 const [isOwner, setIsOwner] = useState(savedRoom?.isOwner ?? false);
 const [roomCode, setRoomCode] = useState(savedRoom?.code ?? null);
 const [players, setPlayers] = useState<IMatchPlayer[]>([]);
 const sessionUsername = useReduxSelector(
  (state) => state.auth.session?.username ?? "",
 );
 const [expiryAt, setExpiryAt] = useState(savedRoom?.expiry ?? null);
 const isRoomOpen =
  status === "waiting" || status === "ready" || status === "starting";
 const expiresInSeconds = useCountdown(isRoomOpen ? expiryAt : null);
 const roomRef = useRef(savedRoom);
 const pendingEmitRef = useRef<((socket: Socket) => void) | null>(null);
 const requestIdRef = useRef(0);
 const statusRef = useRef<RoomStatus>("idle");
 statusRef.current = status;
 const onRoomExpiredRef = useRef(onRoomExpired);
 onRoomExpiredRef.current = onRoomExpired;
 const navigate = useNavigate();
 const dispatch = useReduxDispatch();
 const { game } = useGame();
 const { socket: ctxSocket } = useSocket();
 const { startReveal } = useGameContext();

 const resetStatus = useCallback(() => {
  requestIdRef.current++;
  setStatus("idle");
  setIsOwner(false);
  setRoomCode(null);
  setPlayers([]);
  roomRef.current = null;
  pendingEmitRef.current = null;
  writeStorage(sessionStorage, roomStorageKey, null);
 }, [roomStorageKey]);

 const emitWhenConnected = useCallback((emit: (socket: Socket) => void) => {
  const socket = getSocket();
  if (socket?.connected) emit(socket);
  else pendingEmitRef.current = emit;
 }, []);

 const enterRoom = (room: TRoomInfo, nextStatus: RoomStatus) => {
  roomRef.current = room;
  writeStorage(sessionStorage, roomStorageKey, JSON.stringify(room));
  setRoomCode(room.code);
  setIsOwner(room.isOwner);
  setExpiryAt(room.expiry);
  setStatus(nextStatus);
 };

 const openMatch = useCallback(
  (matchId: string) => {
   if (!roomRef.current) return;
   writeStorage(sessionStorage, roomStorageKey, null);
   const ticket = snapshotMatchTicket();
   if (ticket) startReveal?.(ticket);
   dispatch(setOpeningMatchId(matchId));
   setStatus("found");
   navigate(buildMatchUrl(game, matchId), { replace: true });
  },
  [game, navigate, dispatch, startReveal, roomStorageKey],
 );

 const createRoom = (bet: number, timeSeconds: number) => {
  const requestId = requestIdRef.current;
  setStatus("creating");
  emitWhenConnected((socket) =>
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
     enterRoom(
      {
       code: data.room_code,
       bet: data.bet,
       time: data.time,
       win: data.win_amount,
       expiry: data.expiry,
       isOwner: true,
      },
      "waiting",
     );
    },
   ),
  );
 };

 const joinRoom = (code: string) => {
  const requestId = requestIdRef.current;
  setStatus("joining");
  emitWhenConnected((socket) =>
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
       {
        code: data.room_code,
        bet: data.bet,
        time: data.time,
        win: data.win_amount,
        expiry: data.expiry,
        isOwner: false,
       },
       "ready",
      );
     }
    },
   ),
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
  if (!socket?.connected || !room) {
   resetStatus();
   return;
  }
  socket.emit(
   isOwner ? SOCKET_EVENTS.ROOM_CANCEL : SOCKET_EVENTS.ROOM_LEAVE,
   { room_code: room.code },
   (err: ISocketAckError | null) => {
    if (err) showAckErrorToast(err);
    else resetStatus();
   },
  );
 };

 useEffect(() => {
  const socket = ctxSocket ?? getSocket();
  if (!socket) return;

  const onMatched = (data: IRoomMatchedEvent) => {
   if (data.matchType !== "ROOM" || data.roomCode !== roomRef.current?.code)
    return;
   setPlayers(data.players);
   setStatus("ready");
  };

  const onMatchStarted = (data: IMatchStartedEvent) => openMatch(data.matchId);

  const onRoomLeft = () => {
   if (statusRef.current !== "ready") return;
   setPlayers([]);
   setStatus("waiting");
  };

  const onConnect = () => {
   const emit = pendingEmitRef.current;
   pendingEmitRef.current = null;
   emit?.(socket);
  };

  socket.on(SOCKET_EVENTS.MATCHED, onMatched);
  socket.on(SOCKET_EVENTS.MATCH_STARTED, onMatchStarted);
  socket.on(SOCKET_EVENTS.ROOM_LEFT, onRoomLeft);
  socket.on(SOCKET_EVENTS.CONNECT, onConnect);
  if (socket.connected) onConnect();

  return () => {
   socket.off(SOCKET_EVENTS.CONNECT, onConnect);
   socket.off(SOCKET_EVENTS.MATCHED, onMatched);
   socket.off(SOCKET_EVENTS.MATCH_STARTED, onMatchStarted);
   socket.off(SOCKET_EVENTS.ROOM_LEFT, onRoomLeft);
  };
 }, [ctxSocket, openMatch]);

 useEffect(() => {
  if (!savedRoom) return;
  const requestId = requestIdRef.current;
  emitWhenConnected((socket) =>
   socket.emit(
    SOCKET_EVENTS.ROOM_JOIN,
    { room_code: savedRoom.code },
    (err: ISocketAckError | null, data: IMatchmakingResponse) => {
     if (requestId !== requestIdRef.current) return;
     if (err) {
      resetStatus();
      onRoomExpiredRef.current?.();
      return;
     }
     if (data.status === "MATCHED" && data.match_type === "ROOM") {
      setPlayers(data.players);
      setStatus("ready");
     }
    },
   ),
  );
 }, [savedRoom, emitWhenConnected, resetStatus]);

 useEffect(() => {
  if ((status !== "waiting" && status !== "ready") || expiresInSeconds !== 0)
   return;
  resetStatus();
  onRoomExpiredRef.current?.();
 }, [status, expiresInSeconds, resetStatus]);

 return {
  status,
  isRoomActive: isRoomOpen || status === "creating" || status === "joining",
  isOwner,
  roomCode,
  opponentName: shortenUsername(
   players.find((player) => player.id !== userId)?.username ?? "",
  ),
  myName: shortenUsername(
   players.find((player) => player.id === userId)?.username ?? sessionUsername,
  ),
  roomFee: roomRef.current?.bet ?? 0,
  roomWin: roomRef.current?.win,
  roomTimeMs: roomRef.current?.time ?? 0,
  expiresInSeconds: expiresInSeconds ?? 0,
  createRoom,
  joinRoom,
  startRoom,
  cancelRoom,
  resetStatus,
 };
}
