import { useState } from "react";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import MatchStats from "./MatchStats";
import PoolList from "./PoolList";
import MatchmakingCTA from "./MatchmakingCTA";
import SearchingScreen from "./SearchingScreen";
import { useMatchmaking } from "../../hooks/useMatchmaking";
import { usePools } from "../../hooks/usePools";
import { useSocket } from "../../context/SocketContext";

export default function Matchmaking() {
    const [selectedPool, setSelectedPool] = useState<number | null>(null);
    const { status, queuedPool, joinQueue, leaveQueue } = useMatchmaking();
    const { pools, loading, games, liquidity } = usePools();
    const { userCounts } = useSocket();

    const pool = pools.find(p => p.id === selectedPool);
    const isSearching = status === "queued" || status === "found";

    return (
        <Box customClass="matchmaking-view">
            <Box customClass="lobby-heading">
                <Text as="h1" customClass="lobby-heading-title">Find a Match</Text>
                <Text as="p" customClass="lobby-heading-sub">Choose a stake pool and enter the arena</Text>
            </Box>

            {isSearching && queuedPool ? (
                <SearchingScreen
                    pool={queuedPool}
                    status={status}
                    onCancel={leaveQueue}
                />
            ) : (
                <>
                    <MatchStats
                        online={userCounts.active}
                        games={games}
                        liquidity={liquidity}
                    />
                    <PoolList
                        pools={pools}
                        loading={loading}
                        selectedPool={selectedPool}
                        onSelect={setSelectedPool}
                    />
                    {pool && (
                        <MatchmakingCTA
                            pool={pool}
                            onJoin={() => joinQueue(pool)}
                            onClose={() => setSelectedPool(null)}
                        />
                    )}
                </>
            )}
        </Box>
    );
}
