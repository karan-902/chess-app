import clsx from 'clsx'
import * as RadixSelect from '@radix-ui/react-select'
import './select.scss'

interface ISelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  children: React.ReactNode
  customClass?: string
  disabled?: boolean
}

interface ISelectItemProps {
  value: string
  children: React.ReactNode
  customClass?: string
}

interface ISelectGroupProps {
  label?: string
  children: React.ReactNode
}

export function Select({ value, onValueChange, placeholder, children, customClass, disabled }: ISelectProps) {
  return (
    <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
      <RadixSelect.Trigger className={clsx('select-trigger', customClass)}>
        <RadixSelect.Value placeholder={placeholder ?? 'Select...'} />
        <RadixSelect.Icon className="select-icon">▾</RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content className="select-content" position="popper" sideOffset={4}>
          <RadixSelect.Viewport className="select-viewport">{children}</RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}

export function SelectItem({ value, children, customClass }: ISelectItemProps) {
  return (
    <RadixSelect.Item value={value} className={clsx('select-item', customClass)}>
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
      <RadixSelect.ItemIndicator className="select-item-indicator">✓</RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  )
}

export function SelectGroup({ label, children }: ISelectGroupProps) {
  return (
    <RadixSelect.Group>
      {label && <RadixSelect.Label className="select-group-label">{label}</RadixSelect.Label>}
      {children}
    </RadixSelect.Group>
  )
}

export function SelectSeparator() {
  return <RadixSelect.Separator className="select-separator" />
}
