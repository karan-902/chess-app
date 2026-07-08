import { useState } from 'react'
import { cn } from '@/lib/utils'
import './card.scss'

interface ICardProps {
  children: React.ReactNode
  className?: string
  customClass?: string
  onClick?: () => void
  width?: string | number
  height?: string | number
  minHeight?: string | number
  spotlight?: boolean
}

function Card({ children, className, customClass, onClick, width, height, minHeight, spotlight }: ICardProps) {
  const inlineStyle: React.CSSProperties = {}
  if (width !== undefined) inlineStyle.width = typeof width === 'number' ? `${width}px` : width
  if (height !== undefined) inlineStyle.height = typeof height === 'number' ? `${height}px` : height
  if (minHeight !== undefined) inlineStyle.minHeight = typeof minHeight === 'number' ? `${minHeight}px` : minHeight

  const [mouse, setMouse] = useState({ x: 0, y: 0, visible: false })
  const hasSpotlight = spotlight ?? !!onClick

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasSpotlight) return
    const rect = e.currentTarget.getBoundingClientRect()
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true })
  }

  const handleMouseLeave = () => {
    if (!hasSpotlight) return
    setMouse((m) => ({ ...m, visible: false }))
  }

  return (
    <div
      className={cn('card', onClick && 'clickable', customClass, className)}
      onClick={onClick}
      style={Object.keys(inlineStyle).length ? inlineStyle : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {/* ── Aceternity CardSpotlight overlay ──────────────────────────── */}
      {hasSpotlight && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-200"
          style={{
            opacity: mouse.visible ? 1 : 0,
            background: `radial-gradient(350px circle at ${mouse.x}px ${mouse.y}px, rgba(240,185,11,0.09), transparent 65%)`,
          }}
          aria-hidden
        />
      )}
    </div>
  )
}

export default Card
