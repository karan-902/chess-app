import clsx from 'clsx'
import * as RadixCollapsible from '@radix-ui/react-collapsible'
import './collapsible.scss'

interface ICollapsibleProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  children: React.ReactNode
  customClass?: string
}

interface ICollapsibleTriggerProps {
  children: React.ReactNode
  asChild?: boolean
  customClass?: string
}

interface ICollapsibleContentProps {
  children: React.ReactNode
  customClass?: string
}

export function Collapsible({ open, onOpenChange, defaultOpen, children, customClass }: ICollapsibleProps) {
  return (
    <RadixCollapsible.Root
      open={open}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
      className={clsx('collapsible-root', customClass)}
    >
      {children}
    </RadixCollapsible.Root>
  )
}

export function CollapsibleTrigger({ children, asChild = true, customClass }: ICollapsibleTriggerProps) {
  return (
    <RadixCollapsible.Trigger asChild={asChild} className={clsx(!asChild && 'collapsible-trigger', customClass)}>
      {children}
    </RadixCollapsible.Trigger>
  )
}

export function CollapsibleContent({ children, customClass }: ICollapsibleContentProps) {
  return (
    <RadixCollapsible.Content className={clsx('collapsible-content', customClass)}>
      {children}
    </RadixCollapsible.Content>
  )
}
