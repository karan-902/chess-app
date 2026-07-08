import clsx from 'clsx'
import * as RadixPopover from '@radix-ui/react-popover'
import './popover.scss'

interface IPopoverProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

interface IPopoverTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

interface IPopoverContentProps {
  children: React.ReactNode
  customClass?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
}

export function Popover({ open, onOpenChange, children }: IPopoverProps) {
  return (
    <RadixPopover.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </RadixPopover.Root>
  )
}

export function PopoverTrigger({ children, asChild = true }: IPopoverTriggerProps) {
  return <RadixPopover.Trigger asChild={asChild}>{children}</RadixPopover.Trigger>
}

export function PopoverContent({ children, customClass, side = 'bottom', align = 'center', sideOffset = 6 }: IPopoverContentProps) {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        className={clsx('popover-content', customClass)}
        side={side}
        align={align}
        sideOffset={sideOffset}
      >
        {children}
        <RadixPopover.Arrow className="popover-arrow" />
      </RadixPopover.Content>
    </RadixPopover.Portal>
  )
}

export function PopoverClose({ children, asChild = true }: { children: React.ReactNode; asChild?: boolean }) {
  return <RadixPopover.Close asChild={asChild}>{children}</RadixPopover.Close>
}
