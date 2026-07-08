import clsx from 'clsx'
import * as RadixHoverCard from '@radix-ui/react-hover-card'
import './hover-card.scss'

interface IHoverCardProps {
  children: React.ReactNode
  openDelay?: number
  closeDelay?: number
}

interface IHoverCardTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

interface IHoverCardContentProps {
  children: React.ReactNode
  customClass?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
}

export function HoverCard({ children, openDelay = 200, closeDelay = 100 }: IHoverCardProps) {
  return (
    <RadixHoverCard.Root openDelay={openDelay} closeDelay={closeDelay}>
      {children}
    </RadixHoverCard.Root>
  )
}

export function HoverCardTrigger({ children, asChild = true }: IHoverCardTriggerProps) {
  return <RadixHoverCard.Trigger asChild={asChild}>{children}</RadixHoverCard.Trigger>
}

export function HoverCardContent({ children, customClass, side = 'bottom', sideOffset = 6 }: IHoverCardContentProps) {
  return (
    <RadixHoverCard.Portal>
      <RadixHoverCard.Content
        className={clsx('hover-card-content', customClass)}
        side={side}
        sideOffset={sideOffset}
      >
        {children}
        <RadixHoverCard.Arrow className="hover-card-arrow" />
      </RadixHoverCard.Content>
    </RadixHoverCard.Portal>
  )
}
