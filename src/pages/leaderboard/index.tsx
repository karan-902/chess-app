import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import PodiumGrid from "./PodiumGrid";
import LeaderboardTable from "./LeaderboardTable";

export default function Leaderboard() {
    return (
        <Box customClass="leaderboard-view">
            <Box customClass="lobby-heading">
                <Text as="h1" customClass="lobby-heading-title">Leaderboard</Text>
                <Text as="p" customClass="lobby-heading-sub">Top players ranked by earnings</Text>
            </Box>
            <PodiumGrid />
            <LeaderboardTable />
        </Box>
    );
}
