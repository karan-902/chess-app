import { Dialog as MuiDialog, DialogTitle, IconButton } from "@mui/material";
import type { DialogProps } from "@mui/material";
import classNames from "classnames";
import { X } from "lucide-react";
import "./modal.scss";

interface IModalProps extends Omit<DialogProps, "title" | "onClose"> {
    open: boolean;
    onClose?: () => void;
    title?: string;
    customClass?: string;
    preventOutsideClose?: boolean;
}

export default function Modal({
    open,
    onClose,
    title,
    children,
    customClass,
    preventOutsideClose,
    ...props
}: IModalProps) {
    const paperClasses = classNames("modal", customClass);

    return (
        <MuiDialog
            open={open}
            onClose={preventOutsideClose ? undefined : onClose}
            slotProps={{
                paper: { className: paperClasses },
            }}
            disableScrollLock
            container={() =>
                document.querySelector(".app-shell") as HTMLElement
            }
            {...props}
        >
            {title && (
                <DialogTitle className="modal-title">{title}</DialogTitle>
            )}
            {onClose && !preventOutsideClose && (
                <IconButton
                    className="modal-close-icon"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <X size={22} strokeWidth={2} />
                </IconButton>
            )}
            {children}
        </MuiDialog>
    );
}
