import { Zap } from 'lucide-react'
import clsx from 'clsx'
import Card from '../../components/base/Card/Card'
import Box from '../../components/base/Box/Box'
import Text from '../../components/base/Text/Text'
import { LEADERS } from '../../constants/gameData'

const RANK_SYMBOL: Record<number, string> = { 1: '♔', 2: '♕', 3: '♖' }

function LeaderboardTable() {
  return (
    <Card customClass="leaderboard-table">
      <Box customClass="leaderboard-header">
        <Text font="mono" size={10} color="muted" uppercase customClass="col-rank">#</Text>
        <Text font="mono" size={10} color="muted" uppercase customClass="col-player">Player</Text>
        <Text font="mono" size={10} color="muted" uppercase customClass="col-rating">Rating</Text>
        <Text font="mono" size={10} color="muted" uppercase customClass="col-earnings">Earnings</Text>
      </Box>
      {LEADERS.map((leader) => (
        <Box key={leader.rank} customClass={clsx('leaderboard-row', leader.isYou && 'you')}>
          <Text as="span" customClass={clsx('col-rank', leader.rank <= 3 ? 'rank-symbol' : 'rank-number')}>
            {leader.rank <= 3 ? RANK_SYMBOL[leader.rank] : leader.rank}
          </Text>
          <Box customClass="col-player player-cell">
            <Text as="span" size={16}>{leader.flag}</Text>
            <Box customClass="player-details">
              <Text font="inter" size={14} color="white" truncate customClass={clsx('player-name', leader.isYou && 'you')}>
                {leader.name}
                {leader.isYou && <Text font="mono" size={10} color="muted"> (you)</Text>}
              </Text>
              {leader.streak > 0 && (
                <Box customClass="player-streak">
                  <Zap size={9} />
                  <Text font="mono" size={10} color="primary">{leader.streak}W streak</Text>
                </Box>
              )}
            </Box>
          </Box>
          <Text font="mono" size={14} color="white" customClass="col-rating">{leader.rating}</Text>
          <Text font="mono" size={14} weight={700} color="accent" customClass="col-earnings earnings-value">{leader.earnings}</Text>
        </Box>
      ))}
    </Card>
  )
}

export default LeaderboardTable
