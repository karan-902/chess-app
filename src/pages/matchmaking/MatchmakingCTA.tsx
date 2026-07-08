import Box from '../../components/base/Box/Box'
import Card from '../../components/base/Card/Card'
import Button from '../../components/base/Button/Button'
import Text from '../../components/base/Text/Text'
import type { Pool } from '../../types/types'

interface IMatchmakingCTAProps {
    pool: Pool
    onJoin: () => void
    onClose: () => void
}

export default function MatchmakingCTA({ pool, onJoin, onClose }: IMatchmakingCTAProps) {
    return (
        <Box customClass="cta-sticky">
            <Card customClass="matchmaking-cta">
                <Box customClass="cta-header">
                    <div>
                        <Text font="rajdhani" size={16} weight={700} color="primary" customClass="cta-stake">
                            Wager {pool.stake}
                        </Text>
                        <Text font="mono" size={11} color="muted" customClass="cta-fee">
                            Win {pool.prize} · 5% platform fee
                        </Text>
                    </div>
                    <Button customClass="cta-close" onClick={onClose}>✕</Button>
                </Box>
                <Button variant="primary" size="lg" fullWidth onClick={onJoin}>
                    FIND OPPONENT
                </Button>
            </Card>
        </Box>
    )
}
