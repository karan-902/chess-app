import { useState, useEffect } from "react";
import {
 callAPIInterface,
 showApiErrorToast,
} from "@gopvp/common/src/util/api";
import { getSocket } from "@gopvp/common/src/util/socket";
import { useSocket } from "@gopvp/app/src/context/SocketContext";
import { useGame } from "@gopvp/app/src/hooks/useGame";
import type {
 IPoolResponse,
 IPoolUpdatedEvent,
} from "@gopvp/common/src/types/response";
import { ENDPOINTS } from "@gopvp/common/src/constants/endpoint";
import { SOCKET_EVENTS } from "@gopvp/common/src/constants/event";

export function usePools() {
 const { game } = useGame();
 const { socket: ctxSocket } = useSocket();
 const [pools, setPools] = useState<IPoolResponse[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(false);

 useEffect(() => {
  const loadPools = async () => {
   try {
    setPools(
     await callAPIInterface<IPoolResponse[], undefined>(
      "GET",
      `${ENDPOINTS.POOLS}?game=${game}`,
     ),
    );
   } catch (err) {
    setError(true);
    setPools([]);
    showApiErrorToast(err);
   } finally {
    setLoading(false);
   }
  };
  loadPools();
 }, [game]);

 useEffect(() => {
  const socket = ctxSocket ?? getSocket();
  if (!socket) return;

  const onPoolUpdated = (data: IPoolUpdatedEvent) => {
   if (data.game === game) setPools(data.pools);
  };

  socket.on(SOCKET_EVENTS.POOL_UPDATED, onPoolUpdated);
  return () => {
   socket.off(SOCKET_EVENTS.POOL_UPDATED, onPoolUpdated);
  };
 }, [ctxSocket, game]);

 return { pools, loading, error };
}
