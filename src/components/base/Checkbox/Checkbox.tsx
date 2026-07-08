import clsx from 'clsx'
import * as RadixCheckbox from '@radix-ui/react-checkbox'
import './checkbox.scss'

interface ICheckboxProps {
  checked?: boolean | 'indeterminate'
  onCheckedChange?: (checked: boolean | 'indeterminate') => void
  disabled?: boolean
  customClass?: string
  id?: string
}

function Checkbox({ checked, onCheckedChange, disabled, customClass, id }: ICheckboxProps) {
  return (
    <RadixCheckbox.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={clsx('checkbox-root', customClass)}
    >
      <RadixCheckbox.Indicator className="checkbox-indicator">✓</RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  )
}

export default Checkbox
