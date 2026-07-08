import clsx from 'clsx'
import * as RadixSeparator from '@radix-ui/react-separator'
import './separator.scss'

interface ISeparatorProps {
  orientation?: 'horizontal' | 'vertical'
  customClass?: string
}

function Separator({ orientation = 'horizontal', customClass }: ISeparatorProps) {
  return (
    <RadixSeparator.Root
      orientation={orientation}
      className={clsx('separator', orientation, customClass)}
    />
  )
}

export default Separator
