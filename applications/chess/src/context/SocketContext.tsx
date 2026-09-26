import {
 createContext,
 useContext,
 useEffect,
 useState,
 useRef,
 type ReactNode,
} from "react";

import type { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket } from "@gopvp/common/src/util/socket";
import { useReduxSelector, useReduxDispatch } from "@/redux/hooks";
import { store } from "@/redux/store";
import { setActiveGame } from "@/redux/socketModals/slice";
import { loadMatchState } from "@/redux/match/thunk";
import { generateToken } from "@gopvp/common/src/util/api";
import { isGamePlayPath } from "@/utils";
import sessionService from "@gopvp/common/src/util/sessionService";
import { router } from "@/routes/router";
import { navigateTo } from "@gopvp/common/src/util/navigationService";
import RejoinGameModal from "@/components/common/RejoinGameModal";
import type { IActiveGameEvent } from "@gopvp/common/src/types/response";

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

  const onActiveGame = async (data: IActiveGameEvent) => {
   const { pathname, search } = router.state.location;
   const viewingMatchId = new URLSearchParams(search).get("match");
   if (isGamePlayPath(pathname) && viewingMatchId === data.match_id) return;

   if (store.getState().socketModals.deviceHandoff !== null) return;
   if (await dispatch(loadMatchState(data.match_id)).unwrap()) {
    dispatch(setActiveGame(data));
   }
  };

  sock.on("connect", onConnect);
  sock.on("game:active", onActiveGame);
  sock.on("connect_error", onConnectError);
  sock.on("session:replaced", onSessionTerminated);

  return () => {
   sock.off("connect", onConnect);
   sock.off("game:active", onActiveGame);
   sock.off("connect_error", onConnectError);
   sock.off("session:replaced", onSessionTerminated);
  };
 }, [isLoggedIn, session?.access_token, isGameReady]);

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
