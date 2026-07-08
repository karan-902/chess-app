import clsx from 'clsx'
import Box from '../../components/base/Box/Box'
import Card from '../../components/base/Card/Card'
import Text from '../../components/base/Text/Text'
import { LEADERS } from '../../constants/gameData'

const RANK_SYMBOL: Record<number, string> = { 1: '♔', 2: '♕', 3: '♖' }

function PodiumGrid() {
  return (
    <Box customClass="podium-grid">
      {LEADERS.slice(0, 3).map((leader, i) => (
        <Card key={leader.rank} customClass={clsx('podium-card', i === 0 && 'first')}>
          <Text as="span" size={24}>{RANK_SYMBOL[leader.rank]}</Text>
          <Text as="span" size={18}>{leader.flag}</Text>
          <Text font="inter" size={12} weight={600} color="white" truncate customClass="podium-name">{leader.name}</Text>
          <Text font="mono" size={10} weight={700} color="primary">{leader.earnings}</Text>
          <Text font="mono" size={10} color="muted">{leader.rating}</Text>
        </Card>
      ))}
    </Box>
  )
}

export default PodiumGrid
