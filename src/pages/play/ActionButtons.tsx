import Box from '../../components/base/Box/Box'
import Button from '../../components/base/Button/Button'

interface IActionButtonsProps {
  onNewGame: () => void
  onResign?: () => void
  onDraw?: () => void
  disabled?: boolean
}

function ActionButtons({ onNewGame, onResign, onDraw, disabled }: IActionButtonsProps) {
  return (
    <Box customClass="play-actions">
      <Button variant="ghost"   size="md" fullWidth onClick={onDraw}    disabled={disabled}>Draw</Button>
      <Button variant="danger"  size="md" fullWidth onClick={onResign}  disabled={disabled}>Resign</Button>
      <Button variant="primary" size="md" fullWidth onClick={onNewGame}>New Game</Button>
    </Box>
  )
}

export default ActionButtons
