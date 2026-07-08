import { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react'
import Box from '../../components/base/Box/Box'
import Card from '../../components/base/Card/Card'
import Text from '../../components/base/Text/Text'
import type { MoveRecord } from '../../types'

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
        <button className="history-nav-btn" onClick={onGoBack} disabled={atStart}>
          <ChevronLeft size={14} />
        </button>
        <button className="history-nav-btn" onClick={onGoForward} disabled={!isReviewing}>
          <ChevronRight size={14} />
        </button>
        <button className="history-nav-btn history-nav-btn--live" onClick={() => onJumpTo(fenHistory.length)} disabled={!isReviewing}>
          <ChevronsRight size={14} />
        </button>
        {isReviewing && (
          <Text as="span" customClass="history-reviewing-label">Reviewing</Text>
        )}
      </Box>

      {/* Move list */}
      <Box customClass="history-list" ref={listRef}>
        {moves.length === 0 ? (
          <Text font="mono" size={11} color="muted" customClass="history-empty">No moves yet</Text>
        ) : (
          moves.map(({ n, w, b }, i) => (
            <Box key={n} customClass="move-row">
              <Text font="mono" size={12} color="muted" customClass="move-num">{n}.</Text>
              <button
                className={`move-cell${isWhiteActive(i) ? ' move-cell--active' : ''}`}
                onClick={() => onJumpTo(i * 2 + 1)}
              >
                {w}
              </button>
              {b && (
                <button
                  className={`move-cell${isBlackActive(i) ? ' move-cell--active' : ''}`}
                  onClick={() => onJumpTo(i * 2 + 2)}
                >
                  {b}
                </button>
              )}
            </Box>
          ))
        )}
      </Box>
    </Card>
  )
}

export default MoveHistory
