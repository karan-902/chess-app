import { useRef, useEffect, useState } from 'react'
import Box from '../base/Box/Box'
import type { Board } from '../../types'

interface IChessBoardProps {
  board: Board
  selectedSquare?: string | null
  legalMoves?: string[]
  attackedSquares?: string[]
  checkSquare?: string | null
  stalemateSquare?: string | null
  flashSquare?: string | null
  onSquareClick?: (square: string) => void
  lastMove?: { from: string; to: string } | null
  flipped?: boolean
}

const PIECE_SVG: Record<string, string> = {
  '♔': 'wK', '♕': 'wQ', '♖': 'wR', '♗': 'wB', '♘': 'wN', '♙': 'wP',
  '♚': 'bK', '♛': 'bQ', '♜': 'bR', '♝': 'bB', '♞': 'bN', '♟': 'bP',
}

const LIGHT_SQ = '#f0d9b5'
const DARK_SQ  = '#b58863'
const SELECTED_SQ = '#f0b90b'

const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1']
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const RANKS_FLIP = ['1', '2', '3', '4', '5', '6', '7', '8']
const FILES_FLIP = ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']

interface AnimPiece {
  svgFile: string
  fromX: number
  fromY: number
  toX: number
  toY: number
  pieceW: number
  pieceH: number
}

function squareToIndex(square: string, flipped?: boolean) {
  const col = FILES.indexOf(square[0])
  const row = RANKS.indexOf(square[1])
  return flipped ? { col: 7 - col, row: 7 - row } : { col, row }
}

function ChessBoard({ board, selectedSquare, legalMoves = [], attackedSquares = [], checkSquare, stalemateSquare, flashSquare, onSquareClick, lastMove, flipped }: IChessBoardProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [animPiece, setAnimPiece] = useState<AnimPiece | null>(null)
  const [animating, setAnimating] = useState(false)
  const prevLastMove = useRef<typeof lastMove>(null)

  const ranks = flipped ? RANKS_FLIP : RANKS
  const files = flipped ? FILES_FLIP : FILES

  useEffect(() => {
    if (!lastMove || lastMove === prevLastMove.current) return
    if (!gridRef.current) return

    prevLastMove.current = lastMove

    const grid = gridRef.current
    const rect = grid.getBoundingClientRect()
    const sqW = rect.width / 8
    const sqH = rect.height / 8

    const from = squareToIndex(lastMove.from, flipped)
    const to   = squareToIndex(lastMove.to, flipped)

    // find what piece is now at the 'to' square on the board
    const piece = board[to.row]?.[to.col]
    if (!piece) return

    const svgFile = PIECE_SVG[piece]
    if (!svgFile) return

    const pieceW = sqW * 0.9
    const pieceH = sqH * 0.9
    const offset = { x: sqW * 0.05, y: sqH * 0.05 }

    setAnimPiece({
      svgFile,
      fromX: from.col * sqW + offset.x,
      fromY: from.row * sqH + offset.y,
      toX:   to.col   * sqW + offset.x,
      toY:   to.row   * sqH + offset.y,
      pieceW,
      pieceH,
    })
    setAnimating(false)

    // tiny delay so browser registers start position before transitioning
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimating(true))
    })

    const timer = setTimeout(() => setAnimPiece(null), 320)
    return () => clearTimeout(timer)
  }, [lastMove])

  return (
    <Box customClass="chess-board">
      <Box ref={gridRef} customClass="chess-board-grid">
        {Array.from({ length: 8 }, (_, r) =>
          Array.from({ length: 8 }, (_, c) => {
            const piece = flipped ? board[7 - r][7 - c] : board[r][c]
            const isLight = (r + c) % 2 === 0
            const square = `${files[c]}${ranks[r]}`
            const isSelected = selectedSquare === square
            const isLegal = legalMoves.includes(square)
            const isCapture = isLegal && !!piece
            const isAttacked = attackedSquares.includes(square) && !!piece
            const isCheck     = checkSquare === square
            const isStalemate = stalemateSquare === square
            const isFlash     = flashSquare === square
            const bg = isSelected ? SELECTED_SQ : isLight ? LIGHT_SQ : DARK_SQ
            const svgFile = piece ? PIECE_SVG[piece] : null
            const isAnimTarget = animPiece && lastMove?.to === square

            const squareBg = isCheck
              ? 'radial-gradient(circle, #ff0000 0%, #a00000 100%)'
              : isStalemate
                ? 'radial-gradient(circle, #f0b90b 0%, #b87200 100%)'
                : bg

            return (
              <Box
                key={`${r}-${c}`}
                customClass={`chess-board-square${isFlash ? ' square-flash' : ''}`}
                style={{ backgroundColor: bg, background: squareBg, cursor: 'pointer' }}
                onClick={() => onSquareClick?.(square)}
              >
                {c === 0 && (
                  <span className={`sq-corner-label sq-rank ${isLight ? 'label-on-light' : 'label-on-dark'}`}>
                    {ranks[r]}
                  </span>
                )}
                {r === 7 && (
                  <span className={`sq-corner-label sq-file ${isLight ? 'label-on-light' : 'label-on-dark'}`}>
                    {files[c]}
                  </span>
                )}
                {isLegal && !isCapture && <span className="legal-dot" />}
                {isCapture && <span className="legal-capture-ring" />}
                {isAttacked && <span className="water-drop-ripple" />}
                {svgFile && !isAnimTarget && (
                  <img
                    src={`/pieces/${svgFile}.svg`}
                    alt={piece ?? ''}
                    className={`chess-piece-img${isAttacked ? ' piece-danger' : ''}${isCheck ? ' piece-in-check' : ''}${isStalemate ? ' piece-in-stalemate' : ''}`}
                    draggable={false}
                  />
                )}
              </Box>
            )
          })
        )}

        {/* Sliding overlay piece */}
        {animPiece && (
          <img
            src={`/pieces/${animPiece.svgFile}.svg`}
            alt="moving piece"
            draggable={false}
            style={{
              position: 'absolute',
              width: animPiece.pieceW,
              height: animPiece.pieceH,
              objectFit: 'contain',
              left: animating ? animPiece.toX : animPiece.fromX,
              top:  animating ? animPiece.toY  : animPiece.fromY,
              transition: animating ? 'left 0.28s ease, top 0.28s ease' : 'none',
              pointerEvents: 'none',
              zIndex: 50,
              filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))',
            }}
          />
        )}
      </Box>
    </Box>
  )
}

export default ChessBoard
