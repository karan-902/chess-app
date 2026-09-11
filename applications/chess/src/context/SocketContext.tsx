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
import { showToast } from "@/redux/common/common.slice";
import { store } from "@/redux/store";
import { setActiveGame, setDeviceHandoff } from "@/redux/socketModals.slice";
import { generateToken } from "@/utils";
import { formatAmount } from "@/utils/format";
import sessionService from "@/redux/sessionService";
import { router } from "@/routes/router";
import RejoinGameModal from "@/components/common/RejoinGameModal";

import {
 activityFeedWin,
 deviceHandoffToastSuperseded,
 walletDepositCompletedToast,
 walletWithdrawCompletedToast,
} from "@/constants/messages";
import type {
 IActivityFeedEvent,
 IActiveGameFoundResponse,
 ITransactionCompletedEvent,
} from "@/types/types";

interface IUserCounts {
 active: number;
 inactive: number;
 total: number;
}

interface ISocketContext {
 userCounts: IUserCounts;
 countsReady: boolean;
 myStatus: "active" | "inactive";
 socket: Socket | null;
 recentWins: IActivityFeedEvent[];
}

const RECENT_WINS_LIMIT = 12;

const COUNTS_CACHE_KEY = "sj_user_counts";
const REFRESH_FLAG_KEY = "sj_is_refreshing";
const REFRESH_HOLD_MS = 4000;

const DECREASE_GRACE_MS = 3000;

function loadCachedCounts(): IUserCounts {
 try {
  const raw = sessionStorage.getItem(COUNTS_CACHE_KEY);
  if (raw) return JSON.parse(raw) as IUserCounts;
 } catch {}
 return { active: 0, inactive: 0, total: 0 };
}

const DEFAULT_COUNTS: IUserCounts = { active: 0, inactive: 0, total: 0 };

const _isRefresh = (() => {
 try {
  const flag = sessionStorage.getItem(REFRESH_FLAG_KEY) === "1";
  if (flag) sessionStorage.removeItem(REFRESH_FLAG_KEY);
  return flag;
 } catch {
  return false;
 }
})();

const SocketContext = createContext<ISocketContext>({
 userCounts: DEFAULT_COUNTS,
 countsReady: false,
 myStatus: "inactive",
 socket: null,
 recentWins: [],
});

