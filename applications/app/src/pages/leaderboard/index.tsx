import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Card from "@gopvp/common/src/components/Card/Card";
import FilterDropdown from "@gopvp/app/src/components/common/FilterDropdown";
import EmptyState from "@gopvp/app/src/components/common/EmptyState";
import LbRowSkeleton from "@gopvp/app/src/components/common/LbRowSkeleton";
import VirtualList from "@gopvp/common/src/components/VirtualList/VirtualList";
import LeaderboardPlayerModal from "@gopvp/app/src/pages/leaderboard/PlayerRowModal";
import { useLeaderboard } from "@gopvp/app/src/hooks/useLeaderboard";
import { useReduxSelector } from "@gopvp/app/src/redux/hooks";
import { formatAmount, shortenUsername } from "@gopvp/common/src/util/format";
import {
 LEADERBOARD_SCOPES,
 LEADERBOARD_SORTS,
 DEFAULT_LEADERBOARD_SCOPE,
 DEFAULT_LEADERBOARD_SORT,
} from "@gopvp/app/src/constants/option";
import {
 LEADERBOARD_SCOPE_LABELS,
 LEADERBOARD_SORT_LABELS,
} from "@gopvp/app/src/constants/label";
import type {
 LeaderboardScope,
 LeaderboardSort,
} from "@gopvp/common/src/types/index";
import type { ILeaderboardRowResponse } from "@gopvp/common/src/types/response";
import {
 noDataFoundText,
 noRankedPlayersText,
 dashText,
} from "@gopvp/app/src/constants/message";
import { youText } from "@gopvp/common/src/constants/message";
import { LEADERBOARD_SKELETON_ROWS } from "@gopvp/app/src/constants/limit";
import { renderSkeletons } from "@gopvp/app/src/utils/skeleton";

export default function Leaderboard() {
 const [searchParams, setSearchParams] = useSearchParams();
 const scopeParam = searchParams.get("scope") as LeaderboardScope;
 const sortParam = searchParams.get("sort") as LeaderboardSort;
 const scope = LEADERBOARD_SCOPES.includes(scopeParam)
  ? scopeParam
  : DEFAULT_LEADERBOARD_SCOPE;
 const sort = LEADERBOARD_SORTS.includes(sortParam)
  ? sortParam
  : DEFAULT_LEADERBOARD_SORT;

 const { players, loading, loadingMore, error, loadMore } = useLeaderboard(
  scope,
  sort,
 );
 const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
 const closePlayerModal = useCallback(() => setSelectedPlayerId(null), []);
 const currentUserId = useReduxSelector((state) => state.auth.session?.id);
 const currentUsername = useReduxSelector(
  (state) => state.auth.session?.username,
 );

 const isMe = (id: string) => id === currentUserId;
 const meInList = players.some((p) => isMe(p.id));
 const youLabel = (username: string) => `${username}(${youText})`;
 const playerValue = (player: ILeaderboardRowResponse) =>
  "wins" in player ? player.wins : formatAmount(player.win_amount);

 const setFilter = (key: "scope" | "sort", value: string) => {
  setSearchParams({ scope, sort, [key]: value }, { replace: true });
 };

 return (
  <Box customClass="leaderboard-page">
   <Box customClass="filter-pill-row">
    <FilterDropdown
     options={LEADERBOARD_SORTS}
     value={sort}
     onChange={(value) => setFilter("sort", value)}
     label={(value) => LEADERBOARD_SORT_LABELS[value]}
    />
    <FilterDropdown
     options={LEADERBOARD_SCOPES}
     value={scope}
     onChange={(value) => setFilter("scope", value)}
     label={(value) => LEADERBOARD_SCOPE_LABELS[value]}
    />
   </Box>
   {loading ? (
    <Box>{renderSkeletons(LEADERBOARD_SKELETON_ROWS, LbRowSkeleton)}</Box>
   ) : players.length === 0 ? (
    <EmptyState description={error ? noDataFoundText : noRankedPlayersText} />
   ) : (
    <Box>
     {!meInList && currentUserId && (
      <Card customClass="lb-row me">
       <Text customClass="lb-rank">{dashText}</Text>
       <Text customClass="lb-name row-title">
        {currentUsername ? youLabel(currentUsername) : youText}
       </Text>
       <Text customClass="lb-earnings amount-value">{dashText}</Text>
      </Card>
     )}
     <VirtualList<ILeaderboardRowResponse>
      data={players}
      computeItemKey={(_, player) => player.id}
      endReached={loadMore}
      components={{
       Footer: () => (loadingMore ? <LbRowSkeleton /> : null),
      }}
      itemContent={(index, player) => {
       const rank = index + 1;
       return (
        <Card
         customClass={classNames(
          "lb-row",
          "clickable",
          isMe(player.id) && "me",
         )}
         onClick={() => setSelectedPlayerId(player.id)}
        >
         <Text
          customClass={classNames("lb-rank", {
           gold: rank === 1,
           silver: rank === 2,
           bronze: rank === 3,
          })}
         >
          {rank}
         </Text>
         <Text customClass="lb-name row-title">
          {isMe(player.id)
           ? youLabel(shortenUsername(player.username))
           : shortenUsername(player.username)}
         </Text>
         <Text customClass="lb-earnings amount-value">
          {playerValue(player)}
         </Text>
        </Card>
       );
      }}
     />
    </Box>
   )}
   <LeaderboardPlayerModal
    playerId={selectedPlayerId}
    onClose={closePlayerModal}
   />
  </Box>
 );
}
