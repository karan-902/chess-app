import clsx from 'clsx'
import * as RadixTabs from '@radix-ui/react-tabs'
import './tabs.scss'

interface ITabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  customClass?: string
}

interface ITabsListProps {
  children: React.ReactNode
  customClass?: string
}

interface ITabsTriggerProps {
  value: string
  children: React.ReactNode
  customClass?: string
  disabled?: boolean
}

interface ITabsContentProps {
  value: string
  children: React.ReactNode
  customClass?: string
}

export function Tabs({ defaultValue, value, onValueChange, children, customClass }: ITabsProps) {
  return (
    <RadixTabs.Root
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      className={clsx('tabs-root', customClass)}
    >
      {children}
    </RadixTabs.Root>
  )
}

export function TabsList({ children, customClass }: ITabsListProps) {
  return <RadixTabs.List className={clsx('tabs-list', customClass)}>{children}</RadixTabs.List>
}

export function TabsTrigger({ value, children, customClass, disabled }: ITabsTriggerProps) {
  return (
    <RadixTabs.Trigger
      value={value}
      className={clsx('tabs-trigger', customClass)}
      disabled={disabled}
    >
      {children}
    </RadixTabs.Trigger>
  )
}

export function TabsContent({ value, children, customClass }: ITabsContentProps) {
  return (
    <RadixTabs.Content value={value} className={clsx('tabs-content', customClass)}>
      {children}
    </RadixTabs.Content>
  )
}
