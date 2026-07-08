import clsx from 'clsx'
import * as RadixAlertDialog from '@radix-ui/react-alert-dialog'
import './alert-dialog.scss'

interface IAlertDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

interface IAlertDialogContentProps {
  children: React.ReactNode
  customClass?: string
}

interface IAlertDialogTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

interface IAlertDialogActionProps {
  children: React.ReactNode
  asChild?: boolean
}

interface IAlertDialogCancelProps {
  children: React.ReactNode
  asChild?: boolean
}

export function AlertDialog({ open, onOpenChange, children }: IAlertDialogProps) {
  return (
    <RadixAlertDialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </RadixAlertDialog.Root>
  )
}

export function AlertDialogTrigger({ children, asChild = true }: IAlertDialogTriggerProps) {
  return <RadixAlertDialog.Trigger asChild={asChild}>{children}</RadixAlertDialog.Trigger>
}

export function AlertDialogContent({ children, customClass }: IAlertDialogContentProps) {
  return (
    <RadixAlertDialog.Portal>
      <RadixAlertDialog.Overlay className="alert-dialog-overlay" />
      <RadixAlertDialog.Content className={clsx('alert-dialog-content', customClass)}>
        {children}
      </RadixAlertDialog.Content>
    </RadixAlertDialog.Portal>
  )
}

export function AlertDialogTitle({ children }: { children: React.ReactNode }) {
  return <RadixAlertDialog.Title className="alert-dialog-title">{children}</RadixAlertDialog.Title>
}

export function AlertDialogDescription({ children }: { children: React.ReactNode }) {
  return <RadixAlertDialog.Description className="alert-dialog-description">{children}</RadixAlertDialog.Description>
}

export function AlertDialogAction({ children, asChild = true }: IAlertDialogActionProps) {
  return <RadixAlertDialog.Action asChild={asChild}>{children}</RadixAlertDialog.Action>
}

export function AlertDialogCancel({ children, asChild = true }: IAlertDialogCancelProps) {
  return <RadixAlertDialog.Cancel asChild={asChild}>{children}</RadixAlertDialog.Cancel>
}
