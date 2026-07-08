import clsx from 'clsx'
import * as RadixDialog from '@radix-ui/react-dialog'
import './dialog.scss'

interface IDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

interface IDialogContentProps {
  children: React.ReactNode
  customClass?: string
}

interface IDialogTitleProps {
  children: React.ReactNode
  customClass?: string
}

interface IDialogDescriptionProps {
  children: React.ReactNode
  customClass?: string
}

interface IDialogCloseProps {
  children: React.ReactNode
  asChild?: boolean
}

interface IDialogTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

export function Dialog({ open, onOpenChange, children }: IDialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </RadixDialog.Root>
  )
}

export function DialogTrigger({ children, asChild = true }: IDialogTriggerProps) {
  return <RadixDialog.Trigger asChild={asChild}>{children}</RadixDialog.Trigger>
}

export function DialogContent({ children, customClass }: IDialogContentProps) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="dialog-overlay" />
      <RadixDialog.Content className={clsx('dialog-content', customClass)}>
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  )
}

export function DialogTitle({ children, customClass }: IDialogTitleProps) {
  return (
    <RadixDialog.Title className={clsx('dialog-title', customClass)}>
      {children}
    </RadixDialog.Title>
  )
}

export function DialogDescription({ children, customClass }: IDialogDescriptionProps) {
  return (
    <RadixDialog.Description className={clsx('dialog-description', customClass)}>
      {children}
    </RadixDialog.Description>
  )
}

export function DialogClose({ children, asChild = true }: IDialogCloseProps) {
  return <RadixDialog.Close asChild={asChild}>{children}</RadixDialog.Close>
}
