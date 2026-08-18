import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { getSocket } from "@/lib/socket";
import { useSocket } from "@/context/SocketContext";
import { useReduxDispatch } from "@/redux/hooks";
import { showToast } from "@/redux/common/common.slice";
import { buildGameRoomUrl } from "@/utils";
import type {
    Pool,
    ImatchFoundResponse,
    IqueueJoinedResponse,
    IqueueLeftResponse,
    IqueueErrorResponse,
    IQueueTimeoutResponse,
} from "@/types/types";

export type MatchmakingStatus = "idle" | "joining" | "queued" | "found";

export function useMatchmaking() {
    const [status, setStatus] = useState<MatchmakingStatus>("idle");
    const [queuedPool, setQueuedPool] = useState<Pool | null>(null);
    const poolRef = useRef<Pool | null>(null);
    const navigate = useNavigate();
    const { socket: ctxSocket } = useSocket();
    const dispatch = useReduxDispatch();

    const joinQueue = (pool: Pool) => {
        const socket = getSocket();
        if (!socket) return;
        poolRef.current = pool;
        setQueuedPool(pool);
        setStatus("joining");
        socket.emit("join_queue", {
            stake_amount: pool.stake,
            pool_type: pool.category,
        });
    };

    const resetStatus = () => {
        setStatus("idle");
        setQueuedPool(null);
        poolRef.current = null;
    };

    const leaveQueue = () => {
        const socket = getSocket();
        if (!socket || !poolRef.current) return;
        const pool = poolRef.current;
        socket.emit("leave_queue", {
            stake_amount: pool.stake,
            pool_type: pool.category,
        });

        resetStatus();
    };

    useEffect(() => {
        const socket = ctxSocket ?? getSocket();
        if (!socket) return;

        const onQueueJoined = (_data: IqueueJoinedResponse) => {
            setStatus("queued");
        };

        const onMatchFound = (match: ImatchFoundResponse) => {
            setStatus("found");
            navigate(buildGameRoomUrl(match), { replace: true });
        };

        const onQueueLeft = (_data: IqueueLeftResponse) => {
            resetStatus();
        };

        const onQueueError = ({ message }: IqueueErrorResponse) => {
            dispatch(showToast({ message, severity: "error" }));
            resetStatus();
        };

        const onQueueTimeout = ({ message }: IQueueTimeoutResponse) => {
            dispatch(showToast({ message, severity: "info" }));
            resetStatus();
        };

        socket.on("queue_joined", onQueueJoined);
        socket.on("match_found", onMatchFound);
        socket.on("queue_left", onQueueLeft);
        socket.on("queue_error", onQueueError);
        socket.on("queue_timeout", onQueueTimeout);

        return () => {
            socket.off("queue_joined", onQueueJoined);
            socket.off("match_found", onMatchFound);
            socket.off("queue_left", onQueueLeft);
            socket.off("queue_error", onQueueError);
            socket.off("queue_timeout", onQueueTimeout);
        };
    }, [navigate, ctxSocket]);

    return { status, queuedPool, joinQueue, leaveQueue, resetStatus };
}
