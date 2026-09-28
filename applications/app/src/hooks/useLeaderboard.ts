import { useCallback } from "react";
import { callAPIInterface } from "@gopvp/common/src/util/api";
import { useGame } from "@gopvp/app/src/hooks/useGame";
import { usePaginatedList } from "@gopvp/app/src/hooks/usePaginatedList";
import type {
 LeaderboardScope,
 LeaderboardSort,
} from "@gopvp/common/src/types/index";
import type { ILeaderboardBody } from "@gopvp/common/src/types/payload";
import type {
 IListResponse,
 ILeaderboardRowResponse,
} from "@gopvp/common/src/types/response";
import { ENDPOINTS } from "@gopvp/common/src/constants/endpoint";

export function useLeaderboard(scope: LeaderboardScope, sort: LeaderboardSort) {
 const { game } = useGame();

 const fetchPage = useCallback(
  (cursor: string | null) =>
   callAPIInterface<IListResponse<ILeaderboardRowResponse>, ILeaderboardBody>(
    "POST",
    ENDPOINTS.LEADERBOARD,
    { game, scope, sort, ending_before: cursor ?? undefined },
   ),
  [game, scope, sort],
 );

 const { items, ...list } = usePaginatedList(fetchPage);
 return { players: items, ...list };
}
