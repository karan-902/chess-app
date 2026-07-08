import { Activity } from 'lucide-react'
import Card from '../../components/base/Card/Card'
import Box from '../../components/base/Box/Box'
import Text from '../../components/base/Text/Text'
import { ENGINE_LINES } from '../../constants/gameData'

function EnginePanel() {
  const line = ENGINE_LINES[0]
  return (
    <Card customClass="engine-row">
      <Activity size={13} className="engine-icon" />
      <Box customClass="engine-meta">
        <Box customClass="engine-top-row">
          <Text font="mono" size={14} weight={700} color="primary">{line.move}</Text>
          <Text font="mono" size={11} color="muted" customClass="engine-line">{line.continuation}</Text>
        </Box>
        <Text font="mono" size={10} color="muted">Stockfish 16 · Depth 28 · {line.score}</Text>
      </Box>
    </Card>
  )
}

export default EnginePanel
