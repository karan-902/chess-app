import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Virtuoso } from "react-virtuoso";
import Box from "@/components/base/Box/Box";

interface IVirtualListProps<T> {
    data: T[];
    itemKey: (item: T) => string;
    renderItem: (item: T) => ReactNode;
    renderSkeleton: () => ReactNode;
    loading?: boolean;
    loadingMore?: boolean;
    hasMore?: boolean;
    loadMore?: () => void;
    skeletonCount?: number;
    empty?: ReactNode;
    customClass?: string;
}

export default function VirtualList<T>({
    data,
    itemKey,
    renderItem,
    renderSkeleton,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    skeletonCount = 8,
    empty,
    customClass,
}: IVirtualListProps<T>) {
    const rootRef = useRef<HTMLDivElement>(null);
    const [scrollParent, setScrollParent] = useState<HTMLElement>();

    useLayoutEffect(() => {
        const parent = rootRef.current?.closest(".app-content");
        if (parent) setScrollParent(parent as HTMLElement);
    }, []);

    if (loading) {
        return (
            <Box ref={rootRef} customClass={customClass}>
                {Array.from({ length: skeletonCount }, (_, i) => (
                    <Box key={i}>{renderSkeleton()}</Box>
                ))}
            </Box>
        );
    }

    if (data.length === 0) {
        return (
            <Box ref={rootRef} customClass={customClass}>
                {empty}
            </Box>
        );
    }

    return (
        <Box ref={rootRef} customClass={customClass}>
            <Virtuoso
                customScrollParent={scrollParent}
                data={data}
                computeItemKey={(_, item) => itemKey(item)}
                itemContent={(_, item) => renderItem(item)}
                endReached={() => hasMore && loadMore?.()}
                components={
                    loadingMore ? { Footer: renderSkeleton } : undefined
                }
            />
        </Box>
    );
}