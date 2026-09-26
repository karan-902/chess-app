import { useState, useEffect, useCallback, useRef } from "react";
import { callAPIInterface, showApiErrorToast } from "@/utils";
import { useGame } from "@/hooks/useGame";
import type {
    ILeaderboardPlayer,
    ILeaderboardRequestBody,
    ILeaderboardResponse,
    LeaderboardScope,
    LeaderboardSort,
} from "@/types/types";

export function useLeaderboard(scope: LeaderboardScope, sort: LeaderboardSort) {
    const { game } = useGame();
    const [players, setPlayers] = useState<ILeaderboardPlayer[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(false);

    const hasMoreRef = useRef(false);
    const pageIdRef = useRef<string | null>(null);
    const isFetchingRef = useRef(false);
    const activeQueryRef = useRef("");

    const load = useCallback(
        async (isFirstLoad: boolean) => {
            if (!isFirstLoad && (isFetchingRef.current || !hasMoreRef.current)) return;

            const query = `game=${game}&scope=${scope}&sort=${sort}`;
            activeQueryRef.current = query;
            isFetchingRef.current = true;
            isFirstLoad ? setLoading(true) : setLoadingMore(true);
            setError(false);

            const endingBefore =
                !isFirstLoad && pageIdRef.current ? pageIdRef.current : undefined;

            try {
                const res = await callAPIInterface<
                    ILeaderboardRequestBody,
                    ILeaderboardResponse
                >("POST", "/leaderboard", {
                    game,
                    scope,
                    sort,
                    ending_before: endingBefore,
                });
                if (activeQueryRef.current !== query) return;
                const data = res.data ?? [];
                setPlayers((prev) => (isFirstLoad ? data : [...prev, ...data]));
                hasMoreRef.current = res.has_more;
                pageIdRef.current = res.page_id;
            } catch (err) {
                if (activeQueryRef.current === query) setError(true);
                showApiErrorToast(err);
            } finally {
                isFetchingRef.current = false;
                if (activeQueryRef.current === query) {
                    isFirstLoad ? setLoading(false) : setLoadingMore(false);
                }
            }
        },
        [game, scope, sort],
    );

    useEffect(() => {
        load(true);
    }, [load]);

    const loadMore = useCallback(() => load(false), [load]);

    return { players, loading, loadingMore, error, loadMore };
}
