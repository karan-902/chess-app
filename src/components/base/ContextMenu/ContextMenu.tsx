import clsx from 'clsx'
import * as RadixContextMenu from '@radix-ui/react-context-menu'
import './context-menu.scss'

interface IContextMenuProps {
  children: React.ReactNode
}

interface IContextMenuContentProps {
  children: React.ReactNode
  customClass?: string
}

interface IContextMenuItemProps {
  children: React.ReactNode
  customClass?: string
  onSelect?: () => void
  disabled?: boolean
}

export function ContextMenu({ children }: IContextMenuProps) {
  return <RadixContextMenu.Root>{children}</RadixContextMenu.Root>
}

export function ContextMenuTrigger({ children }: { children: React.ReactNode }) {
  return <RadixContextMenu.Trigger asChild>{children}</RadixContextMenu.Trigger>
}

export function ContextMenuContent({ children, customClass }: IContextMenuContentProps) {
  return (
    <RadixContextMenu.Portal>
      <RadixContextMenu.Content className={clsx('context-menu-content', customClass)}>
        {children}
      </RadixContextMenu.Content>
    </RadixContextMenu.Portal>
  )
}

export function ContextMenuItem({ children, customClass, onSelect, disabled }: IContextMenuItemProps) {
  return (
    <RadixContextMenu.Item
      className={clsx('context-menu-item', customClass)}
      onSelect={onSelect}
      disabled={disabled}
    >
      {children}
    </RadixContextMenu.Item>
  )
}

export function ContextMenuSeparator() {
  return <RadixContextMenu.Separator className="context-menu-separator" />
}

export function ContextMenuLabel({ children }: { children: React.ReactNode }) {
  return <RadixContextMenu.Label className="context-menu-label">{children}</RadixContextMenu.Label>
}
