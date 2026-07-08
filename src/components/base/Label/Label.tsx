import clsx from 'clsx'
import './label.scss'

interface ILabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
  customClass?: string
}

function Label({ children, customClass, className, ...props }: ILabelProps) {
  return (
    <label className={clsx('label', customClass, className)} {...props}>
      {children}
    </label>
  )
}

export default Label
