import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import Button from "../../components/base/Button/Button";
import PoolCard from "./PoolCard";
import PoolCardSkeleton from "./PoolCardSkeleton";
import { matchmakingFilterAll, matchmakingFilterBullet, matchmakingFilterBlitz, matchmakingFilterRapid, matchmakingFilterClassical, matchmakingPoolListSectionTitle, matchmakingPoolListLive, matchmakingPoolListEmptyAll, matchmakingPoolListEmptyCategory } from "@/components/messages";
import type { Pool, PoolCategory } from "@/types/types";

const SKELETON_COUNT = 6;

const FILTERS: { id: PoolCategory; label: string }[] = [
    { id: "all", label: matchmakingFilterAll },
    { id: "bullet", label: matchmakingFilterBullet },
    { id: "blitz", label: matchmakingFilterBlitz },
    { id: "rapid", label: matchmakingFilterRapid },
    { id: "classical", label: matchmakingFilterClassical },
];

interface IPoolListProps {
    pools: Pool[];
    loading: boolean;
    selectedPool: string | null;
    onSelect: (id: string | null) => void;
    category: PoolCategory;
    onCategoryChange: (category: PoolCategory) => void;
}

function PoolList({ pools, loading, selectedPool, onSelect, category, onCategoryChange }: IPoolListProps) {
    return (
        <>
            <Box customClass="section-header">
                <Text customClass="section-title">{matchmakingPoolListSectionTitle}</Text>
                <Box customClass="live-indicator">
                    <Text as="span" customClass="live-dot" />
                    <Text font="mono" size={10} color="muted">
                        {matchmakingPoolListLive}
                    </Text>
                </Box>
            </Box>

            <Box customClass="filter-row">
                {FILTERS.map((f) => (
                    <Button
                        key={f.id}
                        variant={category === f.id ? "primary" : "ghost"}
                        customClass="filter-chip-btn"
                        onClick={() => onCategoryChange(f.id)}
                    >
                        {f.label}
                    </Button>
                ))}
            </Box>

            <Box customClass="pool-list">
                {loading ? (
                    Array.from({ length: SKELETON_COUNT }, (_, i) => (
                        <PoolCardSkeleton key={i} />
                    ))
                ) : pools.length === 0 ? (
                    <Box customClass="pool-empty">
                        <Text font="mono" size={13} color="muted" customClass="pool-empty-text">
                            {category === "all"
                                ? matchmakingPoolListEmptyAll
                                : matchmakingPoolListEmptyCategory}
                        </Text>
                    </Box>
                ) : (
                    pools.map((p) => (
                        <PoolCard
                            key={p.id}
                            pool={p}
                            selected={selectedPool === p.id}
                            onSelect={() =>
                                onSelect(selectedPool === p.id ? null : p.id)
                            }
                        />
                    ))
                )}
            </Box>
        </>
    );
}

export default PoolList;
