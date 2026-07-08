import clsx from 'clsx'
import * as RadixScrollArea from '@radix-ui/react-scroll-area'
import './scroll-area.scss'

interface IScrollAreaProps {
  children: React.ReactNode
  customClass?: string
  height?: string | number
  maxHeight?: string | number
}

function ScrollArea({ children, customClass, height, maxHeight }: IScrollAreaProps) {
  const style: React.CSSProperties = {}
  if (height !== undefined) style.height = typeof height === 'number' ? `${height}px` : height
  if (maxHeight !== undefined) style.maxHeight = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight

  return (
    <RadixScrollArea.Root
      className={clsx('scroll-area-root', customClass)}
      style={Object.keys(style).length ? style : undefined}
    >
      <RadixScrollArea.Viewport className="scroll-area-viewport">
        {children}
      </RadixScrollArea.Viewport>
      <RadixScrollArea.Scrollbar className="scroll-area-scrollbar" orientation="vertical">
        <RadixScrollArea.Thumb className="scroll-area-thumb" />
      </RadixScrollArea.Scrollbar>
      <RadixScrollArea.Scrollbar className="scroll-area-scrollbar" orientation="horizontal">
        <RadixScrollArea.Thumb className="scroll-area-thumb" />
      </RadixScrollArea.Scrollbar>
      <RadixScrollArea.Corner className="scroll-area-corner" />
    </RadixScrollArea.Root>
  )
}

export default ScrollArea
