import {
    createContext,
    useContext,
    useEffect,
    useState,
    useRef,
    type ReactNode,
} from "react";
import { toast } from "sonner";
import { Trophy, RefreshCw } from "lucide-react";
import type { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { useReduxSelector } from "@/store/hooks";
import { generateToken } from "@/utils";
import { formateAmount } from "@/utils/formate";
import sessionService from "@/store/sessionService";
import { router } from "@/routes/router";
import { secondsToTimeControl } from "@/types/components";
import Button from "@/components/base/Button/Button";

import {
    sessionTerminatedTitle,
    sessionTerminatedDescription,
    activityFeedWin,
    deviceHandoffToastSuperseded,
} from "@/components/messages";
import type {
    IActivityFeedEvent,
    IActiveGameFoundResponse,
    IRematchOfferedResponse,
    IRematchExpiredResponse,
    IRematchFoundResponse,
    Currency,
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

const COUNTS_CACHE_KEY = "ks_user_counts";
const REFRESH_FLAG_KEY = "ks_is_refreshing";
const REFRESH_HOLD_MS = 4000;
// Any other user's page reload looks like a departure-then-rejoin: the
// server broadcasts the decremented count immediately on disconnect, then
// the incremented one a moment later once they reconnect. Hold decreases
// for this long so a same-user recovery within the window never renders.
const DECREASE_GRACE_MS = 3000;

function loadCachedCounts(): IUserCounts {
    try {
        const raw = sessionStorage.getItem(COUNTS_CACHE_KEY);
        if (raw) return JSON.parse(raw) as IUserCounts;
    } catch {}
    return { active: 0, inactive: 0, total: 0 };
}

const DEFAULT_COUNTS: IUserCounts = { active: 0, inactive: 0, total: 0 };

// Detect a browser refresh: beforeunload sets this flag, we consume it here
// so it only affects the immediate next page load (not SPA navigations).
const _isRefresh = (() => {
    try {
        const flag = sessionStorage.getItem(REFRESH_FLAG_KEY) === "1";
        if (flag) sessionStorage.removeItem(REFRESH_FLAG_KEY);
        return flag;
    } catch {
        return false;
    }
})();

function RematchOfferModal({
    opponentName,
    stakeAmount,
    currency,
    onAccept,
    onDismiss,
}: {
    opponentName: string;
    stakeAmount: number;
    currency: Currency;
    onAccept: () => void;
    onDismiss: () => void;
}) {
    return (
        <div className="gsm-backdrop" onClick={onDismiss}>
            <div className="gsm-panel" onClick={(e) => e.stopPropagation()}>
                <div className="gsm-header">
                    <RefreshCw size={16} style={{ color: "var(--gold, #f7931a)" }} />
                    <span className="gsm-modal-title">Rematch Offer</span>
                </div>
                <div className="gsm-body" style={{ textAlign: "center" }}>
                    <p className="device-conflict-desc">
                        <strong>{opponentName}</strong> wants a rematch
                        for <strong>{formateAmount(stakeAmount, currency)}</strong>
                    </p>
                </div>
                <div className="gsm-footer device-conflict-actions">
                    <Button variant="outline" fullWidth onClick={onDismiss}>
                        Decline
                    </Button>
                    <Button variant="primary" fullWidth onClick={onAccept}>
                        Accept
                    </Button>
                </div>
            </div>
        </div>
    );
}

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
    const [userCounts, setUserCounts] = useState<IUserCounts>(
        _isRefresh ? loadCachedCounts : () => DEFAULT_COUNTS,
    );
    const [countsReady, setCountsReady] = useState(_isRefresh);
    const [myStatus, setMyStatus] = useState<"active" | "inactive">("inactive");
    const [socket, setSocket] = useState<Socket | null>(null);
    const [recentWins, setRecentWins] = useState<IActivityFeedEvent[]>([]);
    const [activeGame, setActiveGame] =
        useState<IActiveGameFoundResponse | null>(null);

    const [rematchOffer, setRematchOffer] = useState<{
        gameId: string;
        opponentUsername: string;
        stakeAmount: number;
        currency: Currency;
    } | null>(null);

    const rematchOfferGameIdRef = useRef<string | null>(null);
    const setRematchOfferState = (offer: typeof rematchOffer) => {
        rematchOfferGameIdRef.current = offer?.gameId ?? null;
        setRematchOffer(offer);
    };

    const [deviceHandoff, setDeviceHandoff] = useState<string | null>(null);
    const deviceHandoffPendingRef = useRef(false);
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
        if (
            !isLoggedIn ||
            !session?.access_token ||
            session?.skill_level === null
        ) {
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
        // Keep the singleton socket's auth in sync with the latest known-good
        // token (this effect re-runs whenever a refresh — proactive or
        // reactive — updates it), so a future auto-reconnect after a network
        // drop never hands the server a token that was already stale.
        sock.auth = { token: session.access_token };
        setSocket(sock);

        const applyCounts = (counts: IUserCounts) => {
            displayedCountsRef.current = counts;
            setUserCounts(counts);
            setCountsReady(true);
            try {
                sessionStorage.setItem(
                    COUNTS_CACHE_KEY,
                    JSON.stringify(counts),
                );
            } catch {}
        };

        const onUserCounts = (counts: IUserCounts) => {
            // Suppress stale decrements while a token-refresh reconnect is in flight.
            if (reconnectingRef.current) return;

            // Post-refresh hold: ignore counts that are lower than the cached
            // value so the brief disconnect dip never reaches the UI.
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
                // Someone else's reload looks identical to a departure at
                // first — hold the drop briefly so their reconnect (which
                // brings the count back up) can preempt it before it renders.
                decreaseTimerRef.current = setTimeout(() => {
                    decreaseTimerRef.current = null;
                    applyCounts(counts);
                }, DECREASE_GRACE_MS);
                return;
            }

            applyCounts(counts);
        };

        const onConnect = () => {
            // Reconnected after token refresh — lift suppression so the next
            // user_counts broadcast (with this user included again) goes through.
            reconnectingRef.current = false;
        };

        const onConnectError = async (err: any) => {
            if (err.data?.type !== "token_expired") return;

            if (reconnectingRef.current) return;
            reconnectingRef.current = true;

            // Halt socket.io's built-in auto-reconnect immediately.
            // Without this, it retries with the still-expired token every
            // reconnectionDelay ms, flooding the server with bad handshakes
            // ("Error during WebSocket Handshake") and eventually triggering
            // session_terminated which bounces the user to /login.
            sock.io.reconnection(false);

            try {
                const newToken = await generateToken("socket_reconnect");
                sock.auth = { token: newToken };
                // Re-enable auto-reconnect BEFORE connecting so any subsequent
                // network drops are handled normally.
                sock.io.reconnection(true);
                sock.connect();
            } catch {
                // Token refresh failed (e.g. refresh token also expired).
                reconnectingRef.current = false;
                sock.io.reconnection(true);
                console.warn("[Socket] token refresh failed — session expired");
            }
            // reconnectingRef resets in onConnect after successful handshake
        };

        const onSessionTerminated = async () => {
            toast.error(sessionTerminatedTitle, {
                description: sessionTerminatedDescription,
                duration: 5000,
            });
            disconnectSocket();
            await sessionService.deleteSession();
            router.navigate("/login", { replace: true });
        };

        const onDeviceHandoffRequest = (data: { deviceName?: string }) => {
            deviceHandoffPendingRef.current = true;
            // Suppress the rejoin modal while handoff is pending
            setActiveGame(null);
            setDeviceHandoff(data.deviceName ?? null);
        };

        const onDeviceSuperseded = () => {
            setDeviceHandoff(null);
            deviceHandoffPendingRef.current = false;
            toast.info(deviceHandoffToastSuperseded, { duration: 4000 });
            router.navigate("/", { replace: true });
        };

        const onActivityFeed = (data: IActivityFeedEvent) => {
            setRecentWins((prev) =>
                [data, ...prev].slice(0, RECENT_WINS_LIMIT),
            );

            const streakSuffix =
                data.winner_streak > 1
                    ? ` · 🔥${data.winner_streak}W streak`
                    : "";
            toast(
                activityFeedWin(
                    data.winner_username,
                    formateAmount(data.prize_usd, "USD"),
                    streakSuffix,
                ),
                {
                    icon: <Trophy size={14} />,
                    duration: 4000,
                },
            );
        };

        const onActiveGameFound = (data: IActiveGameFoundResponse) => {
            if (router.state.location.pathname === "/play") return;
            // Don't surface rejoin modal while device handoff is pending —
            // the handoff modal takes priority.
            if (deviceHandoffPendingRef.current) return;
            setActiveGame(data);
        };

        // Global rematch-offer surface: if the recipient is still sitting on
        // the finished game's own screen, useRematch's in-screen "opponent
        // wants a rematch" UI handles it — this modal is only for everywhere
        // else (lobby, a fresh matchmaking flow, etc.) where nothing else is
        // listening for it.
        const onRematchOffered = (data: IRematchOfferedResponse) => {
            if (router.state.location.pathname === "/play") return;
            if (deviceHandoffPendingRef.current) return;
            setRematchOfferState({
                gameId: data.game_id,
                opponentUsername: data.offered_by_username,
                stakeAmount: data.stake_amount,
                currency: data.currency,
            });
        };

        const onRematchExpired = (data: IRematchExpiredResponse) => {
            if (rematchOfferGameIdRef.current === data.game_id) {
                setRematchOfferState(null);
            }
        };

        const onGlobalRematchFound = (data: IRematchFoundResponse) => {
            if (rematchOfferGameIdRef.current !== data.from_game_id) return;
            setRematchOfferState(null);
            const url =
                `/play?mode=pvp&time=${secondsToTimeControl(data.time_seconds)}` +
                `&game_id=${data.game_id}&color=${data.your_color}` +
                `&opponent=${encodeURIComponent(data.opponent.username)}` +
                `&opp_rating=${data.opponent.elo_rating}&opp_id=${data.opponent.id}` +
                `&opp_avatar_seed=${encodeURIComponent(data.opponent.avatar_seed ?? "")}` +
                `&initial_timeout=${data.inactivity_timeout_seconds}` +
                `&stake_amount=${data.stake_amount}`;
            router.navigate(url, { replace: true });
        };

        sock.on("connect", onConnect);
        sock.on("user_counts", onUserCounts);
        sock.on("activity_feed", onActivityFeed);
        sock.on("active_game_found", onActiveGameFound);
        sock.on("rematch_offered", onRematchOffered);
        sock.on("rematch_expired", onRematchExpired);
        sock.on("rematch_found", onGlobalRematchFound);
        sock.on("connect_error", onConnectError);
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

        // A backgrounded tab can sit on a stale count for a while even with
        // the server's heartbeat broadcast — resync the instant it's looked
        // at again instead of waiting out the rest of that interval.
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
            sock.off("rematch_offered", onRematchOffered);
            sock.off("rematch_expired", onRematchExpired);
            sock.off("rematch_found", onGlobalRematchFound);
            sock.off("connect_error", onConnectError);
            sock.off("session_terminated", onSessionTerminated);
            sock.off("device_handoff_request", onDeviceHandoffRequest);
            sock.off("device_superseded", onDeviceSuperseded);
            document.removeEventListener("mousemove", emitActivity);
            document.removeEventListener("keypress", emitActivity);
            document.removeEventListener("click", emitActivity);
            document.removeEventListener(
                "visibilitychange",
                onVisibilityChange,
            );
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

    const handleRejoin = () => {
        if (!activeGame) return;
        const url =
            `/play?mode=pvp&time=${secondsToTimeControl(activeGame.time_seconds)}` +
            `&game_id=${activeGame.game_id}&color=${activeGame.your_color}` +
            `&opponent=${encodeURIComponent(activeGame.opponent.username)}` +
            `&opp_rating=${activeGame.opponent.elo_rating}&opp_id=${activeGame.opponent.id}` +
            `&opp_avatar_seed=${encodeURIComponent(activeGame.opponent.avatar_seed ?? "")}` +
            `&initial_timeout=${activeGame.inactivity_timeout_seconds}` +
            `&stake_amount=${activeGame.stake_amount}`;
        setActiveGame(null);
        router.navigate(url, { replace: true });
    };

    const handleAcceptRematch = () => {
        if (!rematchOffer) return;
        socket?.emit("offer_rematch", { game_id: rematchOffer.gameId });
        // Hide the modal, but deliberately keep rematchOfferGameIdRef pointed
        // at this gameId — the rematch_found this triggers arrives moments
        // later, and onGlobalRematchFound needs that ref intact to know it's
        // ours to act on and navigate into the new game.
        setRematchOffer(null);
    };

    const handleDismissRematch = () => {
        setRematchOfferState(null);
    };

    const handleContinueHere = () => {
        socket?.emit("accept_device_handoff");
        setDeviceHandoff(null);
        deviceHandoffPendingRef.current = false;
    };

    const handleStayOnOther = async () => {
        setDeviceHandoff(null);
        deviceHandoffPendingRef.current = false;
        disconnectSocket();
        await sessionService.deleteSession();
        router.navigate("/login", { replace: true });
    };

    return (
        <SocketContext.Provider
            value={{ userCounts, countsReady, myStatus, socket, recentWins }}
        >
            {children}
            {deviceHandoff !== null && (
                <DeviceHandoffModal
                    deviceName={deviceHandoff || null}
                    onContinueHere={handleContinueHere}
                    onStayOnOther={handleStayOnOther}
                />
            )}
            {activeGame && deviceHandoff === null && (
                <RejoinGameModal
                    opponentName={activeGame.opponent.username}
                    opponentRating={activeGame.opponent.elo_rating}
                    stakeAmount={activeGame.stake_amount}
                    currency={activeGame.currency}
                    onRejoin={handleRejoin}
                    onExit={() => setActiveGame(null)}
                />
            )}
            {rematchOffer && deviceHandoff === null && !activeGame && (
                <RematchOfferModal
                    opponentName={rematchOffer.opponentUsername}
                    stakeAmount={rematchOffer.stakeAmount}
                    currency={rematchOffer.currency}
                    onAccept={handleAcceptRematch}
                    onDismiss={handleDismissRematch}
                />
            )}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    return useContext(SocketContext);
}
