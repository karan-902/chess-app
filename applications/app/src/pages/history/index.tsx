import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import CustomBadge from "@gopvp/common/src/components/Badge/Badge";
import Card from "@gopvp/common/src/components/Card/Card";
import VirtualList from "@gopvp/common/src/components/VirtualList/VirtualList";
import EmptyState from "@gopvp/app/src/components/common/EmptyState";
import StatList from "@gopvp/app/src/components/common/StatList";
import MatchRowSkeleton from "@gopvp/app/src/components/common/MatchRowSkeleton";
import Button from "@gopvp/common/src/components/Button/Button";
import { useGameHistory } from "@gopvp/app/src/hooks/useGameHistory";
import { useReduxSelector } from "@gopvp/app/src/redux/hooks";
import { useGame } from "@gopvp/app/src/hooks/useGame";
import {
 shortenUsername,
 formatText,
 formatAmount,
} from "@gopvp/common/src/util/format";
import { formatMatchDate } from "@gopvp/app/src/utils";
import { MATCH_RESULT_OUTCOMES } from "@gopvp/common/src/constants/mapper";
import type { IMatchHistoryItem } from "@gopvp/common/src/types/response";
import type {
 IMatchListProps,
 MatchesSubtab,
} from "@gopvp/common/src/types/component";
import type { IMatchRowProps } from "@gopvp/app/src/types/component";
import {
 welcomeText,
 makeFirstMoveText,
 noDataFoundText,
 noGamesYetText,
 globalActivityEmptyText,
 vsText,
 chessText,
 bestStreakText,
 winsText,
 grossIncomeText,
 currentStreakText,
} from "@gopvp/app/src/constants/message";
import {
 MATCHES_STATS_FALLBACK,
 HISTORY_SKELETON_ROWS,
 MATCH_STATS_SKELETON_ROWS,
} from "@gopvp/app/src/constants/limit";
import { youText, scoreText } from "@gopvp/common/src/constants/message";
import { MATCHES_SUBTAB_OPTIONS } from "@gopvp/app/src/constants/option";
import { MATCHES_SUBTAB_LABELS } from "@gopvp/app/src/constants/label";
import { renderSkeletons } from "@gopvp/app/src/utils/skeleton";

function MatchRow({
 outcome,
 opponentName,
 time,
 endReason,
 amount,
 betAmount,
 dateLabel,
 selfName,
}: IMatchRowProps) {
 const {
  gameModule: { MatchIcon, endReasonLabels },
 } = useGame();
 const metaParts = [
  endReason && (endReasonLabels[endReason] ?? formatText(endReason)),
  betAmount !== undefined && `${formatAmount(betAmount)} stake`,
  dateLabel,
 ].filter(Boolean);
 return (
  <Box customClass="match-row-item">
   <Box customClass={classNames("match-row", outcome)}>
    <Box customClass="match-row-info">
     {time !== undefined && (
      <Box customClass="match-row-icon">
       <MatchIcon time={time} />
      </Box>
     )}
     <Box customClass="match-row-text">
      <Text customClass="match-row-headline row-title">
       {selfName && (
        <>
         {selfName}
         <CustomBadge customClass="match-row-vs" badgeContent={vsText} />
        </>
       )}
       {opponentName}
      </Text>
      <Text customClass="match-row-time meta-text">
       {metaParts.join(" · ")}
      </Text>
     </Box>
    </Box>
    <Box customClass="match-row-amt-wrap">
     <Box customClass="match-row-amt-row">
      <Text
       component="span"
       customClass={classNames("amount-value", {
        pos: outcome === "win",
        neg: outcome === "loss",
        neutral: outcome === "draw",
       })}
      >
       {outcome === "win" && `+${formatAmount(amount)}`}
       {outcome === "loss" && `-${formatAmount(amount)}`}
       {outcome === "draw" && `${amount > 0 ? "-" : ""}${formatAmount(amount)}`}
      </Text>
     </Box>
    </Box>
   </Box>
  </Box>
 );
}

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

function MatchList({
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

export default function MyMatches() {
 const [searchParams, setSearchParams] = useSearchParams();
 const tabParam = searchParams.get("tab");
 const [subtab, setSubtabState] = useState<MatchesSubtab>(
  MATCHES_SUBTAB_OPTIONS.includes(tabParam as MatchesSubtab)
   ? (tabParam as MatchesSubtab)
   : "history",
 );
 const setSubtab = (tab: MatchesSubtab) => {
  setSubtabState(tab);
  setSearchParams({ tab }, { replace: true });
 };

 useEffect(() => {
  if (!tabParam) setSearchParams({ tab: subtab }, { replace: true });
 }, [tabParam, subtab, setSearchParams]);
 const currentUsername = useReduxSelector(
  (state) => state.auth.session?.username,
 );
 const { items, loading, loadingMore, error, loadMore, stats, statsLoading } =
  useGameHistory(subtab === "global" ? "worldwide" : "own", subtab === "stats");

 return (
  <Box customClass="matches-page">
   <Box customClass="filter-pill-row">
    {MATCHES_SUBTAB_OPTIONS.map((tab) => (
     <Button
      key={tab}
      type="button"
      customClass={classNames(
       "filter-dropdown-btn",
       subtab === tab && "active",
      )}
      aria-pressed={subtab === tab}
      onClick={() => setSubtab(tab)}
     >
      {MATCHES_SUBTAB_LABELS[tab]}
     </Button>
    ))}
   </Box>

   {subtab === "history" &&
    (loading ? (
     <Card customClass="stat-list match-row-list">
      {renderSkeletons(HISTORY_SKELETON_ROWS, MatchRowSkeleton)}
     </Card>
    ) : items.length === 0 ? (
     <EmptyState
      title={error ? noDataFoundText : welcomeText}
      description={!error ? makeFirstMoveText : undefined}
     />
    ) : (
     <MatchList
      items={items}
      currentUsername={currentUsername}
      loadingMore={loadingMore}
      loadMore={loadMore}
     />
    ))}

   {subtab === "global" &&
    (loading ? (
     <Card customClass="stat-list match-row-list">
      {renderSkeletons(HISTORY_SKELETON_ROWS, MatchRowSkeleton)}
     </Card>
    ) : items.length === 0 ? (
     <EmptyState
      title={error ? noDataFoundText : noGamesYetText}
      description={!error ? globalActivityEmptyText : undefined}
     />
    ) : (
     <MatchList
      items={items}
      currentUsername={currentUsername}
      loadingMore={loadingMore}
      loadMore={loadMore}
     />
    ))}

   {subtab === "stats" && (
    <Box customClass="matches-stats">
     <Box customClass="matches-stats-head">
      <Text component="h3" customClass="matches-stats-title">
       {chessText}
      </Text>
     </Box>
     <StatList
      rows={
       statsLoading
        ? null
        : [
           {
            label: scoreText,
            value: Math.round(stats?.score ?? MATCHES_STATS_FALLBACK),
           },
           {
            label: currentStreakText,
            value: stats?.current_streak ?? MATCHES_STATS_FALLBACK,
           },
           {
            label: bestStreakText,
            value: stats?.best_streak ?? MATCHES_STATS_FALLBACK,
           },
           {
            label: winsText,
            value: stats?.wins ?? MATCHES_STATS_FALLBACK,
           },
           {
            label: grossIncomeText,
            value: formatAmount(stats?.gross_income ?? MATCHES_STATS_FALLBACK),
           },
          ]
      }
      skeletonRows={MATCH_STATS_SKELETON_ROWS}
     />
    </Box>
   )}
  </Box>
 );
}
