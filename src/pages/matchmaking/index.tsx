import { useState } from "react";
import clsx from "clsx";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import MatchStats from "./MatchStats";
import PoolList from "./PoolList";
import MatchmakingCTA from "./MatchmakingCTA";
import SearchingScreen from "./SearchingScreen";
import { useMatchmaking } from "../../hooks/useMatchmaking";
import { usePools } from "../../hooks/usePools";
import { useSocket } from "../../context/SocketContext";
import {
    matchmakingEyebrow,
    matchmakingTitle,
    matchmakingSubtitle,
    matchmakingRailSectionTitle,
    matchmakingRailEmptyText,
} from "@/components/messages";
import type { PoolCategory } from "@/types/types";

export default function Matchmaking() {
    const [selectedPool, setSelectedPool] = useState<string | null>(null);
    const [category, setCategory] = useState<PoolCategory>("all");
    const { status, queuedPool, joinQueue, leaveQueue } = useMatchmaking();
    const { pools, stats, loading } = usePools(category);
    const { userCounts } = useSocket();

    const handleCategoryChange = (next: PoolCategory) => {
        setCategory(next);
        setSelectedPool(null);
    };

    const pool = pools.find((p) => p.id === selectedPool) ?? null;
    const isSearching = status === "queued" || status === "found";

    return (
        <Box
            customClass={clsx(
                "matchmaking-page",
                isSearching && "matchmaking-page--searching",
            )}
        >
            <Box customClass="lobby-heading">
                <Text as="p" customClass="lobby-eyebrow">
                    {matchmakingEyebrow}
                </Text>
                <Text as="h1" customClass="lobby-heading-title">
                    {matchmakingTitle}
                </Text>
                <Text as="p" customClass="lobby-heading-sub">
                    {matchmakingSubtitle}
                </Text>
            </Box>

            <Box customClass="matchmaking-dashboard-grid">
                <Box customClass="matchmaking-main-col">
                    <Box customClass="lobby-section">
                        <MatchStats online={userCounts.active} stats={stats} />
                    </Box>
                    <Box customClass="lobby-section">
                        <PoolList
                            pools={pools}
                            loading={loading}
                            selectedPool={selectedPool}
                            onSelect={setSelectedPool}
                            category={category}
                            onCategoryChange={handleCategoryChange}
                        />
                    </Box>
                </Box>

                <Box customClass="matchmaking-rail-col">
                    <Text
                        as="span"
                        customClass="section-title matchmaking-rail-title"
                    >
                        {matchmakingRailSectionTitle}
                    </Text>

                    {isSearching && queuedPool ? (
                        <SearchingScreen
                            pool={queuedPool}
                            status={status}
                            onCancel={leaveQueue}
                        />
                    ) : pool ? (
                        <MatchmakingCTA
                            pool={pool}
                            onJoin={() => joinQueue(pool)}
                            onClose={() => setSelectedPool(null)}
                        />
                    ) : (
                        <Box customClass="matchmaking-rail-empty hud-frame">
                            <Text
                                as="p"
                                font="mono"
                                size={12}
                                color="muted"
                                customClass="matchmaking-rail-empty-text"
                            >
                                {matchmakingRailEmptyText}
                            </Text>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
