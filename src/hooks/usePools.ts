import { useState, useEffect, useCallback } from "react";
import { callAPIInterface } from "@/utils";
import { useSocket } from "@/context/SocketContext";
import { STAKE_CURRENCY, POOLS_FALLBACK } from "@/constants/config";
import type {
    Pool,
    IPoolStats,
    IPoolsResponse,
    GameCategory,
    PoolCategory,
} from "@/types/types";

const DEFAULT_STATS: IPoolStats = { games: 0, players: 0 };

function parseCategory(id: string): GameCategory {
    const prefix = id.split("-")[0];
    if (
        prefix === "bullet" ||
        prefix === "blitz" ||
        prefix === "rapid" ||
        prefix === "classical"
    ) {
        return prefix;
    }
    return "rapid";
}

export function usePools(poolType: PoolCategory = "all") {
    const { socket: ctxSocket } = useSocket();
    const [pools, setPools] = useState<Pool[]>([]);
    const [stats, setStats] = useState<IPoolStats>(DEFAULT_STATS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const applyResponse = useCallback((data: IPoolsResponse) => {
        const parsed: Pool[] = data.pools.map((p) => ({
            ...p,
            currency: data.currency,
            category: parseCategory(p.id),
        }));
        setPools(parsed);
        setStats(data.stats);
    }, []);

    // ── Initial REST fetch, re-run whenever the category tab changes ───────────
    useEffect(() => {
        setLoading(true);
        setError(false);
        callAPIInterface<undefined, IPoolsResponse>(
            "GET",
            `/matchmaking/pools?currency=${STAKE_CURRENCY}&pool_type=${poolType}`,
        )
            .then(applyResponse)
            .catch(() => {
                setError(true);
                setPools(POOLS_FALLBACK);
                setStats(DEFAULT_STATS);
            })
            .finally(() => setLoading(false));
    }, [applyResponse, poolType]);

    // ── Live updates via socket ───────────────────────────────────────────────
    useEffect(() => {
        if (!ctxSocket) return;

        const onPoolUpdated = (data: IPoolsResponse) => {
            if (data.currency === STAKE_CURRENCY) applyResponse(data);
        };

        ctxSocket.on("pool_updated", onPoolUpdated);
        return () => {
            ctxSocket.off("pool_updated", onPoolUpdated);
        };
    }, [applyResponse, ctxSocket]);

    return { pools, stats, loading, error };
}
