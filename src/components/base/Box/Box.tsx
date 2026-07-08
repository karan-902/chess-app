import clsx from 'clsx'
import React from 'react'
import './box.scss'

type BoxTag = 'div' | 'main' | 'section' | 'article' | 'header' | 'footer' | 'nav' | 'aside' | 'form'

interface IBoxProps {
  children?: React.ReactNode
  customClass?: string
  className?: string
  onClick?: () => void
  onSubmit?: React.FormEventHandler<HTMLElement>
  width?: string | number
  height?: string | number
  minWidth?: string | number
  minHeight?: string | number
  as?: BoxTag
  style?: React.CSSProperties
}

const Box = React.forwardRef<HTMLElement, IBoxProps>(
  ({ children, customClass, className, onClick, onSubmit, width, height, minWidth, minHeight, as: Tag = 'div', style: styleProp }, ref) => {
    const style: React.CSSProperties = { ...styleProp }
    if (width !== undefined) style.width = typeof width === 'number' ? `${width}px` : width
    if (height !== undefined) style.height = typeof height === 'number' ? `${height}px` : height
    if (minWidth !== undefined) style.minWidth = typeof minWidth === 'number' ? `${minWidth}px` : minWidth
    if (minHeight !== undefined) style.minHeight = typeof minHeight === 'number' ? `${minHeight}px` : minHeight

    const Comp = Tag as React.ElementType

    return (
      <Comp
        ref={ref}
        className={clsx('box', customClass, className)}
        onClick={onClick}
        onSubmit={onSubmit}
        style={Object.keys(style).length ? style : undefined}
      >
        {children}
      </Comp>
    )
  }
)

Box.displayName = 'Box'

export default Box
