import clsx from 'clsx'
import * as RadixNav from '@radix-ui/react-navigation-menu'
import './navigation-menu.scss'

interface INavMenuProps {
  children: React.ReactNode
  customClass?: string
}

interface INavMenuListProps {
  children: React.ReactNode
  customClass?: string
}

interface INavMenuItemProps {
  children: React.ReactNode
  customClass?: string
}

interface INavMenuTriggerProps {
  children: React.ReactNode
  customClass?: string
}

interface INavMenuContentProps {
  children: React.ReactNode
  customClass?: string
}

interface INavMenuLinkProps {
  children: React.ReactNode
  href?: string
  customClass?: string
  asChild?: boolean
}

export function NavigationMenu({ children, customClass }: INavMenuProps) {
  return (
    <RadixNav.Root className={clsx('nav-menu-root', customClass)}>
      {children}
      <RadixNav.Viewport className="nav-menu-viewport" />
    </RadixNav.Root>
  )
}

export function NavigationMenuList({ children, customClass }: INavMenuListProps) {
  return <RadixNav.List className={clsx('nav-menu-list', customClass)}>{children}</RadixNav.List>
}

export function NavigationMenuItem({ children, customClass }: INavMenuItemProps) {
  return <RadixNav.Item className={clsx('nav-menu-item', customClass)}>{children}</RadixNav.Item>
}

export function NavigationMenuTrigger({ children, customClass }: INavMenuTriggerProps) {
  return (
    <RadixNav.Trigger className={clsx('nav-menu-trigger', customClass)}>
      {children}
    </RadixNav.Trigger>
  )
}

export function NavigationMenuContent({ children, customClass }: INavMenuContentProps) {
  return (
    <RadixNav.Content className={clsx('nav-menu-content', customClass)}>
      {children}
    </RadixNav.Content>
  )
}

export function NavigationMenuLink({ children, href, customClass, asChild }: INavMenuLinkProps) {
  return (
    <RadixNav.Link href={href} asChild={asChild} className={clsx('nav-menu-link', customClass)}>
      {children}
    </RadixNav.Link>
  )
}
