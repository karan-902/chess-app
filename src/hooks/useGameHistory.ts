import { useCallback, useEffect, useRef, useState } from "react";
import { callAPIInterface } from "@/utils";
import type {
    IGameHistoryItem,
    IGameHistoryResponse,
    IGameHistoryStatsResponse,
} from "@/types/types";

const PAGE_SIZE = 20;
const RETRY_ATTEMPTS = 2;
const RETRY_DELAY_MS = 1000;

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
    for (let attempt = 0; ; attempt++) {
        try {
            return await fn();
        } catch (err) {
            if (attempt >= RETRY_ATTEMPTS) throw err;
            await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        }
    }
}

export function useGameHistory(
    type: "own" | "worldwide" = "own",
    fetchStats = false,
) {
    const [items, setItems] = useState<IGameHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(false);
    const [loadedType, setLoadedType] = useState<"own" | "worldwide" | null>(
        null,
    );

    const [stats, setStats] = useState({
        winRate: 0,
        games: 0,
        bestStreak: 0,
        currentStreak: 0,
    });
    const [statsLoading, setStatsLoading] = useState(true);
    const [statsError, setStatsError] = useState(false);

    const hasMoreRef = useRef(true);
    const pageIdRef = useRef<string | null>(null);
    const isFetchingRef = useRef(false);
    const activeTypeRef = useRef(type);

    const load = useCallback(
        async (isFirstLoad: boolean) => {
            if (!isFirstLoad && (isFetchingRef.current || !hasMoreRef.current))
                return;

            const requestType = type;
            activeTypeRef.current = type;
            isFetchingRef.current = true;
            isFirstLoad ? setLoading(true) : setLoadingMore(true);
            setError(false);

            const cursor =
                !isFirstLoad && pageIdRef.current
                    ? `&ending_before=${encodeURIComponent(pageIdRef.current)}`
                    : "";

            try {
                const res = await withRetry(() =>
                    callAPIInterface<undefined, IGameHistoryResponse>(
                        "GET",
                        `/game/history?type=${type}&limit=${PAGE_SIZE}${cursor}`,
                    ),
                );
                if (activeTypeRef.current !== requestType) return;
                setItems((prev) =>
                    isFirstLoad ? res.data : [...prev, ...res.data],
                );
                setLoadedType(requestType);
                hasMoreRef.current = res.has_more;
                pageIdRef.current = res.page_id;
            } catch {
                if (activeTypeRef.current === requestType) setError(true);
            } finally {
                isFetchingRef.current = false;
                if (activeTypeRef.current === requestType) {
                    isFirstLoad ? setLoading(false) : setLoadingMore(false);
                }
            }
        },
        [type],
    );

    useEffect(() => {
        if (fetchStats) return;
        load(true);
    }, [load, fetchStats]);

    const loadMore = useCallback(() => load(false), [load]);

    useEffect(() => {
        if (!fetchStats) return;
        setStatsLoading(true);
        setStatsError(false);
        withRetry(() =>
            callAPIInterface<undefined, IGameHistoryStatsResponse>(
                "GET",
                "/game/history/stats",
            ),
        )
            .then((res) =>
                setStats({
                    winRate: res.win_rate,
                    games: res.games,
                    bestStreak: res.best_streak,
                    currentStreak: res.current_streak,
                }),
            )
            .catch(() => setStatsError(true))
            .finally(() => setStatsLoading(false));
    }, [fetchStats]);

    return {
        items,
        loading: loading || loadedType !== type,
        loadingMore,
        error,
        hasMoreRef,
        loadMore,
        stats,
        statsLoading,
        statsError,
    };
}
