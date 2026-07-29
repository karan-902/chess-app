import { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react'
import Box from '../../components/base/Box/Box'
import Card from '../../components/base/Card/Card'
import Text from '../../components/base/Text/Text'
import Button from '../../components/base/Button/Button'
import type { MoveRecord } from '../../types'
import { playMoveHistoryReviewing, playMoveHistoryNoMovesYet } from '@/components/messages'


interface IMoveHistoryProps {
  moves: MoveRecord[]
  fenHistory: string[]
  viewIndex: number | null
  onGoBack: () => void
  onGoForward: () => void
  onJumpTo: (fenIdx: number) => void
}

function MoveHistory({ moves, fenHistory, viewIndex, onGoBack, onGoForward, onJumpTo }: IMoveHistoryProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const isReviewing = viewIndex !== null && viewIndex < fenHistory.length - 1
  const atStart = (viewIndex ?? fenHistory.length - 1) === 0

  // fenIdx for a cell: white move at record i → i*2+1, black → i*2+2
  const activeFenIdx = viewIndex ?? fenHistory.length - 1

  const isWhiteActive = (i: number) => activeFenIdx === i * 2 + 1
  const isBlackActive = (i: number) => activeFenIdx === i * 2 + 2

  // Auto-scroll active move into view
  useEffect(() => {
    const el = listRef.current?.querySelector('.move-cell--active')
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [viewIndex])

  return (
    <Card customClass="history-panel">
      {/* Nav bar */}
      <Box customClass="history-nav">
        <Button variant="outline" customClass="history-nav-btn" onClick={onGoBack} disabled={atStart}>
          <ChevronLeft size={14} />
        </Button>
        <Button variant="outline" customClass="history-nav-btn" onClick={onGoForward} disabled={!isReviewing}>
          <ChevronRight size={14} />
        </Button>
        <Button variant="outline" customClass="history-nav-btn history-nav-btn--live" onClick={() => onJumpTo(fenHistory.length)} disabled={!isReviewing}>
          <ChevronsRight size={14} />
        </Button>
        {isReviewing && (
          <Text as="span" customClass="history-reviewing-label">{playMoveHistoryReviewing}</Text>
        )}
      </Box>

      {/* Move list */}
      <Box customClass="history-list" ref={listRef}>
        {moves.length === 0 ? (
          <Text font="mono" size={11} color="muted" customClass="history-empty">{playMoveHistoryNoMovesYet}</Text>
        ) : (
          moves.map(({ n, w, b }, i) => (
            <Box key={n} customClass="move-row">
              <Text font="mono" size={12} color="muted" customClass="move-num">{n}.</Text>
              <Button
                variant="ghost"
                customClass={`move-cell${isWhiteActive(i) ? ' move-cell--active' : ''}`}
                onClick={() => onJumpTo(i * 2 + 1)}
              >
                {w}
              </Button>
              {b && (
                <Button
                  variant="ghost"
                  customClass={`move-cell${isBlackActive(i) ? ' move-cell--active' : ''}`}
                  onClick={() => onJumpTo(i * 2 + 2)}
                >
                  {b}
                </Button>
              )}
            </Box>
          ))
        )}
      </Box>
    </Card>
  )
}

export default MoveHistory
