import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { getSocket } from "@/lib/socket";
import type { Pool, IMatchFound } from "@/types/types";

export type MatchmakingStatus = "idle" | "queued" | "found";

export function useMatchmaking() {
    const [status, setStatus] = useState<MatchmakingStatus>("idle");
    const [queuedPool, setQueuedPool] = useState<Pool | null>(null);
    const poolRef = useRef<Pool | null>(null);
    const navigate = useNavigate();

    const joinQueue = (pool: Pool) => {
        const socket = getSocket();
        if (!socket) return;
        poolRef.current = pool;
        setQueuedPool(pool);
        setStatus("queued");
        socket.emit("join_queue", { stake_amount: pool.stake_amount });
    };

    const leaveQueue = () => {
        const socket = getSocket();
        if (!socket || !poolRef.current) return;
        socket.emit("leave_queue", { stake_amount: poolRef.current.stake_amount });
    };

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const onQueueJoined = () => {
            setStatus("queued");
        };

        const onMatchFound = (match: IMatchFound) => {
            setStatus("found");
            const pool = poolRef.current;
            navigate(
                `/play?mode=pvp&time=${pool?.category ?? "rapid"}&game_id=${match.game_id}&color=${match.your_color}&opponent=${encodeURIComponent(match.opponent.user_name)}&opp_rating=${match.opponent.elo_rating}`,
                { replace: true },
            );
        };

        const onQueueLeft = () => {
            setStatus("idle");
            setQueuedPool(null);
            poolRef.current = null;
        };

        const onQueueError = ({ message }: { message: string }) => {
            toast.error("Matchmaking failed", { description: message, duration: 5000 });
            setStatus("idle");
            setQueuedPool(null);
            poolRef.current = null;
        };

        socket.on("queue_joined", onQueueJoined);
        socket.on("match_found", onMatchFound);
        socket.on("queue_left", onQueueLeft);
        socket.on("queue_error", onQueueError);

        return () => {
            socket.off("queue_joined", onQueueJoined);
            socket.off("match_found", onMatchFound);
            socket.off("queue_left", onQueueLeft);
            socket.off("queue_error", onQueueError);
        };
    }, [navigate]);

    return { status, queuedPool, joinQueue, leaveQueue };
}
