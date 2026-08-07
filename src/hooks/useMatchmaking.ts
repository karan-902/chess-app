import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { getSocket } from "@/lib/socket";
import { useSocket } from "@/context/SocketContext";
import {
    matchmakingHookFailedTitle,
    matchmakingHookNoOpponentTitle,
    matchmakingHookNoOpponentFallbackDescription,
} from "@/constants/messages";
import type {
    Pool,
    ImatchFoundResponse,
    IqueueJoinedResponse,
    IqueueLeftResponse,
    IqueueErrorResponse,
    IQueueTimeoutResponse,
} from "@/types/types";

export type MatchmakingStatus = "idle" | "queued" | "found";

export function useMatchmaking() {
    const [status, setStatus] = useState<MatchmakingStatus>("idle");
    const [queuedPool, setQueuedPool] = useState<Pool | null>(null);
    const poolRef = useRef<Pool | null>(null);
    const navigate = useNavigate();
    const { socket: ctxSocket } = useSocket();

    const joinQueue = (pool: Pool) => {
        const socket = getSocket();
        if (!socket) return;
        poolRef.current = pool;
        setQueuedPool(pool);
        setStatus("queued");
        socket.emit("join_queue", {
            stake_amount: pool.stake,
            currency: pool.currency,
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
            currency: pool.currency,
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
            const pool = poolRef.current;
            navigate(
                `/play?mode=pvp&time=${pool?.category ?? "rapid"}&game_id=${match.game_id}&color=${match.your_color}&opponent=${encodeURIComponent(match.opponent.username)}&opp_rating=${match.opponent.elo_rating}&opp_id=${match.opponent.id}&opp_avatar_seed=${encodeURIComponent(match.opponent.avatar_seed ?? "")}&initial_timeout=${match.inactivity_timeout_seconds}&stake_amount=${match.stake_amount}`,
                { replace: true },
            );
        };

        const onQueueLeft = (_data: IqueueLeftResponse) => {
            resetStatus();
        };

        const onQueueError = ({ message }: IqueueErrorResponse) => {
            toast.error(matchmakingHookFailedTitle, {
                description: message,
                duration: 5000,
            });
            resetStatus();
        };

        const onQueueTimeout = ({ message }: IQueueTimeoutResponse) => {
            toast.info(matchmakingHookNoOpponentTitle, {
                description:
                    message || matchmakingHookNoOpponentFallbackDescription,
                duration: 5000,
            });
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
