import { useState, useEffect, useCallback } from "react";
import { callAPIInterface } from "@/utils";
import { useSocket } from "@/context/SocketContext";
import { useCurrency } from "@/context/CurrencyContext";
import { POOLS_BY_CURRENCY } from "@/constants/currencies";
import type { Pool, IPoolStats, IPoolsResponse, GameCategory } from "@/types/types";

const DEFAULT_STATS: IPoolStats = { liquidity: 0, games: 0, players: 0 };

function parseCategory(id: string): GameCategory {
    const prefix = id.split("-")[0];
    if (prefix === "bullet" || prefix === "blitz" || prefix === "rapid" || prefix === "classical") {
        return prefix;
    }
    return "rapid";
}

export function usePools() {
    const { currency } = useCurrency();
    const { socket: ctxSocket } = useSocket();
    const [pools, setPools] = useState<Pool[]>([]);
    const [stats, setStats] = useState<IPoolStats>(DEFAULT_STATS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const applyResponse = useCallback((data: IPoolsResponse) => {
        const parsed: Pool[] = data.pools.map(p => ({
            ...p,
            currency: data.currency,
            category: parseCategory(p.id),
        }));
        setPools(parsed);
        setStats(data.stats);
    }, []);

    // ── Initial REST fetch ────────────────────────────────────────────────────
    useEffect(() => {
        setLoading(true);
        setError(false);
        callAPIInterface<undefined, IPoolsResponse>("GET", `/matchmaking/pools?currency=${currency}`)
            .then(applyResponse)
            .catch(() => {
                setError(true);
                setPools(POOLS_BY_CURRENCY[currency]);
                setStats(DEFAULT_STATS);
            })
            .finally(() => setLoading(false));
    }, [currency, applyResponse]);

    // ── Live updates via socket ───────────────────────────────────────────────
    useEffect(() => {
        if (!ctxSocket) return;

        const onPoolUpdated = (data: IPoolsResponse) => {
            if (data.currency === currency) applyResponse(data);
        };

        ctxSocket.on("pool_updated", onPoolUpdated);
        return () => { ctxSocket.off("pool_updated", onPoolUpdated); };
    }, [currency, applyResponse, ctxSocket]);

    return { pools, stats, loading, error };
}