export function SocketProvider({ children }: { children: ReactNode }) {
 const session = useReduxSelector((state) => state.auth.session);
 const isLoggedIn = useReduxSelector((state) => state.auth.isLoggedIn);
 const dispatch = useReduxDispatch();
 const [userCounts, setUserCounts] = useState<IUserCounts>(
  _isRefresh ? loadCachedCounts : () => DEFAULT_COUNTS,
 );
 const [countsReady, setCountsReady] = useState(_isRefresh);
 const [myStatus, setMyStatus] = useState<"active" | "inactive">("inactive");
 const [socket, setSocket] = useState<Socket | null>(null);
 const [recentWins, setRecentWins] = useState<IActivityFeedEvent[]>([]);

 const activityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
 const reconnectingRef = useRef(false);
 const holdUntilRef = useRef(_isRefresh ? Date.now() + REFRESH_HOLD_MS : 0);
 const displayedCountsRef = useRef<IUserCounts>(
  _isRefresh ? loadCachedCounts() : DEFAULT_COUNTS,
 );
 const decreaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
 useEffect(() => {
  const mark = () => {
   try {
    sessionStorage.setItem(REFRESH_FLAG_KEY, "1");
   } catch {}
  };
  window.addEventListener("beforeunload", mark);
  return () => window.removeEventListener("beforeunload", mark);
 }, []);

 useEffect(() => {
  if (!isLoggedIn || !session?.access_token) return;
  const TOKEN_REFRESH_INTERVAL_MS = 10 * 60 * 1000;
  const id = setInterval(() => {
   generateToken("proactive_refresh").catch(() => {});
  }, TOKEN_REFRESH_INTERVAL_MS);
  return () => clearInterval(id);
 }, [isLoggedIn, session?.access_token]);

 useEffect(() => {
  if (!isLoggedIn || !session?.access_token || session?.skill_level === null) {
   disconnectSocket();
   setSocket(null);
   setUserCounts(DEFAULT_COUNTS);
   setMyStatus("inactive");
   displayedCountsRef.current = DEFAULT_COUNTS;
   if (decreaseTimerRef.current) {
    clearTimeout(decreaseTimerRef.current);
    decreaseTimerRef.current = null;
   }
   try {
    sessionStorage.removeItem(COUNTS_CACHE_KEY);
   } catch {}
   return;
  }

  const sock = connectSocket(session.access_token);
  sock.auth = { token: session.access_token };
  setSocket(sock);

  const applyCounts = (counts: IUserCounts) => {
   displayedCountsRef.current = counts;
   setUserCounts(counts);
   setCountsReady(true);
   try {
    sessionStorage.setItem(COUNTS_CACHE_KEY, JSON.stringify(counts));
   } catch {}
  };

  const onUserCounts = (counts: IUserCounts) => {
   if (reconnectingRef.current) return;
   if (Date.now() < holdUntilRef.current) {
    if (counts.active >= displayedCountsRef.current.active) {
     applyCounts(counts);
    }
    setCountsReady(true);
    return;
   }

   if (decreaseTimerRef.current) {
    clearTimeout(decreaseTimerRef.current);
    decreaseTimerRef.current = null;
   }

   if (counts.active < displayedCountsRef.current.active) {
    decreaseTimerRef.current = setTimeout(() => {
     decreaseTimerRef.current = null;
     applyCounts(counts);
    }, DECREASE_GRACE_MS);
    return;
   }

   applyCounts(counts);
  };

  const onConnect = () => {
   reconnectingRef.current = false;
  };

  const onConnectError = async (err: any) => {
   if (err.data?.type !== "token_expired") return;

   if (reconnectingRef.current) return;
   reconnectingRef.current = true;

   sock.io.reconnection(false);

   try {
    const newToken = await generateToken("socket_reconnect");
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
   router.navigate("/login", { replace: true });
  };

  const onDeviceHandoffRequest = (data: { deviceName?: string }) => {
   dispatch(setActiveGame(null));
   dispatch(setDeviceHandoff({ deviceName: data.deviceName ?? null }));
  };

  const onDeviceSuperseded = () => {
   dispatch(setDeviceHandoff(null));
   dispatch(
    showToast({
     message: deviceHandoffToastSuperseded,
     severity: "info",
    }),
   );
   router.navigate("/", { replace: true });
  };

  const onActivityFeed = (data: IActivityFeedEvent) => {
   setRecentWins((prev) => [data, ...prev].slice(0, RECENT_WINS_LIMIT));

   const streakSuffix =
    data.winner_streak > 1 ? ` · 🔥${data.winner_streak}W streak` : "";
   dispatch(
    showToast({
     message: activityFeedWin(
      data.winner_username,
      formatAmount(data.prize_usd),
      streakSuffix,
     ),
     severity: "success",
    }),
   );
  };

  const onActiveGameFound = (data: IActiveGameFoundResponse) => {
   const { pathname, search } = router.state.location;
   const viewingGameId = new URLSearchParams(search).get("game_id");
   if (pathname === "/play" && viewingGameId === data.game_id) return;

   if (store.getState().socketModals.deviceHandoff !== null) return;
   dispatch(setActiveGame(data));
  };

  sock.on("connect", onConnect);
  sock.on("user_counts", onUserCounts);
  sock.on("activity_feed", onActivityFeed);
  sock.on("active_game_found", onActiveGameFound);
  sock.on("session_terminated", onSessionTerminated);
  sock.on("device_handoff_request", onDeviceHandoffRequest);
  sock.on("device_superseded", onDeviceSuperseded);

  const emitActivity = () => {
   if (activityTimerRef.current) return;
   sock.emit("activity");
   activityTimerRef.current = setTimeout(() => {
    activityTimerRef.current = null;
   }, 1000);
  };

  document.addEventListener("mousemove", emitActivity);
  document.addEventListener("keypress", emitActivity);
  document.addEventListener("click", emitActivity);

  const onVisibilityChange = () => {
   if (document.visibilityState === "visible") {
    sock.emit("request_user_counts");
   }
  };
  document.addEventListener("visibilitychange", onVisibilityChange);

  return () => {
   sock.off("connect", onConnect);
   sock.off("user_counts", onUserCounts);
   sock.off("activity_feed", onActivityFeed);
   sock.off("active_game_found", onActiveGameFound);
   sock.off("connect_error", onConnectError);
   sock.off("session_terminated", onSessionTerminated);
   sock.off("device_handoff_request", onDeviceHandoffRequest);
   sock.off("device_superseded", onDeviceSuperseded);
   document.removeEventListener("mousemove", emitActivity);
   document.removeEventListener("keypress", emitActivity);
   document.removeEventListener("click", emitActivity);
   document.removeEventListener("visibilitychange", onVisibilityChange);
   if (activityTimerRef.current) {
    clearTimeout(activityTimerRef.current);
    activityTimerRef.current = null;
   }
   if (decreaseTimerRef.current) {
    clearTimeout(decreaseTimerRef.current);
    decreaseTimerRef.current = null;
   }
  };
 }, [isLoggedIn, session?.access_token, session?.skill_level]);

 useEffect(() => {
  if (!socket) return;
  let lastCheckedAt = 0;
  const maybeCheckActiveGame = () => {
   if (Date.now() - lastCheckedAt < 10_000) return;
   const { pathname, search } = router.state.location;
   const viewingGameId = new URLSearchParams(search).get("game_id");
   if (pathname === "/play" && viewingGameId) return;
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
  <SocketContext.Provider
   value={{
    userCounts,
    countsReady,
    myStatus,
    socket,
    recentWins,
   }}
  >
   {children}

   <RejoinGameModal />
  </SocketContext.Provider>
 );
}

export function useSocket() {
 return useContext(SocketContext);
}
