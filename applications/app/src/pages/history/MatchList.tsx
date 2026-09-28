import Card from "@gopvp/common/src/components/Card/Card";
import VirtualList from "@gopvp/common/src/components/VirtualList/VirtualList";
import MatchRowSkeleton from "@gopvp/app/src/components/common/MatchRowSkeleton";
import { shortenUsername } from "@gopvp/common/src/util/format";
import { formatMatchDate } from "@gopvp/app/src/utils";
import { MATCH_RESULT_OUTCOMES } from "@gopvp/common/src/constants/mapper";
import type { IMatchHistoryItem } from "@gopvp/common/src/types/response";
import type { IMatchListProps } from "@gopvp/common/src/types/component";
import { youText } from "@gopvp/common/src/constants/message";
import MatchRow from "@gopvp/app/src/pages/history/MatchRow";

function matchRow(item: IMatchHistoryItem, currentUsername?: string) {
 const displayName = (username: string) =>
  username === currentUsername ? youText : shortenUsername(username);
 if ("winner" in item) {
  return (
   <MatchRow
    outcome="win"
    selfName={displayName(item.winner)}
    opponentName={displayName(item.loser)}
    amount={Math.abs(item.amount)}
    dateLabel={formatMatchDate(item.created)}
   />
  );
 }
 return (
  <MatchRow
   outcome={MATCH_RESULT_OUTCOMES[item.result]}
   opponentName={shortenUsername(item.opponent)}
   time={item.time}
   endReason={item.end_reason}
   amount={Math.abs(item.amount)}
   betAmount={item.bet}
   dateLabel={formatMatchDate(item.created)}
  />
 );
}

export default function MatchList({
 items,
 currentUsername,
 loadingMore,
 loadMore,
}: IMatchListProps) {
 return (
  <Card customClass="stat-list match-row-list">
   <VirtualList<IMatchHistoryItem>
    data={items}
    computeItemKey={(_, item) => item.id}
    itemContent={(_, item) => matchRow(item, currentUsername)}
    endReached={loadMore}
    components={{
     Footer: () => (loadingMore ? <MatchRowSkeleton /> : null),
    }}
   />
  </Card>
 );
}
