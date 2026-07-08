import clsx from 'clsx'
import * as RadixAspectRatio from '@radix-ui/react-aspect-ratio'
import './aspect-ratio.scss'

interface IAspectRatioProps {
  ratio?: number
  children: React.ReactNode
  customClass?: string
}

function AspectRatio({ ratio = 1, children, customClass }: IAspectRatioProps) {
  return (
    <RadixAspectRatio.Root ratio={ratio} className={clsx('aspect-ratio', customClass)}>
      {children}
    </RadixAspectRatio.Root>
  )
}

export default AspectRatio
