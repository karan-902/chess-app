import { Activity, Users } from "lucide-react";
import Box from "../../components/base/Box/Box";
import StatCard from "../../components/base/StatCard/StatCard";
import {
    matchmakingStatsGames,
    matchmakingStatsOnline,
} from "@/components/messages";
import type { IPoolStats } from "@/types/types";

interface IMatchStatsProps {
    online: number;
    stats: IPoolStats;
}

function MatchStats({ online, stats }: IMatchStatsProps) {
    const games = stats.games > 0 ? stats.games.toLocaleString() : "—";

    return (
        <Box customClass="grid-2">
            <StatCard
                customClass="hud-frame"
                label={matchmakingStatsGames}
                value={games}
                icon={<Activity size={12} />}
            />
            <StatCard
                customClass="hud-frame"
                label={matchmakingStatsOnline}
                value={online > 0 ? online.toLocaleString() : "—"}
                icon={<Users size={12} />}
            />
        </Box>
    );
}

export default MatchStats;
