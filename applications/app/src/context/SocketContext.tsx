import {
 createContext,
 useContext,
 useEffect,
 useState,
 useRef,
 type PropsWithChildren,
} from "react";

import type { Socket } from "socket.io-client";
import {
 connectSocket,
 disconnectSocket,
 requestGameState,
} from "@gopvp/common/src/util/socket";
import { useReduxSelector, useReduxDispatch } from "@gopvp/app/src/redux/hooks";
import { store } from "@gopvp/app/src/redux/store";
import { setActiveGame } from "@gopvp/app/src/redux/socketModals/slice";
import { generateToken } from "@gopvp/common/src/util/api";
import { isGamePlayPath } from "@gopvp/app/src/utils";
import sessionService from "@gopvp/common/src/util/sessionService";
import { router } from "@gopvp/app/src/routes/router";
import { navigateTo } from "@gopvp/common/src/util/navigationService";
import RejoinGameModal from "@gopvp/app/src/components/common/RejoinGameModal";
import type {
 IActiveGameEvent,
 IGameStateBaseResponse,
} from "@gopvp/common/src/types/response";
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
   } catch (error) {
    reconnectingRef.current = false;
    sock.io.reconnection(true);
    console.error(error);
   }
  };

  const onSessionTerminated = async () => {
   disconnectSocket();
   await sessionService.deleteSession();
   navigateTo(ROUTES.LOGIN, { replace: true });
  };

  const onActiveGame = async (data: IActiveGameEvent) => {
   const { pathname, search } = router.state.location;
   const viewingMatchId = new URLSearchParams(search).get("match");
   if (isGamePlayPath(pathname) && viewingMatchId === data.match_id) return;

   if (store.getState().socketModals.deviceHandoff !== null) return;
   const gameState = await requestGameState<IGameStateBaseResponse>(
    data.match_id,
   );
   const userId = store.getState().auth.session?.id;
   const opponent = gameState?.players.find(
    (player) => player.user_id !== userId,
   );
   if (gameState && opponent) {
    dispatch(setActiveGame({ ...data, bet: gameState.bet, opponent }));
   }
  };

  sock.on(SOCKET_EVENTS.CONNECT, onConnect);
  sock.on(SOCKET_EVENTS.GAME_ACTIVE, onActiveGame);
  sock.on(SOCKET_EVENTS.CONNECT_ERROR, onConnectError);
  sock.on(SOCKET_EVENTS.SESSION_REPLACED, onSessionTerminated);

  return () => {
   sock.off(SOCKET_EVENTS.CONNECT, onConnect);
   sock.off(SOCKET_EVENTS.GAME_ACTIVE, onActiveGame);
   sock.off(SOCKET_EVENTS.CONNECT_ERROR, onConnectError);
   sock.off(SOCKET_EVENTS.SESSION_REPLACED, onSessionTerminated);
  };
 }, [isLoggedIn, session?.access_token, isGameReady, dispatch]);

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
