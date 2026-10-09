import {
 createContext,
 useContext,
 useEffect,
 useState,
 useRef,
 type PropsWithChildren,
} from "react";

import type { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket } from "@gopvp/common/src/util/socket";
import { useReduxSelector, useReduxDispatch } from "@gopvp/app/src/redux/hooks";
import { store } from "@gopvp/app/src/redux/store";
import { setActiveGame } from "@gopvp/app/src/redux/socketModals/slice";
import {
 generateToken,
 getNewestAccessToken,
 LOGOUT_ERROR_TYPES,
} from "@gopvp/common/src/util/api";
import { showToastMessage } from "@gopvp/common/src/util/injectStore";
import { getGameFromPath } from "@gopvp/app/src/utils";
import sessionService from "@gopvp/common/src/util/sessionService";
import { router } from "@gopvp/app/src/routes/router";
import { navigateTo } from "@gopvp/common/src/util/navigationService";
import RejoinGameModal from "@gopvp/app/src/components/common/RejoinGameModal";
import { subscribeActiveGame } from "@gopvp/app/src/utils/matchResult";
import { ROUTES } from "@gopvp/app/src/constants/route";
import { SOCKET_EVENTS } from "@gopvp/common/src/constants/event";

interface ISocketContext {
 socket: Socket | null;
}

const SocketContext = createContext<ISocketContext>({
 socket: null,
});

export function SocketProvider({ children }: PropsWithChildren) {
 const session = useReduxSelector((state) => state.auth.session);
 const isLoggedIn = useReduxSelector((state) => state.auth.isLoggedIn);
 const isGameReady = useReduxSelector((state) => !!state.game.details);
 const dispatch = useReduxDispatch();
 const [socket, setSocket] = useState<Socket | null>(null);
 const reconnectingRef = useRef(false);
 const invalidTokenRetriedRef = useRef(false);

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
   invalidTokenRetriedRef.current = false;
  };

  const onSessionTerminated = async () => {
   disconnectSocket();
   await sessionService.deleteSession();
   navigateTo(ROUTES.LOGIN, { replace: true });
  };

  const reconnectWithToken = async (getToken: () => Promise<string>) => {
   if (reconnectingRef.current) return;
   reconnectingRef.current = true;
   sock.io.reconnection(false);

   try {
    sock.auth = { token: await getToken() };
    sock.io.reconnection(true);
    sock.connect();
   } catch (error) {
    reconnectingRef.current = false;
    sock.io.reconnection(true);
    console.error(error);
   }
  };

  const onConnectError = (err: Error & { data?: { type?: string } }) => {
   if (sock.active) return;
   const errorType = err.data?.type ?? "";

   if (errorType === "token_expired") {
    reconnectWithToken(generateToken);
    return;
   }

   if (errorType === "invalid_token" && !invalidTokenRetriedRef.current) {
    invalidTokenRetriedRef.current = true;
    reconnectWithToken(getNewestAccessToken);
    return;
   }

   if (errorType === "invalid_token" || LOGOUT_ERROR_TYPES.has(errorType)) {
    if (errorType.startsWith("account_"))
     showToastMessage({ toastMessage: err.message, toastVariant: "error" });
    onSessionTerminated();
   }
  };

  sock.on(SOCKET_EVENTS.CONNECT, onConnect);
  sock.on(SOCKET_EVENTS.CONNECT_ERROR, onConnectError);
  sock.on(SOCKET_EVENTS.SESSION_REPLACED, onSessionTerminated);

  return () => {
   sock.off(SOCKET_EVENTS.CONNECT, onConnect);
   sock.off(SOCKET_EVENTS.CONNECT_ERROR, onConnectError);
   sock.off(SOCKET_EVENTS.SESSION_REPLACED, onSessionTerminated);
  };
 }, [isLoggedIn, session?.access_token, isGameReady, dispatch]);

 useEffect(
  () =>
   subscribeActiveGame(session?.id, (activeGame) => {
    if (!activeGame) return;
    const { pathname, search } = router.state.location;
    const viewingMatchId = new URLSearchParams(search).get("match_id");
    if (getGameFromPath(pathname) && viewingMatchId === activeGame.match_id)
     return;
    if (store.getState().socketModals.deviceHandoff !== null) return;
    dispatch(setActiveGame(activeGame));
   }),
  [session?.id, dispatch],
 );

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
