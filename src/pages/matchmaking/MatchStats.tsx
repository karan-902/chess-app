import { Globe, Activity, Users } from 'lucide-react'
import Box from '../../components/base/Box/Box'
import StatCard from '../../components/base/StatCard/StatCard'

interface IMatchStatsProps {
    online: number;
    games: number;
    liquidity: string;
}

function MatchStats({ online, games, liquidity }: IMatchStatsProps) {
    return (
        <Box customClass="grid-3">
            <StatCard label="Liquidity" value={liquidity} icon={<Globe size={12} />} />
            <StatCard label="Games" value={games > 0 ? games.toLocaleString() : "—"} icon={<Activity size={12} />} />
            <StatCard label="Online" value={online > 0 ? online.toLocaleString() : "—"} icon={<Users size={12} />} />
        </Box>
    )
}

export default MatchStats
