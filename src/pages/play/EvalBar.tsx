import Box from '../../components/base/Box/Box'

interface IEvalBarProps {
  evalPct?: number
}

function EvalBar({ evalPct = 50 }: IEvalBarProps) {
  return (
    <Box customClass="eval-bar">
      <Box customClass="eval-dark" style={{ flex: 100 - evalPct }} />
      <Box customClass="eval-light" style={{ flex: evalPct }} />
    </Box>
  )
}

export default EvalBar
