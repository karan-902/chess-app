import { useState } from "react";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import Button from "../../components/base/Button/Button";
import PoolCard from "./PoolCard";
import type { Pool, PoolCategory } from "@/types/types";

const FILTERS: { id: PoolCategory; label: string }[] = [
    { id: "all", label: "All" },
    { id: "bullet", label: "⚡ Bullet" },
    { id: "blitz", label: "🔥 Blitz" },
    { id: "rapid", label: "⏱ Rapid" },
    { id: "classical", label: "🏛 Classical" },
];

interface IPoolListProps {
    pools: Pool[];
    loading: boolean;
    selectedPool: number | null;
    onSelect: (id: number | null) => void;
}

function PoolList({ pools, loading, selectedPool, onSelect }: IPoolListProps) {
    const [category, setCategory] = useState<PoolCategory>("all");

    const filtered =
        category === "all"
            ? pools
            : pools.filter((p) => p.category === category);

    return (
        <>
            <Box customClass="section-header">
                <Text customClass="section-title">Stake Pools</Text>
                <Box customClass="live-indicator">
                    <Text as="span" customClass="live-dot" />
                    <Text font="mono" size={10} color="muted">
                        Live
                    </Text>
                </Box>
            </Box>

            <Box customClass="filter-row">
                {FILTERS.map((f) => (
                    <Button
                        key={f.id}
                        variant={category === f.id ? "primary" : "ghost"}
                        customClass="filter-chip-btn"
                        onClick={() => setCategory(f.id)}
                    >
                        {f.label}
                    </Button>
                ))}
            </Box>

            <Box customClass="pool-list">
                {loading ? (
                    Array.from({ length: 4 }, (_, i) => (
                        <Box key={i} customClass="pool-card pool-card--skeleton" />
                    ))
                ) : filtered.length === 0 ? (
                    <Box customClass="pool-empty">
                        <Text font="mono" size={13} color="muted" customClass="pool-empty-text">
                            {pools.length === 0
                                ? "No stake pools available right now"
                                : "No pools in this category"}
                        </Text>
                    </Box>
                ) : (
                    filtered.map((p) => (
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
