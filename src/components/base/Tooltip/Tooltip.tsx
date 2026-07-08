import clsx from 'clsx'
import * as RadixTooltip from '@radix-ui/react-tooltip'
import './tooltip.scss'

interface ITooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  customClass?: string
  delayDuration?: number
}

function Tooltip({ content, children, side = 'top', customClass, delayDuration = 300 }: ITooltipProps) {
  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            sideOffset={6}
            className={clsx('tooltip-content', customClass)}
          >
            {content}
            <RadixTooltip.Arrow className="tooltip-arrow" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}

export default Tooltip
