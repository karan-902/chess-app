import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getSocket } from "@/lib/socket";
import { useSocket } from "@/context/SocketContext";
import { useReduxDispatch } from "@/redux/hooks";
import { showToast } from "@/redux/common/slice";
import { buildMatchUrl } from "@/utils";
import { useGame } from "@/hooks/useGame";
import { apiSomethingWentWrong, matchmakingNoOpponentFound } from "@/constants/messages";
import type {
    IPoolResponse,
    IPoolJoinAck,
    IPoolMatchedEvent,
    ISocketAckError,
} from "@/types/types";

export type MatchmakingStatus = "idle" | "joining" | "queued" | "found";

export function useMatchmaking() {
    const [status, setStatus] = useState<MatchmakingStatus>("idle");
    const [queuedPool, setQueuedPool] = useState<IPoolResponse | null>(null);
    const poolRef = useRef<IPoolResponse | null>(null);
    const navigate = useNavigate();
    const { game } = useGame();
    const { socket: ctxSocket } = useSocket();
    const dispatch = useReduxDispatch();

    const resetStatus = useCallback(() => {
        setStatus("idle");
        setQueuedPool(null);
        poolRef.current = null;
    }, []);

    const leaveQueue = useCallback(() => {
        if (poolRef.current) getSocket()?.emit("pool:leave", () => {});
        resetStatus();
    }, [resetStatus]);

    const openMatch = useCallback(
        (matchId: string) => {
            const pool = poolRef.current;
            if (!pool) return;
            poolRef.current = null;
            setStatus("found");
            navigate(buildMatchUrl(game, matchId, pool), { replace: true });
        },
        [game, navigate],
    );

    const emitPoolJoin = useCallback(
        (pool: IPoolResponse) => {
            getSocket()?.emit(
                "pool:join",
                { game, bet: pool.bet, time: pool.time },
                (err: ISocketAckError | null, data: IPoolJoinAck) => {
                    if (err) {
                        dispatch(
                            showToast({
                                isToastOpen: true,
                                toastMessage: err.errors[0]?.message ?? apiSomethingWentWrong,
                                toastVariant: "error",
                            }),
                        );
                        resetStatus();
                        return;
                    }
                    if (data.status === "MATCHED") {
                        openMatch(data.match_id);
                        return;
                    }
                    setStatus("queued");
                },
            );
        },
        [game, dispatch, resetStatus, openMatch],
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
                    toastMessage: matchmakingNoOpponentFound,
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

    return { status, queuedPool, joinQueue, leaveQueue, resetStatus };
}
