import { useState } from "react";
import classNames from "classnames";
import { Virtuoso } from "react-virtuoso";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Badge from "@/components/base/Badge/Badge";
import Button from "@/components/base/Button/Button";
import Card from "@/components/base/Card/Card";
import Skeleton from "@/components/base/Skeleton/Skeleton";
import { useGameHistory } from "@/hooks/useGameHistory";
import { useReduxSelector } from "@/redux/hooks";
import { formatMatchDate } from "@/utils";
import { formateText } from "@/utils/formate";
import { CATEGORY_META } from "@/constants/config";
import type { GameCategory } from "@/types/types";
import type { IGameHistoryItem } from "@/types/types";
import {
    matchesSubtabResults,
    matchesSubtabWorldwide,
    matchesSubtabStats,
    matchesEmptyTitle,
    matchesEmptyDesc,
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
import { formateAmount } from "@/utils/formate";

type Subtab = "results" | "worldwide" | "stats";

function deriveCategory(timeSeconds: number): GameCategory {
    if (timeSeconds <= 120) return "BULLET";
    if (timeSeconds <= 420) return "BLITZ";
    if (timeSeconds <= 1200) return "RAPID";
    return "CLASSICAL";
}

function MatchRow({
    outcome,
    opponentName,
    category,
    endReason,
    amount,
    dateLabel,
    selfName,
}: {
    outcome: "win" | "loss" | "draw";
    opponentName: string;
    category: GameCategory;
    endReason: string;
    amount: number;
    dateLabel: string;
    selfName?: string;
}) {
    const CategoryIcon = CATEGORY_META[category].icon;
    return (
        <Box customClass={classNames("match-row", outcome)}>
            <Box customClass="match-row-info">
                <Box customClass="match-row-icon">
                    <CategoryIcon size={15} strokeWidth={2} />
                </Box>
                <Box>
                    <Text customClass="match-row-headline">
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
                    <Box customClass="match-row-meta-row">
                        <Text customClass="match-row-time">
                            {formateText(endReason)}
                        </Text>
                        <Text customClass="match-row-time">{dateLabel}</Text>
                    </Box>
                </Box>
            </Box>
            <Text component="span" customClass="match-row-amt">
                {outcome === "win" && `+${formateAmount(amount)}`}
                {outcome === "loss" && `-${formateAmount(amount)}`}
                {outcome === "draw" && `${formateAmount(amount)}`}
            </Text>
        </Box>
    );
}

const HISTORY_SKELETON_ROWS = 15;

function MatchRowSkeleton() {
    return (
        <Box customClass="match-row">
            <Box customClass="match-row-info">
                <Skeleton
                    variant="circular"
                    customClass="circle"
                    width={32}
                    height={32}
                />
                <Box>
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
    );
}

function historySkeletonRows() {
    return Array.from({ length: HISTORY_SKELETON_ROWS }, (_, index) => (
        <MatchRowSkeleton key={index} />
    ));
}

const STATS_SKELETON_ROWS = 5;

function StatRowSkeleton() {
    return (
        <Box customClass="matches-stat-row">
            <Skeleton customClass="text" width={100} height={14} />
            <Skeleton customClass="text" width={40} height={16} />
        </Box>
    );
}

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
            : item.player?.username
        : undefined;
    return (
        <MatchRow
            outcome={item.result}
            opponentName={item.opponent?.username}
            category={deriveCategory(item.time_seconds)}
            endReason={item.end_reason}
            amount={Math.abs(item.settlement_usd)}
            dateLabel={formatMatchDate(item.played_at)}
            selfName={selfName}
        />
    );
}

function matchList(
    items: IGameHistoryItem[],
    showSelf: boolean,
    currentUserId: string | undefined,
    loadingMore: boolean,
    loadMore: () => void,
) {
    return (
        <Card customClass="matches-stat-list">
            <Virtuoso
                style={{ height: "100%" }}
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
    const [subtab, setSubtab] = useState<Subtab>("results");
    const currentUserId = useReduxSelector((state) => state.auth.session?.id);
    const { items, loading, loadingMore, loadMore, stats, statsLoading } =
        useGameHistory(
            subtab === "worldwide" ? "worldwide" : "own",
            subtab === "stats",
        );

    return (
        <Box customClass="matches-page">
            <Box customClass="subtabs">
                <Button
                    customClass={classNames(
                        "subtab-btn",
                        subtab === "results" && "active",
                    )}
                    onClick={() => setSubtab("results")}
                >
                    {matchesSubtabResults}
                </Button>
                <Button
                    customClass={classNames(
                        "subtab-btn",
                        subtab === "worldwide" && "active",
                    )}
                    onClick={() => setSubtab("worldwide")}
                >
                    {matchesSubtabWorldwide}
                </Button>
                <Button
                    customClass={classNames(
                        "subtab-btn",
                        subtab === "stats" && "active",
                    )}
                    onClick={() => setSubtab("stats")}
                >
                    {matchesSubtabStats}
                </Button>
            </Box>

            {subtab === "results" &&
                (loading ? (
                    <Card customClass="matches-stat-list">
                        {historySkeletonRows()}
                    </Card>
                ) : items.length === 0 ? (
                    <Box customClass="matches-empty">
                        <Text component="h3" customClass="matches-empty-title">
                            {matchesEmptyTitle}
                        </Text>
                        <Text customClass="matches-empty-desc">
                            {matchesEmptyDesc}
                        </Text>
                    </Box>
                ) : (
                    matchList(
                        items,
                        false,
                        currentUserId,
                        loadingMore,
                        loadMore,
                    )
                ))}

            {subtab === "worldwide" &&
                (loading ? (
                    <Card customClass="matches-stat-list">
                        {historySkeletonRows()}
                    </Card>
                ) : (
                    matchList(items, true, currentUserId, loadingMore, loadMore)
                ))}

            {subtab === "stats" && (
                <Box customClass="matches-stats">
                    <Box customClass="matches-stats-head">
                        <Text component="h3" customClass="matches-stats-title">
                            {matchesStatsTitle}
                        </Text>
                        <Text customClass="matches-stats-subtitle">
                            {matchesStatsSubtitle}
                        </Text>
                    </Box>
                    <Card customClass="matches-stat-list">
                        {statsLoading ? (
                            statsSkeletonRows()
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
                                            ? stats.bestStreak
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
