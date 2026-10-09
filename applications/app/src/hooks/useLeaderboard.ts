import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "@gopvp/app/src/config/firebase";
import { callAPIInterface } from "@gopvp/common/src/util/api";
import { useGame } from "@gopvp/app/src/hooks/useGame";
import type {
 LeaderboardScope,
 LeaderboardSort,
} from "@gopvp/common/src/types/index";
import type { ILeaderboardBody } from "@gopvp/common/src/types/payload";
import type {
 IListResponse,
 ILeaderboardDocResponse,
 ILeaderboardRowResponse,
} from "@gopvp/common/src/types/response";
import {
 ENDPOINTS,
 FIRESTORE_COLLECTIONS,
} from "@gopvp/common/src/constants/endpoint";
import { firebaseProjectId } from "@gopvp/common/src/constants/env";
import { DAY_MS } from "@gopvp/app/src/constants/limit";

function currentPeriodStart(scope: LeaderboardScope): number {
 const now = new Date();
 const dayStart = Date.UTC(
  now.getUTCFullYear(),
  now.getUTCMonth(),
  now.getUTCDate(),
 );
 if (scope === "weekly") return dayStart - now.getUTCDay() * DAY_MS;
 if (scope === "monthly")
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1);
 return dayStart;
}

function isCurrentBoard(scope: LeaderboardScope, periodStart: number | null) {
 return (
  scope === "all" ||
  periodStart === null ||
  periodStart >= currentPeriodStart(scope)
 );
}

export function useLeaderboard(scope: LeaderboardScope, sort: LeaderboardSort) {
 const { game } = useGame();
 const [players, setPlayers] = useState<ILeaderboardRowResponse[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(false);

 useEffect(() => {
  let cancelled = false;
  setLoading(true);
  setError(false);

  const loadFromApi = async () => {
   try {
    const page = await callAPIInterface<
     IListResponse<ILeaderboardRowResponse>,
     ILeaderboardBody
    >("POST", ENDPOINTS.LEADERBOARD, { game, scope, sort });
    if (!cancelled) setPlayers(page?.data ?? []);
   } catch (err) {
    console.error(err);
    if (!cancelled) {
     setError(true);
     setPlayers([]);
    }
   } finally {
    if (!cancelled) setLoading(false);
   }
  };

  if (!firebaseProjectId) {
   loadFromApi();
   return () => {
    cancelled = true;
   };
  }

  const unsubscribe = onSnapshot(
   doc(
    firestore,
    FIRESTORE_COLLECTIONS.LEADERBOARDS,
    `${game}_${scope}_${sort}`,
   ),
   (snapshot) => {
    const board = snapshot.data() as ILeaderboardDocResponse | undefined;
    setPlayers(
     board && isCurrentBoard(scope, board.period_start) ? board.data : [],
    );
    setLoading(false);
   },
   (err) => {
    console.error(err);
    loadFromApi();
   },
  );
  return () => {
   cancelled = true;
   unsubscribe();
  };
 }, [game, scope, sort]);

 return { players, loading, error };
}
