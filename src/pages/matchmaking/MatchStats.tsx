import { Globe, Activity, Users } from 'lucide-react'
import Box from '../../components/base/Box/Box'
import StatCard from '../../components/base/StatCard/StatCard'
import { formatAmount } from '@/constants/currencies'
import { useCurrency } from '@/context/CurrencyContext'
import type { IPoolStats } from '@/types/types'

interface IMatchStatsProps {
    online: number;
    stats:  IPoolStats;
}

function MatchStats({ online, stats }: IMatchStatsProps) {
    const { currency } = useCurrency();
    const liquidity = stats.liquidity > 0 ? formatAmount(stats.liquidity, currency) : "—";
    const games     = stats.games > 0 ? stats.games.toLocaleString() : "—";

    return (
        <Box customClass="grid-3">
            <StatCard label="Liquidity" value={liquidity} icon={<Globe size={12} />} />
            <StatCard label="Games"     value={games}     icon={<Activity size={12} />} />
            <StatCard label="Online"    value={online > 0 ? online.toLocaleString() : "—"} icon={<Users size={12} />} />
        </Box>
    )
}

export default MatchStats
