import clsx from 'clsx'
import * as RadixDialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import './modal.scss'

interface IModalProps {
  open: boolean
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
  title?: string
  children: React.ReactNode
  customClass?: string
  preventOutsideClose?: boolean
  variant?: 'default'
}

function renderModalBody(
  variant: 'default',
  title: string | undefined,
  onClose: (() => void) | undefined,
  preventOutsideClose: boolean | undefined,
  children: React.ReactNode,
) {
  switch (variant) {
    default:
      return (
        <>
          {title && <RadixDialog.Title className="modal-title">{title}</RadixDialog.Title>}
          {onClose && !preventOutsideClose && (
            <RadixDialog.Close asChild>
              <button type="button" className="modal-close-icon" aria-label="Close">
                <X size={18} strokeWidth={2} />
              </button>
            </RadixDialog.Close>
          )}
          {children}
        </>
      )
  }
}

export function Modal({
  open,
  onOpenChange,
  onClose,
  title,
  children,
  customClass,
  preventOutsideClose,
  variant = 'default',
}: IModalProps) {
  const handleOpenChange = (next: boolean) => {
    if (!next) onClose?.()
    onOpenChange?.(next)
  }

  return (
    <RadixDialog.Root open={open} onOpenChange={handleOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="modal-overlay" />
        <RadixDialog.Content
          className={clsx('common-modal', `modal--${variant}`, customClass)}
          onEscapeKeyDown={preventOutsideClose ? (e) => e.preventDefault() : undefined}
          onPointerDownOutside={preventOutsideClose ? (e) => e.preventDefault() : undefined}
          onInteractOutside={preventOutsideClose ? (e) => e.preventDefault() : undefined}
        >
          {renderModalBody(variant, title, onClose, preventOutsideClose, children)}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
