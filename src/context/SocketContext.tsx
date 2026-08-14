import {
    createContext,
    useContext,
    useEffect,
    useState,
    useRef,
    type ReactNode,
} from "react";
import { RefreshCw, Swords } from "lucide-react";
import type { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { useReduxSelector, useReduxDispatch } from "@/redux/hooks";
import { showToast } from "@/redux/common/common.slice";
import { generateToken } from "@/utils";
import { formateAmount } from "@/utils/formate";
import sessionService from "@/redux/sessionService";
import { router } from "@/routes/router";
import { secondsToTimeControl } from "@/types/components";
import Button from "@/components/base/Button/Button";

import {
    activityFeedWin,
    deviceHandoffToastSuperseded,
    walletDepositCompletedToast,
    walletWithdrawCompletedToast,
    friendsChallengeReceivedTitle,
    friendsChallengeReceivedDesc,
    friendsChallengeExpiredToast,
    friendsChallengeDeclinedToast,
    friendsChallengeCancelledToast,
    friendsChallengeErrorFallback,
    friendsRequestAccept,
    friendsRequestDecline,
} from "@/constants/messages";
import type {
    IActivityFeedEvent,
    IActiveGameFoundResponse,
    IRematchOfferedResponse,
    IRematchExpiredResponse,
    IRematchFoundResponse,
    ITransactionCompletedEvent,
    IChallengeReceivedResponse,
    IChallengeDeclinedResponse,
    IChallengeExpiredResponse,
    IChallengeCancelledResponse,
    IChallengeErrorResponse,
    IChallengeMatchFoundResponse,
} from "@/types/types";

interface IUserCounts {
    active: number;
    inactive: number;
    total: number;
}

export interface ISentChallenge {
    friendId: string;
    friendUsername: string;
    stakeAmount: number;
    secondsLeft: number;
}

interface ISocketContext {
    userCounts: IUserCounts;
    countsReady: boolean;
    myStatus: "active" | "inactive";
    socket: Socket | null;
    recentWins: IActivityFeedEvent[];
    sentChallenge: ISentChallenge | null;
    sendChallenge: (
        friendId: string,
        friendUsername: string,
        stakeAmount: number,
    ) => void;
    cancelChallenge: () => void;
}

const RECENT_WINS_LIMIT = 12;

const COUNTS_CACHE_KEY = "ks_user_counts";
const REFRESH_FLAG_KEY = "ks_is_refreshing";
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

function RematchOfferModal({
    opponentName,
    stakeAmount,
    onAccept,
    onDismiss,
}: {
    opponentName: string;
    stakeAmount: number;
    onAccept: () => void;
    onDismiss: () => void;
}) {
    return (
        <div className="gsm-backdrop" onClick={onDismiss}>
            <div className="gsm-panel" onClick={(e) => e.stopPropagation()}>
                <div className="gsm-header">
                    <RefreshCw
                        size={16}
                        style={{ color: "var(--gold, #f7931a)" }}
                    />
                    <span className="gsm-modal-title">Rematch Offer</span>
                </div>
                <div className="gsm-body" style={{ textAlign: "center" }}>
                    <p className="device-conflict-desc">
                        <strong>{opponentName}</strong> wants a rematch for{" "}
                        <strong>{formateAmount(stakeAmount)}</strong>
                    </p>
                </div>
                <div className="gsm-footer device-conflict-actions">
                    <Button variant="outlined" fullWidth onClick={onDismiss}>
                        Decline
                    </Button>
                    <Button variant="contained" fullWidth onClick={onAccept}>
                        Accept
                    </Button>
                </div>
            </div>
        </div>
    );
}

function ChallengeOfferModal({
    challengerUsername,
    stakeAmount,
    onAccept,
    onDecline,
}: {
    challengerUsername: string;
    stakeAmount: number;
    onAccept: () => void;
    onDecline: () => void;
}) {
    return (
        <div className="gsm-backdrop" onClick={onDecline}>
            <div className="gsm-panel" onClick={(e) => e.stopPropagation()}>
                <div className="gsm-header">
                    <Swords
                        size={16}
                        style={{ color: "var(--gold, #f7931a)" }}
                    />
                    <span className="gsm-modal-title">
                        {friendsChallengeReceivedTitle}
                    </span>
                </div>
                <div className="gsm-body" style={{ textAlign: "center" }}>
                    <p className="device-conflict-desc">
                        {friendsChallengeReceivedDesc(
                            challengerUsername,
                            formateAmount(stakeAmount),
                        )}
                    </p>
                </div>
                <div className="gsm-footer device-conflict-actions">
                    <Button variant="outlined" fullWidth onClick={onDecline}>
                        {friendsRequestDecline}
                    </Button>
                    <Button variant="contained" fullWidth onClick={onAccept}>
                        {friendsRequestAccept}
                    </Button>
                </div>
            </div>
        </div>
    );
}

function DeviceHandoffModal({
    deviceName,
    onContinueHere,
    onStayOnOther,
}: {
    deviceName: string | null;
    onContinueHere: () => void;
    onStayOnOther: () => void;
}) {
    return (
        <div className="gsm-backdrop">
            <div className="gsm-panel" onClick={(e) => e.stopPropagation()}>
                <div className="gsm-header">
                    <span className="gsm-modal-title">Signed in elsewhere</span>
                </div>
                <div className="gsm-body" style={{ textAlign: "center" }}>
                    <p className="device-conflict-desc">
                        {deviceName
                            ? `${deviceName} is currently using your session.`
                            : "Another device is currently using your session."}{" "}
                        Continuing here will sign that device out.
                    </p>
                </div>
                <div className="gsm-footer device-conflict-actions">
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={onStayOnOther}
                    >
                        Stay on other device
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={onContinueHere}
                    >
                        Continue here
                    </Button>
                </div>
            </div>
        </div>
    );
}

function RejoinGameModal({
    opponentName,
    opponentRating,
    stakeAmount,
    onRejoin,
    onExit,
}: {
    opponentName: string;
    opponentRating: number;
    stakeAmount: number;
    onRejoin: () => void;
    onExit: () => void;
}) {
    return (
        <div className="gsm-backdrop">
            <div className="gsm-panel" onClick={(e) => e.stopPropagation()}>
                <div className="gsm-header">
                    <span className="gsm-modal-title">Game in progress</span>
                </div>
                <div className="gsm-body" style={{ textAlign: "center" }}>
                    <p className="device-conflict-desc">
                        You have an active game vs{" "}
                        <strong>
                            {opponentName} ({opponentRating})
                        </strong>{" "}
                        for <strong>{formateAmount(stakeAmount)}</strong>.
                    </p>
                </div>
                <div className="gsm-footer device-conflict-actions">
                    <Button variant="outlined" fullWidth onClick={onExit}>
                        Exit
                    </Button>
                    <Button variant="contained" fullWidth onClick={onRejoin}>
                        Rejoin
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
    sentChallenge: null,
    sendChallenge: () => {},
    cancelChallenge: () => {},
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
    const [activeGame, setActiveGame] =
        useState<IActiveGameFoundResponse | null>(null);

    const [rematchOffer, setRematchOffer] = useState<{
        gameId: string;
        opponentUsername: string;
        stakeAmount: number;
    } | null>(null);

    const rematchOfferGameIdRef = useRef<string | null>(null);
    const setRematchOfferState = (offer: typeof rematchOffer) => {
        rematchOfferGameIdRef.current = offer?.gameId ?? null;
        setRematchOffer(offer);
    };

    const [incomingChallenge, setIncomingChallenge] = useState<{
        challengerId: string;
        challengerUsername: string;
        stakeAmount: number;
    } | null>(null);
    const incomingChallengerIdRef = useRef<string | null>(null);
    const setIncomingChallengeState = (offer: typeof incomingChallenge) => {
        incomingChallengerIdRef.current = offer?.challengerId ?? null;
        setIncomingChallenge(offer);
    };

    const [sentChallenge, setSentChallenge] = useState<ISentChallenge | null>(
        null,
    );
    const sentChallengeRef = useRef<ISentChallenge | null>(null);
    const challengeCountdownRef = useRef<ReturnType<typeof setInterval> | null>(
        null,
    );
    const stopChallengeCountdown = () => {
        if (challengeCountdownRef.current) {
            clearInterval(challengeCountdownRef.current);
            challengeCountdownRef.current = null;
        }
    };
    const setSentChallengeState = (offer: ISentChallenge | null) => {
        sentChallengeRef.current = offer;
        setSentChallenge(offer);
        if (!offer) stopChallengeCountdown();
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
            deviceHandoffPendingRef.current = true;

            setActiveGame(null);
            setDeviceHandoff(data.deviceName ?? null);
        };

        const onDeviceSuperseded = () => {
            setDeviceHandoff(null);
            deviceHandoffPendingRef.current = false;
            dispatch(
                showToast({
                    message: deviceHandoffToastSuperseded,
                    severity: "info",
                }),
            );
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
            dispatch(
                showToast({
                    message: activityFeedWin(
                        data.winner_username,
                        formateAmount(data.prize_usd),
                        streakSuffix,
                    ),
                    severity: "success",
                }),
            );
        };

        const onTransactionCompleted = (data: ITransactionCompletedEvent) => {
            const amount = formateAmount(data.amount_usd);
            dispatch(
                showToast({
                    message:
                        data.type === "DEPOSIT"
                            ? walletDepositCompletedToast(amount)
                            : walletWithdrawCompletedToast(amount),
                    severity: "success",
                }),
            );
        };

        const onActiveGameFound = (data: IActiveGameFoundResponse) => {
            const { pathname, search } = router.state.location;
            const viewingGameId = new URLSearchParams(search).get("game_id");
            if (pathname === "/play" && viewingGameId === data.game_id) return;

            if (deviceHandoffPendingRef.current) return;
            setActiveGame(data);
        };

        const onRematchOffered = (data: IRematchOfferedResponse) => {
            if (router.state.location.pathname === "/play") return;
            if (deviceHandoffPendingRef.current) return;
            setRematchOfferState({
                gameId: data.game_id,
                opponentUsername: data.offered_by_username,
                stakeAmount: data.stake_amount,
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
                `&stake_amount=${data.stake_amount}`;
            router.navigate(url, { replace: true });
        };

        const onChallengeReceived = (data: IChallengeReceivedResponse) => {
            setIncomingChallengeState({
                challengerId: data.challenger_id,
                challengerUsername: data.challenger_username,
                stakeAmount: data.stake_amount,
            });
        };

        const onChallengeDeclined = (data: IChallengeDeclinedResponse) => {
            if (sentChallengeRef.current?.friendId !== data.friend_id) return;
            const username =
                sentChallengeRef.current?.friendUsername ?? "Your friend";
            setSentChallengeState(null);
            dispatch(
                showToast({
                    message: friendsChallengeDeclinedToast(username),
                    severity: "error",
                }),
            );
        };

        const onChallengeExpired = (data: IChallengeExpiredResponse) => {
            if (
                data.friend_id &&
                sentChallengeRef.current?.friendId === data.friend_id
            ) {
                setSentChallengeState(null);
                dispatch(
                    showToast({
                        message: friendsChallengeExpiredToast,
                        severity: "error",
                    }),
                );
            }
            if (
                data.challenger_id &&
                incomingChallengerIdRef.current === data.challenger_id
            ) {
                setIncomingChallengeState(null);
            }
        };

        const onChallengeCancelled = (data: IChallengeCancelledResponse) => {
            if (incomingChallengerIdRef.current !== data.challenger_id) return;
            setIncomingChallengeState(null);
            dispatch(
                showToast({
                    message: friendsChallengeCancelledToast,
                    severity: "info",
                }),
            );
        };

        const onChallengeError = (data: IChallengeErrorResponse) => {
            console.log(data);
            dispatch(
                showToast({
                    message: data.message,
                    severity: "error",
                }),
            );
        };

        const onChallengeMatchFound = (data: IChallengeMatchFoundResponse) => {
            setSentChallengeState(null);
            setIncomingChallengeState(null);
            const url =
                `/play?mode=pvp&time=${secondsToTimeControl(data.time_seconds)}` +
                `&game_id=${data.game_id}&color=${data.your_color}` +
                `&opponent=${encodeURIComponent(data.opponent.username)}` +
                `&opp_rating=${data.opponent.elo_rating}&opp_id=${data.opponent.id}` +
                `&opp_avatar_seed=${encodeURIComponent(data.opponent.avatar_seed ?? "")}` +
                `&stake_amount=${data.stake_amount}`;
            router.navigate(url, { replace: true });
        };

        sock.on("connect", onConnect);
        sock.on("user_counts", onUserCounts);
        sock.on("activity_feed", onActivityFeed);
        sock.on("transaction_completed", onTransactionCompleted);
        sock.on("active_game_found", onActiveGameFound);
        sock.on("rematch_offered", onRematchOffered);
        sock.on("rematch_expired", onRematchExpired);
        sock.on("rematch_found", onGlobalRematchFound);
        sock.on("challenge_received", onChallengeReceived);
        sock.on("challenge_declined", onChallengeDeclined);
        sock.on("challenge_expired", onChallengeExpired);
        sock.on("challenge_cancelled", onChallengeCancelled);
        sock.on("challenge_error", onChallengeError);
        sock.on("challenge_match_found", onChallengeMatchFound);
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
            sock.off("transaction_completed", onTransactionCompleted);
            sock.off("active_game_found", onActiveGameFound);
            sock.off("rematch_offered", onRematchOffered);
            sock.off("rematch_expired", onRematchExpired);
            sock.off("rematch_found", onGlobalRematchFound);
            sock.off("challenge_received", onChallengeReceived);
            sock.off("challenge_declined", onChallengeDeclined);
            sock.off("challenge_expired", onChallengeExpired);
            sock.off("challenge_cancelled", onChallengeCancelled);
            sock.off("challenge_error", onChallengeError);
            sock.off("challenge_match_found", onChallengeMatchFound);
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
            document.removeEventListener(
                "visibilitychange",
                onVisibilityChange,
            );
        };
    }, [socket]);

    const handleRejoin = () => {
        if (!activeGame) return;
        const url =
            `/play?mode=pvp&time=${secondsToTimeControl(activeGame.time_seconds)}` +
            `&game_id=${activeGame.game_id}&color=${activeGame.your_color}` +
            `&opponent=${encodeURIComponent(activeGame.opponent.username)}` +
            `&opp_rating=${activeGame.opponent.elo_rating}&opp_id=${activeGame.opponent.id}` +
            `&opp_avatar_seed=${encodeURIComponent(activeGame.opponent.avatar_seed ?? "")}` +
            `&stake_amount=${activeGame.stake_amount}`;
        setActiveGame(null);
        router.navigate(url, { replace: true });
    };

    const handleAcceptRematch = () => {
        if (!rematchOffer) return;
        socket?.emit("offer_rematch", { game_id: rematchOffer.gameId });

        setRematchOffer(null);
    };

    const handleDismissRematch = () => {
        setRematchOfferState(null);
    };

    const sendChallenge = (
        friendId: string,
        friendUsername: string,
        stakeAmount: number,
    ) => {
        if (!socket) return;
        socket.emit("challenge_friend", {
            friend_id: friendId,
            stake_amount: stakeAmount,
        });
        setSentChallengeState({
            friendId,
            friendUsername,
            stakeAmount,
            secondsLeft: 30,
        });
        stopChallengeCountdown();
        challengeCountdownRef.current = setInterval(() => {
            setSentChallenge((prev) =>
                prev
                    ? {
                          ...prev,
                          secondsLeft: Math.max(0, prev.secondsLeft - 1),
                      }
                    : prev,
            );
        }, 1000);
    };

    const cancelChallenge = () => {
        if (!socket || !sentChallengeRef.current) return;
        socket.emit("cancel_challenge", {
            friend_id: sentChallengeRef.current.friendId,
        });
        setSentChallengeState(null);
    };

    const handleAcceptChallenge = () => {
        if (!socket || !incomingChallenge) return;
        socket.emit("accept_challenge", {
            challenger_id: incomingChallenge.challengerId,
        });
        setIncomingChallengeState(null);
    };

    const handleDeclineChallenge = () => {
        if (!socket || !incomingChallenge) return;
        socket.emit("decline_challenge", {
            challenger_id: incomingChallenge.challengerId,
        });
        setIncomingChallengeState(null);
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
            value={{
                userCounts,
                countsReady,
                myStatus,
                socket,
                recentWins,
                sentChallenge,
                sendChallenge,
                cancelChallenge,
            }}
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
                    onRejoin={handleRejoin}
                    onExit={() => setActiveGame(null)}
                />
            )}
            {rematchOffer && deviceHandoff === null && !activeGame && (
                <RematchOfferModal
                    opponentName={rematchOffer.opponentUsername}
                    stakeAmount={rematchOffer.stakeAmount}
                    onAccept={handleAcceptRematch}
                    onDismiss={handleDismissRematch}
                />
            )}
            {incomingChallenge &&
                deviceHandoff === null &&
                !activeGame &&
                !rematchOffer && (
                    <ChallengeOfferModal
                        challengerUsername={
                            incomingChallenge.challengerUsername
                        }
                        stakeAmount={incomingChallenge.stakeAmount}
                        onAccept={handleAcceptChallenge}
                        onDecline={handleDeclineChallenge}
                    />
                )}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    return useContext(SocketContext);
}
