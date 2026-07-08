import clsx from 'clsx'
import * as RadixToggleGroup from '@radix-ui/react-toggle-group'
import './toggle-group.scss'

interface IToggleGroupProps {
  type?: 'single' | 'multiple'
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  customClass?: string
}

interface IToggleGroupItemProps {
  value: string
  children: React.ReactNode
  customClass?: string
  disabled?: boolean
}

export function ToggleGroup({ type = 'single', value, onValueChange, children, customClass }: IToggleGroupProps) {
  return (
    <RadixToggleGroup.Root
      type={type as 'single'}
      value={value}
      onValueChange={onValueChange}
      className={clsx('toggle-group-root', customClass)}
    >
      {children}
    </RadixToggleGroup.Root>
  )
}

export function ToggleGroupItem({ value, children, customClass, disabled }: IToggleGroupItemProps) {
  return (
    <RadixToggleGroup.Item
      value={value}
      disabled={disabled}
      className={clsx('toggle-group-item', customClass)}
    >
      {children}
    </RadixToggleGroup.Item>
  )
}
