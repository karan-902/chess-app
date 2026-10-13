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
import { Crown } from "@gopvp/common/src/components/images";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomBadge from "@gopvp/common/src/components/Badge/Badge";
import { renderSkeletons } from "@gopvp/app/src/utils/skeleton";

export default function Leaderboard() {
 const dispatch = useReduxDispatch();
 const scope = useReduxSelector((state) => state.game.leaderboardScope);
 const sort = useReduxSelector((state) => state.game.leaderboardSort);

 const { players, loading, error } = useLeaderboard(scope, sort);
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
 const valueClass = classNames(
  "amount-value",
  sort === "earnings" && "lb-earnings",
 );
 const podiumSize =
  players.length >= LEADERBOARD_PODIUM_SIZE ? LEADERBOARD_PODIUM_SIZE : 0;

 return (
  <Box customClass="leaderboard-page">
   <Box customClass="filter-pill-row">
    {LEADERBOARD_SORTS.map((option) => (
     <Button
      key={option}
      type="button"
      customClass={classNames(
       "filter-dropdown-btn",
       sort === option && "active",
      )}
      aria-pressed={sort === option}
      onClick={() => dispatch(setLeaderboardSort(option))}
     >
      {LEADERBOARD_SORT_LABELS[option]}
     </Button>
    ))}
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
       {players.slice(0, podiumSize).map((player, index) => (
        <Box
         key={player.id}
         customClass={classNames(
          "lb-podium-col",
          LEADERBOARD_PODIUM_PLACES[index],
         )}
         onClick={() => setSelectedPlayerId(player.id)}
        >
         {index === 0 && <Crown />}
         {isMe(player.id) && (
          <CustomBadge customClass="lb-you-tag" badgeContent={youText} />
         )}
         <Text customClass="lb-podium-name">
          {shortenUsername(player.username)}
         </Text>
         <Text customClass={classNames("lb-podium-value", valueClass)}>
          {playerValue(player)}
         </Text>
         <Card
          customClass={classNames(
           "lb-podium-card",
           LEADERBOARD_PODIUM_PLACES[index],
           isMe(player.id) && "me",
          )}
         >
          <Text component="span" customClass="lb-podium-rank">
           {index + 1}
          </Text>
         </Card>
        </Box>
       ))}
      </Box>
     )}
     <VirtualList<ILeaderboardRowResponse>
      data={players.slice(podiumSize)}
      computeItemKey={(_, player) => player.id}
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
         <Text customClass={valueClass}>{playerValue(player)}</Text>
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
