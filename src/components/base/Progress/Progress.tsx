import clsx from 'clsx'
import * as RadixProgress from '@radix-ui/react-progress'
import './progress.scss'

interface IProgressProps {
  value?: number
  max?: number
  customClass?: string
}

function Progress({ value = 0, max = 100, customClass }: IProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <RadixProgress.Root
      value={value}
      max={max}
      className={clsx('progress-root', customClass)}
    >
      <RadixProgress.Indicator
        className="progress-indicator"
        style={{ transform: `translateX(-${100 - pct}%)` }}
      />
    </RadixProgress.Root>
  )
}

export default Progress
