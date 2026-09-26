import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getSocket } from "@gopvp/common/src/util/socket";
import { useSocket } from "@/context/SocketContext";
import { useReduxDispatch } from "@/redux/hooks";
import { showToast } from "@/redux/common/slice";
import { showAckErrorToast } from "@gopvp/common/src/util/api";
import { buildMatchUrl } from "@/utils";
import { useGame } from "@/hooks/useGame";
import { useCountdown } from "@/hooks/useCountdown";
import { POOL_TIMEOUT_SECONDS } from "@/constants/config";
import {
 noOpponentFoundText,
} from "@/constants/messages";
import type {
    IPoolResponse,
    IMatchmakingResponse,
    IPoolMatchedEvent,
    ISocketAckError,
} from "@gopvp/common/src/types/response";

export type MatchmakingStatus = "idle" | "joining" | "queued" | "found";

export function useMatchmaking() {
    const [status, setStatus] = useState<MatchmakingStatus>("idle");
    const [queuedPool, setQueuedPool] = useState<IPoolResponse | null>(null);
    const [queueDeadlineAt, setQueueDeadlineAt] = useState<number | null>(
        null,
    );
    const secondsLeft = useCountdown(queueDeadlineAt);
    const poolRef = useRef<IPoolResponse | null>(null);
    const navigate = useNavigate();
    const { game } = useGame();
    const { socket: ctxSocket } = useSocket();
    const dispatch = useReduxDispatch();

    const resetStatus = useCallback(() => {
        setStatus("idle");
        setQueuedPool(null);
        setQueueDeadlineAt(null);
        poolRef.current = null;
    }, []);

    const leaveQueue = useCallback(() => {
        if (poolRef.current) getSocket()?.emit("pool:leave", () => {});
        resetStatus();
    }, [resetStatus]);

    const openMatch = useCallback(
        (matchId: string) => {
            if (!poolRef.current) return;
            poolRef.current = null;
            setStatus("found");
            navigate(buildMatchUrl(game, matchId), { replace: true });
        },
        [game, navigate],
    );

    const emitPoolJoin = useCallback(
        (pool: IPoolResponse) => {
            getSocket()?.emit(
                "pool:join",
                { game, bet: pool.bet, time: pool.time },
                (err: ISocketAckError | null, data: IMatchmakingResponse) => {
                    if (err) {
                        showAckErrorToast(err);
                        resetStatus();
                        return;
                    }
                    if (data.status === "MATCHED" && data.match_type === "POOL") {
                        openMatch(data.match_id);
                        return;
                    }
                    setQueueDeadlineAt(Date.now() + POOL_TIMEOUT_SECONDS * 1000);
                    setStatus("queued");
                },
            );
        },
        [game, resetStatus, openMatch],
    );

    const joinQueue = (pool: IPoolResponse) => {
        if (!getSocket()) return;
        poolRef.current = pool;
        setQueuedPool(pool);
        setStatus("joining");
        emitPoolJoin(pool);
    };

    useEffect(() => {
        const socket = ctxSocket ?? getSocket();
        if (!socket) return;

        const onMatched = (data: IPoolMatchedEvent) => {
            if (!data.matchId || !poolRef.current) return;
            openMatch(data.matchId);
        };

        const onPoolTimeout = () => {
            resetStatus();
            dispatch(
                showToast({
                    isToastOpen: true,
                    toastMessage: noOpponentFoundText,
                    toastVariant: "info",
                }),
            );
        };

        const onReconnect = () => {
            if (poolRef.current) emitPoolJoin(poolRef.current);
        };

        socket.on("matched", onMatched);
        socket.on("pool:timeout", onPoolTimeout);
        socket.on("connect", onReconnect);
        // socket.on("queue_joined", onQueueJoined);
        // socket.on("match_found", onMatchFound);
        // socket.on("queue_left", onQueueLeft);
        // socket.on("queue_error", onQueueError);
        // socket.on("queue_timeout", onQueueTimeout);

        return () => {
            socket.off("matched", onMatched);
            socket.off("pool:timeout", onPoolTimeout);
            socket.off("connect", onReconnect);
        };
    }, [ctxSocket, dispatch, openMatch, resetStatus, emitPoolJoin]);

    useEffect(
        () => () => {
            if (poolRef.current) getSocket()?.emit("pool:leave", () => {});
        },
        [],
    );

    return {
        status,
        queuedPool,
        secondsLeft: secondsLeft ?? 0,
        joinQueue,
        leaveQueue,
        resetStatus,
    };
}
