import clsx from 'clsx'
import * as RadixSwitch from '@radix-ui/react-switch'
import './switch.scss'

interface ISwitchProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  customClass?: string
  id?: string
}

function Switch({ checked, onCheckedChange, disabled, customClass, id }: ISwitchProps) {
  return (
    <RadixSwitch.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={clsx('switch-root', customClass)}
    >
      <RadixSwitch.Thumb className="switch-thumb" />
    </RadixSwitch.Root>
  )
}

export default Switch
