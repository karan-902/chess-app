import clsx from 'clsx'
import * as RadixMenubar from '@radix-ui/react-menubar'
import './menubar.scss'

interface IMenubarProps {
  children: React.ReactNode
  customClass?: string
}

interface IMenubarMenuProps {
  children: React.ReactNode
}

interface IMenubarTriggerProps {
  children: React.ReactNode
  customClass?: string
}

interface IMenubarContentProps {
  children: React.ReactNode
  customClass?: string
}

interface IMenubarItemProps {
  children: React.ReactNode
  customClass?: string
  onSelect?: () => void
  disabled?: boolean
}

export function Menubar({ children, customClass }: IMenubarProps) {
  return (
    <RadixMenubar.Root className={clsx('menubar-root', customClass)}>
      {children}
    </RadixMenubar.Root>
  )
}

export function MenubarMenu({ children }: IMenubarMenuProps) {
  return <RadixMenubar.Menu>{children}</RadixMenubar.Menu>
}

export function MenubarTrigger({ children, customClass }: IMenubarTriggerProps) {
  return (
    <RadixMenubar.Trigger className={clsx('menubar-trigger', customClass)}>
      {children}
    </RadixMenubar.Trigger>
  )
}

export function MenubarContent({ children, customClass }: IMenubarContentProps) {
  return (
    <RadixMenubar.Portal>
      <RadixMenubar.Content className={clsx('menubar-content', customClass)} sideOffset={4}>
        {children}
      </RadixMenubar.Content>
    </RadixMenubar.Portal>
  )
}

export function MenubarItem({ children, customClass, onSelect, disabled }: IMenubarItemProps) {
  return (
    <RadixMenubar.Item
      className={clsx('menubar-item', customClass)}
      onSelect={onSelect}
      disabled={disabled}
    >
      {children}
    </RadixMenubar.Item>
  )
}

export function MenubarSeparator() {
  return <RadixMenubar.Separator className="menubar-separator" />
}
