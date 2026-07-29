import { useState, useEffect, useCallback } from "react";
import { callAPIInterface } from "@/utils";
import { useSocket } from "@/context/SocketContext";
import type { ILeaderboardPlayer, ILeaderboardResponse } from "@/types/types";

export function useLeaderboard() {
    const { socket: ctxSocket } = useSocket();
    const [players, setPlayers] = useState<ILeaderboardPlayer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const applyResponse = useCallback((data: ILeaderboardResponse) => {
        setPlayers(data.players);
    }, []);

    // ── Initial REST fetch ────────────────────────────────────────────────────
    useEffect(() => {
        setLoading(true);
        setError(false);
        callAPIInterface<undefined, ILeaderboardResponse>("GET", "/leaderboard")
            .then(applyResponse)
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [applyResponse]);

    // ── Live updates via socket ───────────────────────────────────────────────
    useEffect(() => {
        if (!ctxSocket) return;

        const onLeaderboardUpdated = (data: ILeaderboardResponse) => {
            applyResponse(data);
        };

        ctxSocket.emit("subscribe_leaderboard");
        ctxSocket.on("leaderboard_updated", onLeaderboardUpdated);

        return () => {
            ctxSocket.off("leaderboard_updated", onLeaderboardUpdated);
            ctxSocket.emit("unsubscribe_leaderboard");
        };
    }, [applyResponse, ctxSocket]);

    return { players, loading, error };
}
