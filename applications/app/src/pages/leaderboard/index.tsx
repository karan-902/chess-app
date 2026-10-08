import { useCallback, useState } from "react";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Card from "@gopvp/common/src/components/Card/Card";
import FilterDropdown from "@gopvp/app/src/components/common/FilterDropdown";
import EmptyState from "@gopvp/app/src/components/common/EmptyState";
import LbRowSkeleton from "@gopvp/app/src/components/common/LbRowSkeleton";
import VirtualList from "@gopvp/common/src/components/VirtualList/VirtualList";
import PlayerRowSheet from "@gopvp/app/src/pages/leaderboard/PlayerRowSheet";
import { useLeaderboard } from "@gopvp/app/src/hooks/useLeaderboard";
import { useReduxDispatch, useReduxSelector } from "@gopvp/app/src/redux/hooks";
import {
 setLeaderboardScope,
 setLeaderboardSort,
} from "@gopvp/app/src/redux/game/slice";
import { formatAmount, shortenUsername } from "@gopvp/common/src/util/format";
import {
 LEADERBOARD_SCOPES,
 LEADERBOARD_SORTS,
 LEADERBOARD_PODIUM_PLACES,
} from "@gopvp/app/src/constants/option";
import {
 LEADERBOARD_SCOPE_LABELS,
 LEADERBOARD_SORT_LABELS,
} from "@gopvp/app/src/constants/label";
import type { ILeaderboardRowResponse } from "@gopvp/common/src/types/response";
import {
 noDataFoundText,
 noRankedPlayersText,
 winToRankText,
 dashText,
} from "@gopvp/app/src/constants/message";
import { youText } from "@gopvp/common/src/constants/message";
import {
 LEADERBOARD_SKELETON_ROWS,
 LEADERBOARD_PODIUM_SIZE,
} from "@gopvp/app/src/constants/limit";
import { Crown, Medal } from "@gopvp/common/src/components/images";
import { renderSkeletons } from "@gopvp/app/src/utils/skeleton";

export default function Leaderboard() {
 const dispatch = useReduxDispatch();
 const scope = useReduxSelector((state) => state.game.leaderboardScope);
 const sort = useReduxSelector((state) => state.game.leaderboardSort);

 const { players, loading, loadingMore, error, loadMore } = useLeaderboard(
  scope,
  sort,
 );
 const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
 const closePlayerSheet = useCallback(() => setSelectedPlayerId(null), []);
 const currentUserId = useReduxSelector((state) => state.auth.session?.id);
 const currentUsername = useReduxSelector(
  (state) => state.auth.session?.username,
 );

 const isMe = (id: string) => id === currentUserId;
 const meInList = players.some((p) => isMe(p.id));
 const youLabel = (username: string) => `${username} (${youText})`;
 const playerName = (player: ILeaderboardRowResponse) =>
  isMe(player.id)
   ? youLabel(shortenUsername(player.username))
   : shortenUsername(player.username);
 const playerValue = (player: ILeaderboardRowResponse) =>
  "wins" in player ? player.wins : formatAmount(player.win_amount);
 const podiumSize =
  players.length >= LEADERBOARD_PODIUM_SIZE ? LEADERBOARD_PODIUM_SIZE : 0;

 return (
  <Box customClass="leaderboard-page gold-foil">
   <Box customClass="filter-pill-row">
    <FilterDropdown
     options={LEADERBOARD_SORTS}
     value={sort}
     onChange={(value) => dispatch(setLeaderboardSort(value))}
     label={(value) => LEADERBOARD_SORT_LABELS[value]}
    />
    <FilterDropdown
     options={LEADERBOARD_SCOPES}
     value={scope}
     onChange={(value) => dispatch(setLeaderboardScope(value))}
     label={(value) => LEADERBOARD_SCOPE_LABELS[value]}
    />
   </Box>
   {loading ? (
    <Box>{renderSkeletons(LEADERBOARD_SKELETON_ROWS, LbRowSkeleton)}</Box>
   ) : players.length === 0 ? (
    <EmptyState
     title={error ? noDataFoundText : noRankedPlayersText}
     description={!error ? winToRankText : undefined}
    />
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
     {podiumSize > 0 && (
      <Box customClass="lb-podium">
       {players.slice(0, podiumSize).map((player, index) => {
        const isFirst = index === 0;
        const PodiumIcon = isFirst ? Crown : Medal;
        return (
         <Card
          key={player.id}
          customClass={classNames(
           "lb-podium-card",
           "clickable",
           LEADERBOARD_PODIUM_PLACES[index],
           isMe(player.id) && "me",
          )}
          onClick={() => setSelectedPlayerId(player.id)}
         >
          <Box
           customClass={classNames("lb-podium-badge", {
            gold: index === 0,
            silver: index === 1,
            bronze: index === 2,
           })}
          >
           <PodiumIcon />
          </Box>
          <Text customClass="lb-podium-name row-title">
           {playerName(player)}
          </Text>
          <Text customClass="lb-podium-value lb-earnings amount-value">
           {playerValue(player)}
          </Text>
         </Card>
        );
       })}
      </Box>
     )}
     <VirtualList<ILeaderboardRowResponse>
      data={players.slice(podiumSize)}
      computeItemKey={(_, player) => player.id}
      endReached={loadMore}
      components={{
       Footer: () => (loadingMore ? <LbRowSkeleton /> : null),
      }}
      itemContent={(index, player) => {
       const rank = index + podiumSize + 1;
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
         <Text customClass="lb-name row-title">{playerName(player)}</Text>
         <Text customClass="lb-earnings amount-value">
          {playerValue(player)}
         </Text>
        </Card>
       );
      }}
     />
    </Box>
   )}
   <PlayerRowSheet playerId={selectedPlayerId} onClose={closePlayerSheet} />
  </Box>
 );
}
