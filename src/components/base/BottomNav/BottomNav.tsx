import clsx from 'clsx'
import './bottom-nav.scss'
import type { LucideIcon } from 'lucide-react'

export interface INavItem {
  id: string
  path: string
  icon: LucideIcon
  label: string
}

interface IBottomNavProps {
  items: INavItem[]
  activeId: string
  onSelect: (id: string) => void
}

function BottomNav({ items, activeId, onSelect }: IBottomNavProps) {
  return (
    <nav className="bottom-nav">
      {items.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={clsx('bottom-nav-item', id === activeId && 'active')}
        >
          <Icon size={20} strokeWidth={id === activeId ? 2 : 1.5} />
          <span className="bottom-nav-label">{label}</span>
          {id === activeId && <span className="bottom-nav-indicator" />}
        </button>
      ))}
    </nav>
  )
}

export default BottomNav
