import clsx from 'clsx'
import * as RadixDropdown from '@radix-ui/react-dropdown-menu'
import './dropdown-menu.scss'

interface IDropdownMenuProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface IDropdownTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

interface IDropdownContentProps {
  children: React.ReactNode
  customClass?: string
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
}

interface IDropdownItemProps {
  children: React.ReactNode
  customClass?: string
  onSelect?: () => void
  disabled?: boolean
}

interface IDropdownLabelProps {
  children: React.ReactNode
  customClass?: string
}

export function DropdownMenu({ children, open, onOpenChange }: IDropdownMenuProps) {
  return (
    <RadixDropdown.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </RadixDropdown.Root>
  )
}

export function DropdownMenuTrigger({ children, asChild = true }: IDropdownTriggerProps) {
  return <RadixDropdown.Trigger asChild={asChild}>{children}</RadixDropdown.Trigger>
}

export function DropdownMenuContent({ children, customClass, align = 'end', sideOffset = 6 }: IDropdownContentProps) {
  return (
    <RadixDropdown.Portal>
      <RadixDropdown.Content
        className={clsx('dropdown-content', customClass)}
        align={align}
        sideOffset={sideOffset}
      >
        {children}
      </RadixDropdown.Content>
    </RadixDropdown.Portal>
  )
}

export function DropdownMenuItem({ children, customClass, onSelect, disabled }: IDropdownItemProps) {
  return (
    <RadixDropdown.Item
      className={clsx('dropdown-item', customClass)}
      onSelect={onSelect}
      disabled={disabled}
    >
      {children}
    </RadixDropdown.Item>
  )
}

export function DropdownMenuLabel({ children, customClass }: IDropdownLabelProps) {
  return (
    <RadixDropdown.Label className={clsx('dropdown-label', customClass)}>
      {children}
    </RadixDropdown.Label>
  )
}

export function DropdownMenuSeparator() {
  return <RadixDropdown.Separator className="dropdown-separator" />
}
