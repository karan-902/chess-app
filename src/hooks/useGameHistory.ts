import { useCallback, useEffect, useRef, useState } from "react";
import { callAPIInterface } from "@/utils";
import type {
    IGameHistoryItem,
    IGameHistoryResponse,
    IGameHistoryStatsResponse,
} from "@/types/types";

const PAGE_SIZE = 20;

export function useGameHistory() {
    const [items, setItems] = useState<IGameHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(false);

    const [stats, setStats] = useState({ winRate: 0, games: 0, netPL: 0 });
    const [statsLoading, setStatsLoading] = useState(true);

    const hasMoreRef = useRef(true);
    const pageIdRef = useRef<string | null>(null);
    const isFetchingRef = useRef(false);

    const load = useCallback(async (isFirstLoad: boolean) => {
        if (isFetchingRef.current) return;
        if (!isFirstLoad && !hasMoreRef.current) return;

        isFetchingRef.current = true;
        isFirstLoad ? setLoading(true) : setLoadingMore(true);
        setError(false);

        const cursor =
            !isFirstLoad && pageIdRef.current
                ? `&ending_before=${encodeURIComponent(pageIdRef.current)}`
                : "";

        try {
            const res = await callAPIInterface<undefined, IGameHistoryResponse>(
                "GET",
                `/game/history?limit=${PAGE_SIZE}${cursor}`,
            );
            setItems((prev) => (isFirstLoad ? res.data : [...prev, ...res.data]));
            hasMoreRef.current = res.has_more;
            pageIdRef.current = res.page_id;
        } catch {
            setError(true);
        } finally {
            isFetchingRef.current = false;
            isFirstLoad ? setLoading(false) : setLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        load(true);
    }, [load]);

    const loadMore = useCallback(() => load(false), [load]);

    useEffect(() => {
        callAPIInterface<undefined, IGameHistoryStatsResponse>(
            "GET",
            "/game/history/stats",
        )
            .then((res) =>
                setStats({
                    winRate: res.win_rate,
                    games: res.games,
                    netPL: res.net_pl_usd,
                }),
            )
            .catch(() => {})
            .finally(() => setStatsLoading(false));
    }, []);

    return {
        items,
        loading,
        loadingMore,
        error,
        hasMoreRef,
        loadMore,
        stats,
        statsLoading,
    };
}
