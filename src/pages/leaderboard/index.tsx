import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import PodiumGrid from "./PodiumGrid";
import LeaderboardTable from "./LeaderboardTable";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useReduxSelector } from "@/store/hooks";
import { leaderboardEyebrow, leaderboardTitle, leaderboardSubtitle, leaderboardLoadError, leaderboardEmpty } from "@/components/messages";

export default function Leaderboard() {
    const { players, loading, error } = useLeaderboard();
    const currentUserId = useReduxSelector((state) => state.auth.session?.id);

    return (
        <Box customClass="leaderboard-view">
            <Box customClass="lobby-heading">
                <Text as="p" customClass="lobby-eyebrow">
                    {leaderboardEyebrow}
                </Text>
                <Text as="h1" customClass="lobby-heading-title">
                    {leaderboardTitle}
                </Text>
                <Text as="p" customClass="lobby-heading-sub">
                    {leaderboardSubtitle}
                </Text>
            </Box>
            {!loading && players.length === 0 ? (
                <Box customClass="leaderboard-state">
                    <Text as="p" color="muted">
                        {error ? leaderboardLoadError : leaderboardEmpty}
                    </Text>
                </Box>
            ) : (
                <Box customClass="lobby-section">
                    <PodiumGrid players={players} loading={loading} />
                    <LeaderboardTable
                        players={players}
                        currentUserId={currentUserId}
                        loading={loading}
                    />
                </Box>
            )}
        </Box>
    );
}
