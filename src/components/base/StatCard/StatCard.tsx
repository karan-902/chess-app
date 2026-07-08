import clsx from 'clsx'
import './stat-card.scss'

interface IStatCardProps {
  label: string
  value: string
  icon?: React.ReactNode
  valueColor?: 'default' | 'primary' | 'accent'
  className?: string
  customClass?: string
}

function StatCard({
  label,
  value,
  icon,
  valueColor = 'default',
  className,
  customClass,
}: IStatCardProps) {
  return (
    <div className={clsx('stat-card', customClass, className)}>
      {icon && <div className="stat-card-icon">{icon}</div>}
      <div className={clsx('stat-card-value', `val-${valueColor}`)}>{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  )
}

export default StatCard
