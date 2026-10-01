import Card from "@gopvp/common/src/components/Card/Card";
import VirtualList from "@gopvp/common/src/components/VirtualList/VirtualList";
import MatchRowSkeleton from "@gopvp/app/src/components/common/MatchRowSkeleton";
import { shortenUsername } from "@gopvp/common/src/util/format";
import { MATCH_RESULT_OUTCOMES } from "@gopvp/common/src/constants/mapper";
import { MATCH_ROW_HEADLINES } from "@gopvp/app/src/constants/mapper";
import type { IMatchHistoryItem } from "@gopvp/common/src/types/response";
import type { IMatchListProps } from "@gopvp/common/src/types/component";
import { getWorldMatchHeadline } from "@gopvp/app/src/utils";
import MatchRow from "@gopvp/app/src/pages/history/MatchRow";

function matchRow(
 item: IMatchHistoryItem,
 currentUsername?: string,
 onMatchClick?: (match: IMatchHistoryItem) => void,
) {
 const onClick = onMatchClick && (() => onMatchClick(item));
 if ("winner" in item) {
  return (
   <MatchRow
    outcome="win"
    headline={getWorldMatchHeadline(item.winner, item.loser, currentUsername)}
    amount={Math.abs(item.amount)}
    onClick={onClick}
   />
  );
 }
 const outcome = MATCH_RESULT_OUTCOMES[item.result];
 return (
  <MatchRow
   outcome={outcome}
   headline={MATCH_ROW_HEADLINES[outcome](shortenUsername(item.opponent))}
   amount={Math.abs(item.amount)}
   onClick={onClick}
  />
 );
}

export default function MatchList({
 items,
 currentUsername,
 loadingMore,
 loadMore,
 onMatchClick,
}: IMatchListProps) {
 return (
  <Card customClass="stat-list match-row-list">
   <VirtualList<IMatchHistoryItem>
    data={items}
    computeItemKey={(_, item) => item.id}
    itemContent={(_, item) => matchRow(item, currentUsername, onMatchClick)}
    endReached={loadMore}
    components={{
     Footer: () => (loadingMore ? <MatchRowSkeleton /> : null),
    }}
   />
  </Card>
 );
}
