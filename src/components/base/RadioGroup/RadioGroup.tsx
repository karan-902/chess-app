import clsx from 'clsx'
import * as RadixRadioGroup from '@radix-ui/react-radio-group'
import './radio-group.scss'

interface IRadioGroupProps {
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
  children: React.ReactNode
  customClass?: string
}

interface IRadioItemProps {
  value: string
  id?: string
  customClass?: string
  children?: React.ReactNode
}

export function RadioGroup({ value, onValueChange, defaultValue, children, customClass }: IRadioGroupProps) {
  return (
    <RadixRadioGroup.Root
      value={value}
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      className={clsx('radio-group', customClass)}
    >
      {children}
    </RadixRadioGroup.Root>
  )
}

export function RadioItem({ value, id, customClass, children }: IRadioItemProps) {
  return (
    <div className={clsx('radio-item-wrapper', customClass)}>
      <RadixRadioGroup.Item value={value} id={id} className="radio-item">
        <RadixRadioGroup.Indicator className="radio-indicator" />
      </RadixRadioGroup.Item>
      {children && (
        <label htmlFor={id} className="radio-label">
          {children}
        </label>
      )}
    </div>
  )
}
