import { useEffect, useMemo, useRef, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { ClipboardList } from "lucide-react";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Loader from "@/components/base/Loader/Loader";
import GameHistoryItem from "./GameHistoryItem";
import GameHistoryItemSkeleton from "./GameHistoryItemSkeleton";
import { historyEmptyText, historyFilterEmptyText } from "@/components/messages";
import { secondsToTimeControl } from "@/types/components";
import type { ResultFilter, TimeControlFilter } from "./HistoryFilterSheet";
import type { IGameHistoryItem } from "@/types/types";

const SKELETON_ROW_COUNT = 12;

interface IGameHistoryListProps {
    items: IGameHistoryItem[];
    loading?: boolean;
    loadingMore?: boolean;
    hasMore?: boolean;
    onLoadMore?: () => void;
    result?: ResultFilter;
    timeControl?: TimeControlFilter;
}

export default function GameHistoryList({
    items,
    loading,
    loadingMore,
    hasMore,
    onLoadMore,
    result = "all",
    timeControl = "all",
}: IGameHistoryListProps) {
    const [scrollParent, setScrollParent] = useState<HTMLElement | null>(null);

    const loadingMoreRef = useRef(loadingMore);
    loadingMoreRef.current = loadingMore;
    const hasMoreRef = useRef(hasMore);
    hasMoreRef.current = hasMore;
    const onLoadMoreRef = useRef(onLoadMore);
    onLoadMoreRef.current = onLoadMore;

    useEffect(() => {
        const el = document.querySelector<HTMLElement>(".app-content");
        if (el) setScrollParent(el);
    }, []);

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            if (result !== "all" && item.result !== result) return false;
            if (
                timeControl !== "all" &&
                secondsToTimeControl(item.time_seconds) !== timeControl
            )
                return false;
            return true;
        });
    }, [items, result, timeControl]);

    const components = useMemo(
        () => ({
            Footer: () =>
                loadingMoreRef.current ? (
                    <Box customClass="history-loading-more">
                        <Loader size={18} color="#f7931a" />
                    </Box>
                ) : null,
        }),
        [],
    );

    if (loading) {
        return (
            <Box customClass="game-history-list">
                {Array.from({ length: SKELETON_ROW_COUNT }, (_, i) => (
                    <GameHistoryItemSkeleton key={i} />
                ))}
            </Box>
        );
    }

    if (items.length === 0) {
        return (
            <Box customClass="history-empty">
                <ClipboardList size={40} strokeWidth={1.2} className="history-empty-icon" />
                <Text as="p" customClass="history-empty-text">{historyEmptyText}</Text>
            </Box>
        );
    }

    if (filteredItems.length === 0) {
        return (
            <Box customClass="history-empty">
                <ClipboardList size={40} strokeWidth={1.2} className="history-empty-icon" />
                <Text as="p" customClass="history-empty-text">{historyFilterEmptyText}</Text>
            </Box>
        );
    }

    return (
        <Box customClass="game-history-list">
            {scrollParent && (
                <Virtuoso
                    customScrollParent={scrollParent}
                    data={filteredItems}
                    computeItemKey={(_, item) => item.game_id}
                    itemContent={(_, item) => <GameHistoryItem game={item} />}
                    components={components}
                    endReached={() => {
                        if (
                            result === "all" &&
                            timeControl === "all" &&
                            hasMoreRef.current &&
                            !loadingMoreRef.current
                        ) {
                            onLoadMoreRef.current?.();
                        }
                    }}
                    overscan={400}
                />
            )}
        </Box>
    );
}
