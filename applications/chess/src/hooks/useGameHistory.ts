import { useCallback, useEffect, useRef, useState } from "react";
import { callAPIInterface, showApiErrorToast } from "@/utils";
import type {
 IGameHistoryItem,
 IGameHistoryResponse,
 ILeaderboardPlayerStatsResponse,
} from "@/types/types";
import { useReduxSelector } from "@/redux/hooks";
import { useGame } from "@/hooks/useGame";

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
 const [loadedType, setLoadedType] = useState<"own" | "worldwide" | null>(null);
 const session = useReduxSelector((state) => state.auth.session);
 const { game } = useGame();
 const [stats, setStats] = useState<ILeaderboardPlayerStatsResponse | null>(
  null,
 );
 const [statsLoading, setStatsLoading] = useState(true);
 const [statsError, setStatsError] = useState(false);

 const hasMoreRef = useRef(true);
 const pageIdRef = useRef<string | null>(null);
 const isFetchingRef = useRef(false);
 const activeTypeRef = useRef(type);

 const load = useCallback(
  async (isFirstLoad: boolean) => {
   if (!isFirstLoad && (isFetchingRef.current || !hasMoreRef.current)) return;

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
     callAPIInterface<undefined, IGameHistoryResponse | null>(
      "GET",
      `/matches?game=${game}${type === "worldwide" ? "&scope=worldwide" : ""}${cursor}`,
     ),
    );
    if (activeTypeRef.current !== requestType) return;
    const data = res?.data ?? [];
    setItems((prev) => (isFirstLoad ? data : [...prev, ...data]));
    setLoadedType(requestType);
    hasMoreRef.current = res?.has_more ?? false;
    pageIdRef.current = res?.page_id ?? null;
   } catch (err) {
    if (activeTypeRef.current === requestType) setError(true);
    showApiErrorToast(err);
   } finally {
    isFetchingRef.current = false;
    if (activeTypeRef.current === requestType) {
     isFirstLoad ? setLoading(false) : setLoadingMore(false);
    }
   }
  },
  [type, game],
 );

 useEffect(() => {
  if (fetchStats) return;
  load(true);
 }, [load, fetchStats]);

 const loadMore = useCallback(() => load(false), [load]);

 useEffect(() => {
  if (!fetchStats) return;
  const loadStats = async () => {
   setStatsLoading(true);
   setStatsError(false);
   try {
    setStats(
     await withRetry(() =>
      callAPIInterface<undefined, ILeaderboardPlayerStatsResponse>(
       "GET",
       `/leaderboard/${session?.id}?game=${game}`,
      ),
     ),
    );
   } catch (err) {
    setStatsError(true);
    showApiErrorToast(err);
   } finally {
    setStatsLoading(false);
   }
  };
  loadStats();
 }, [fetchStats, game, session?.id]);

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
