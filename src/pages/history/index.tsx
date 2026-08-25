import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import classNames from "classnames";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Badge from "@/components/base/Badge/Badge";
import Card from "@/components/base/Card/Card";
import Skeleton from "@/components/base/Skeleton/Skeleton";
import VirtualList from "@/components/common/VirtualList";
import EmptyState from "@/components/common/EmptyState";
import StatRowSkeleton from "@/components/common/StatRowSkeleton";
import ChipSelect from "@/components/common/ChipSelect";
import { useGameHistory } from "@/hooks/useGameHistory";
import { useReduxSelector } from "@/redux/hooks";
import { deriveCategory, formatMatchDate, shortenUsername } from "@/utils";
import { formatText } from "@/utils/format";
import { CATEGORY_META, GAME_END_REASON_LABELS } from "@/constants/config";
import type { IGameHistoryItem } from "@/types/types";
import type {
    IMatchRowProps,
    IMatchListProps,
    MatchesSubtab,
} from "@/types/components";
import {
    matchesSubtabHistory,
    matchesSubtabGlobal,
    matchesSubtabStats,
    matchesEmptyTitle,
    matchesEmptyDesc,
    matchesLoadError,
    matchesGlobalEmptyTitle,
    matchesGlobalEmptyDesc,
    matchesStatsLoadError,
    matchesYouLabel,
    matchesVsLabel,
    matchesStatsTitle,
    matchesStatsSubtitle,
    matchesStatsWinRateLabel,
    matchesStatsGamesPlayedLabel,
    matchesStatsBestStreakLabel,
    matchesStatsFallback,
    matchesStatsCurrentStreakLabel,
} from "@/constants/messages";
import { formatAmount } from "@/utils/format";
const HISTORY_SKELETON_ROWS = 15;
const MATCHES_SUBTAB_OPTIONS: MatchesSubtab[] = [
    "history",
    "stats",
    "worldwide",
];
const MATCHES_SUBTAB_LABELS: Record<MatchesSubtab, string> = {
    history: matchesSubtabHistory,
    stats: matchesSubtabStats,
    worldwide: matchesSubtabGlobal,
};

