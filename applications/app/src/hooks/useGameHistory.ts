import { useCallback, useEffect, useState } from "react";
import {
 callAPIInterface,
 showApiErrorToast,
} from "@gopvp/common/src/util/api";
import type {
 IListResponse,
 IMatchHistoryItem,
 ILeaderboardPlayerResponse,
} from "@gopvp/common/src/types/response";
import { useReduxSelector } from "@gopvp/app/src/redux/hooks";
import { useGame } from "@gopvp/app/src/hooks/useGame";
import { usePaginatedList } from "@gopvp/app/src/hooks/usePaginatedList";
import { endingBeforeQuery } from "@gopvp/app/src/utils";
import {
 MATCH_HISTORY_RETRY_ATTEMPTS,
 MATCH_HISTORY_RETRY_DELAY_MS,
} from "@gopvp/app/src/constants/limit";
import { ENDPOINTS } from "@gopvp/common/src/constants/endpoint";

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
 for (let attempt = 0; ; attempt++) {
  try {
   return await fn();
  } catch (err) {
   if (attempt >= MATCH_HISTORY_RETRY_ATTEMPTS) throw err;
   await new Promise((r) => setTimeout(r, MATCH_HISTORY_RETRY_DELAY_MS));
  }
 }
}

export function useGameHistory(
 type: "own" | "worldwide" = "own",
 fetchStats = false,
) {
 const session = useReduxSelector((state) => state.auth.session);
 const { game } = useGame();
 const [stats, setStats] = useState<ILeaderboardPlayerResponse | null>(null);
 const [statsLoading, setStatsLoading] = useState(true);

 const fetchPage = useCallback(
  (cursor: string | null) =>
   withRetry(() =>
    callAPIInterface<IListResponse<IMatchHistoryItem> | null, undefined>(
     "GET",
     `${ENDPOINTS.MATCHES}?game=${game}${type === "worldwide" ? "&scope=worldwide" : ""}${endingBeforeQuery(cursor)}`,
    ),
   ),
  [type, game],
 );

 const list = usePaginatedList(fetchPage, !fetchStats);

 useEffect(() => {
  if (!fetchStats) return;
  const loadStats = async () => {
   setStatsLoading(true);
   try {
    setStats(
     await withRetry(() =>
      callAPIInterface<ILeaderboardPlayerResponse, undefined>(
       "GET",
       `${ENDPOINTS.LEADERBOARD}/${session?.id}?game=${game}`,
      ),
     ),
    );
   } catch (err) {
    showApiErrorToast(err);
   } finally {
    setStatsLoading(false);
   }
  };
  loadStats();
 }, [fetchStats, game, session?.id]);

 return { ...list, stats, statsLoading };
}
