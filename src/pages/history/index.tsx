import { useState } from "react";
import { AnimatePresence } from "motion/react";
import clsx from "clsx";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import StatCard from "@/components/base/StatCard/StatCard";
import { useGameHistory } from "@/hooks/useGameHistory";
import { formateAmount } from "@/utils/formate";
import GameHistoryList from "./GameHistoryList";
import HistoryFilterSheet, {
    type ResultFilter,
    type TimeControlFilter,
} from "./HistoryFilterSheet";
import {
    historyEyebrow,
    historyTitle,
    historySubtitle,
    historyFilterTrigger,
    historyStatsWinRateLabel,
    historyStatsGamesLabel,
    historyStatsNetPLLabel,
} from "@/components/messages";

export default function GameHistory() {
    const { items, loading, loadingMore, hasMoreRef, loadMore, stats } =
        useGameHistory();
    const [filterOpen, setFilterOpen] = useState(false);
    const [result, setResult] = useState<ResultFilter>("all");
    const [timeControl, setTimeControl] = useState<TimeControlFilter>("all");

    const hasActiveFilters = result !== "all" || timeControl !== "all";

    return (
        <Box customClass="history-view">
            <Box customClass="lobby-heading">
                <Text as="p" customClass="lobby-eyebrow">
                    {historyEyebrow}
                </Text>
                <Box customClass="history-heading-row">
                    <Box>
                        <Text as="h1" customClass="lobby-heading-title">
                            {historyTitle}
                        </Text>
                        <Text as="p" customClass="lobby-heading-sub">
                            {historySubtitle}
                        </Text>
                    </Box>
                    <Button
                        variant="outline"
                        size="sm"
                        customClass={clsx(
                            "history-filter-trigger",
                            hasActiveFilters && "has-filters",
                        )}
                        onClick={() => setFilterOpen(true)}
                    >
                        {historyFilterTrigger}
                    </Button>
                </Box>
            </Box>

            {!loading && items.length > 0 && (
                <Box customClass="history-stats">
                    <StatCard
                        label={historyStatsWinRateLabel}
                        value={`${stats.winRate}%`}
                    />
                    <StatCard
                        label={historyStatsGamesLabel}
                        value={stats.games.toLocaleString()}
                    />
                    <StatCard
                        label={historyStatsNetPLLabel}
                        value={`${stats.netPL >= 0 ? "+" : "-"}${formateAmount(Math.abs(stats.netPL), "USD")}`}
                        valueColor={stats.netPL >= 0 ? "positive" : "negative"}
                    />
                </Box>
            )}

            <GameHistoryList
                items={items}
                loading={loading}
                loadingMore={loadingMore}
                hasMore={hasMoreRef.current}
                onLoadMore={loadMore}
                result={result}
                timeControl={timeControl}
            />

            <AnimatePresence>
                {filterOpen && (
                    <HistoryFilterSheet
                        key="history-filter-sheet"
                        result={result}
                        onResultChange={setResult}
                        timeControl={timeControl}
                        onTimeControlChange={setTimeControl}
                        onClose={() => setFilterOpen(false)}
                    />
                )}
            </AnimatePresence>
        </Box>
    );
}