function MatchRow({
    outcome,
    opponentName,
    category,
    endReason,
    amount,
    stakeAmount,
    dateLabel,
    selfName,
}: IMatchRowProps) {
    const CategoryIcon = CATEGORY_META[category].icon;
    return (
        <Box customClass="match-row-item">
            <Box customClass={classNames("match-row", outcome)}>
                <Box customClass="match-row-info">
                    <Box customClass="match-row-icon">
                        <CategoryIcon
                            className="match-row-svg"
                            strokeWidth={2}
                        />
                    </Box>
                    <Box customClass="match-row-text">
                        <Text
                            customClass="match-row-headline row-title"
                            truncate
                        >
                            {selfName && (
                                <>
                                    {selfName}
                                    <Badge
                                        customClass="match-row-vs"
                                        badgeContent={matchesVsLabel}
                                    />
                                </>
                            )}
                            {opponentName}
                        </Text>
                        <Text customClass="match-row-time meta-text">
                            {GAME_END_REASON_LABELS[endReason] ??
                                formatText(endReason)}{" "}
                            &middot; {formatAmount(stakeAmount)} stake &middot;{" "}
                            {dateLabel}
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
                            {outcome === "draw" &&
                                `${amount > 0 ? "-" : ""}${formatAmount(amount)}`}
                        </Text>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

function MatchRowSkeleton() {
    return (
        <Box customClass="match-row-item">
            <Box customClass="match-row">
                <Box customClass="match-row-info">
                    <Box customClass="match-row-icon">
                        <Skeleton variant="circular" width={18} height={18} />
                    </Box>
                    <Box customClass="match-row-text">
                        <Skeleton customClass="text" width={140} height={14} />
                        <Skeleton
                            customClass="text"
                            width={90}
                            height={11}
                            style={{ marginTop: "0.3rem" }}
                        />
                    </Box>
                </Box>
                <Skeleton customClass="text" width={48} height={16} />
            </Box>
        </Box>
    );
}

function historySkeletonRows() {
    return Array.from({ length: HISTORY_SKELETON_ROWS }, (_, index) => (
        <MatchRowSkeleton key={index} />
    ));
}

const STATS_SKELETON_ROWS = 5;

function statsSkeletonRows() {
    return Array.from({ length: STATS_SKELETON_ROWS }, (_, index) => (
        <StatRowSkeleton key={index} />
    ));
}

function matchRow(
    item: IGameHistoryItem,
    showSelf: boolean,
    currentUserId?: string,
) {
    if (!item) return null;
    const selfName = showSelf
        ? item.player?.id === currentUserId
            ? matchesYouLabel
            : shortenUsername(item.player?.username ?? "")
        : undefined;
    const opponentName =
        item.opponent?.id === currentUserId
            ? matchesYouLabel
            : shortenUsername(item.opponent?.username ?? "");
    return (
        <MatchRow
            outcome={item.result}
            opponentName={opponentName}
            category={deriveCategory(item.time_seconds)}
            endReason={item.end_reason}
            amount={Math.abs(item.settlement_usd)}
            stakeAmount={item.stake_amount}
            dateLabel={formatMatchDate(item.played_at)}
            selfName={selfName}
        />
    );
}

function MatchList({
    items,
    showSelf,
    currentUserId,
    loadingMore,
    loadMore,
}: IMatchListProps) {
    return (
        <Card customClass="matches-stat-list match-row-list">
            <VirtualList<IGameHistoryItem>
                data={items}
                computeItemKey={(_, item) => item.game_id}
                itemContent={(_, item) =>
                    matchRow(item, showSelf, currentUserId)
                }
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
    const currentUserId = useReduxSelector((state) => state.auth.session?.id);
    const {
        items,
        loading,
        loadingMore,
        error,
        loadMore,
        stats,
        statsLoading,
        statsError,
    } = useGameHistory(
        subtab === "worldwide" ? "worldwide" : "own",
        subtab === "stats",
    );

    return (
        <Box customClass="matches-page">
            <ChipSelect
                options={MATCHES_SUBTAB_OPTIONS}
                value={subtab}
                onChange={setSubtab}
                label={(s) => MATCHES_SUBTAB_LABELS[s]}
            />

            {subtab === "history" &&
                (loading ? (
                    <Card customClass="matches-stat-list match-row-list">
                        {historySkeletonRows()}
                    </Card>
                ) : items.length === 0 ? (
                    <EmptyState
                        title={error ? matchesLoadError : matchesEmptyTitle}
                        description={!error ? matchesEmptyDesc : undefined}
                    />
                ) : (
                    <MatchList
                        items={items}
                        showSelf={false}
                        currentUserId={currentUserId}
                        loadingMore={loadingMore}
                        loadMore={loadMore}
                    />
                ))}

            {subtab === "worldwide" &&
                (loading ? (
                    <Card customClass="matches-stat-list match-row-list">
                        {historySkeletonRows()}
                    </Card>
                ) : items.length === 0 ? (
                    <EmptyState
                        title={
                            error ? matchesLoadError : matchesGlobalEmptyTitle
                        }
                        description={
                            !error ? matchesGlobalEmptyDesc : undefined
                        }
                    />
                ) : (
                    <MatchList
                        items={items}
                        showSelf={true}
                        currentUserId={currentUserId}
                        loadingMore={loadingMore}
                        loadMore={loadMore}
                    />
                ))}

            {subtab === "stats" && (
                <Box customClass="matches-stats">
                    <Box customClass="matches-stats-head">
                        <Text component="h3" customClass="matches-stats-title">
                            {matchesStatsTitle}
                        </Text>
                        <Text customClass="caption">
                            {matchesStatsSubtitle}
                        </Text>
                    </Box>
                    <Card customClass="matches-stat-list">
                        {statsLoading ? (
                            statsSkeletonRows()
                        ) : statsError ? (
                            <EmptyState title={matchesStatsLoadError} />
                        ) : (
                            <>
                                <Box customClass="matches-stat-row">
                                    <Text
                                        customClass="matches-stat-title"
                                        component="span"
                                    >
                                        {matchesStatsWinRateLabel}
                                    </Text>
                                    <Text
                                        component="span"
                                        customClass="matches-stat-val"
                                    >
                                        {stats.winRate}%
                                    </Text>
                                </Box>
                                <Box customClass="matches-stat-row">
                                    <Text
                                        customClass="matches-stat-title"
                                        component="span"
                                    >
                                        {matchesStatsGamesPlayedLabel}
                                    </Text>
                                    <Text
                                        component="span"
                                        customClass="matches-stat-val"
                                    >
                                        {stats.games}
                                    </Text>
                                </Box>
                                <Box customClass="matches-stat-row">
                                    <Text
                                        component="span"
                                        customClass="matches-stat-title"
                                    >
                                        {matchesStatsBestStreakLabel}
                                    </Text>
                                    <Text
                                        component="span"
                                        customClass="matches-stat-val"
                                    >
                                        {stats.bestStreak > 0
                                            ? stats.bestStreak
                                            : matchesStatsFallback}
                                    </Text>
                                </Box>
                                <Box customClass="matches-stat-row">
                                    <Text
                                        component="span"
                                        customClass="matches-stat-title"
                                    >
                                        {matchesStatsCurrentStreakLabel}
                                    </Text>
                                    <Text
                                        component="span"
                                        customClass="matches-stat-val"
                                    >
                                        {stats.currentStreak > 0
                                            ? stats.currentStreak
                                            : matchesStatsFallback}
                                    </Text>
                                </Box>
                            </>
                        )}
                    </Card>
                </Box>
            )}
        </Box>
    );
}
