import clsx from 'clsx'
import * as RadixToggle from '@radix-ui/react-toggle'
import './toggle.scss'

interface IToggleProps {
  pressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  children: React.ReactNode
  customClass?: string
  disabled?: boolean
}

function Toggle({ pressed, onPressedChange, children, customClass, disabled }: IToggleProps) {
  return (
    <RadixToggle.Root
      pressed={pressed}
      onPressedChange={onPressedChange}
      disabled={disabled}
      className={clsx('toggle-root', customClass)}
    >
      {children}
    </RadixToggle.Root>
  )
}

export default Toggle
