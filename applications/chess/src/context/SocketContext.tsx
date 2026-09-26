import {
 createContext,
 useContext,
 useEffect,
 useState,
 useRef,
 type ReactNode,
} from "react";

import type { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { useReduxSelector, useReduxDispatch } from "@/redux/hooks";
import { store } from "@/redux/store";
import { setActiveGame } from "@/redux/socketModals/slice";
import { generateToken, isGamePlayPath } from "@/utils";
import sessionService from "@gopvp/common/src/util/sessionService";
import { router } from "@/routes/router";
import { navigateTo } from "@gopvp/common/src/util/navigationService";
import RejoinGameModal from "@/components/common/RejoinGameModal";
import type { IActiveGameFoundResponse } from "@/types/types";

interface ISocketContext {
 socket: Socket | null;
}

const SocketContext = createContext<ISocketContext>({
 socket: null,
});

export function SocketProvider({ children }: { children: ReactNode }) {
 const session = useReduxSelector((state) => state.auth.session);
 const isLoggedIn = useReduxSelector((state) => state.auth.isLoggedIn);
 const isGameReady = useReduxSelector((state) => !!state.game.details);
 const dispatch = useReduxDispatch();
 const [socket, setSocket] = useState<Socket | null>(null);
 const reconnectingRef = useRef(false);

 useEffect(() => {
  if (!isLoggedIn || !session?.access_token || !isGameReady) {
   disconnectSocket();
   setSocket(null);
   return;
  }

  const sock = connectSocket(session.access_token);
  sock.auth = { token: session.access_token };
  setSocket(sock);

  const onConnect = () => {
   reconnectingRef.current = false;
  };

  const onConnectError = async () => {
   if (sock.active) return;

   if (reconnectingRef.current) return;
   reconnectingRef.current = true;

   sock.io.reconnection(false);

   try {
    const newToken = await generateToken();
    sock.auth = { token: newToken };

    sock.io.reconnection(true);
    sock.connect();
   } catch {
    reconnectingRef.current = false;
    sock.io.reconnection(true);
    console.warn("[Socket] token refresh failed — session expired");
   }
  };

  const onSessionTerminated = async () => {
   disconnectSocket();
   await sessionService.deleteSession();
   navigateTo("/login", { replace: true });
  };

  const onActiveGameFound = (data: IActiveGameFoundResponse) => {
   const { pathname, search } = router.state.location;
   const viewingGameId = new URLSearchParams(search).get("game_id");
   if (isGamePlayPath(pathname) && viewingGameId === data.game_id) return;

   if (store.getState().socketModals.deviceHandoff !== null) return;
   dispatch(setActiveGame(data));
  };

  sock.on("connect", onConnect);
  sock.on("active_game_found", onActiveGameFound);
  sock.on("connect_error", onConnectError);
  sock.on("session:replaced", onSessionTerminated);

  return () => {
   sock.off("connect", onConnect);
   sock.off("active_game_found", onActiveGameFound);
   sock.off("connect_error", onConnectError);
   sock.off("session:replaced", onSessionTerminated);
  };
 }, [isLoggedIn, session?.access_token, isGameReady]);

 useEffect(() => {
  if (!socket) return;
  let lastCheckedAt = 0;
  const maybeCheckActiveGame = () => {
   if (Date.now() - lastCheckedAt < 10_000) return;
   const { pathname, search } = router.state.location;
   const viewingGameId = new URLSearchParams(search).get("game_id");
   if (isGamePlayPath(pathname) && viewingGameId) return;
   lastCheckedAt = Date.now();
   socket.emit("check_active_game");
  };

  const unsubscribeRouter = router.subscribe(maybeCheckActiveGame);
  const onVisibilityChange = () => {
   if (document.visibilityState === "visible") maybeCheckActiveGame();
  };
  document.addEventListener("visibilitychange", onVisibilityChange);

  return () => {
   unsubscribeRouter();
   document.removeEventListener("visibilitychange", onVisibilityChange);
  };
 }, [socket]);

 return (
  <SocketContext.Provider value={{ socket }}>
   {children}

   <RejoinGameModal />
  </SocketContext.Provider>
 );
}

export function useSocket() {
 return useContext(SocketContext);
}
