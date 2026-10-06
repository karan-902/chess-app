import { Dialog as MuiDialog, DialogTitle } from "@mui/material";
import type { DialogProps } from "@mui/material";
import classNames from "classnames";
import CustomIconButton from "@gopvp/common/src/components/IconButton/IconButton";
import "./modal.scss";
import { closeText } from "@gopvp/common/src/constants/message";

interface IModalProps extends Omit<DialogProps, "title" | "onClose"> {
 open: boolean;
 onClose?: () => void;
 title?: string;
 customClass?: string;
 preventOutsideClose?: boolean;
 hideCloseIcon?: boolean;
}

export function CustomModal({
 open,
 onClose,
 title,
 children,
 customClass,
 preventOutsideClose,
 hideCloseIcon,
 ...props
}: IModalProps) {
 return (
  <MuiDialog
   open={open}
   onClose={preventOutsideClose ? undefined : onClose}
   slotProps={{
    paper: { className: classNames("common-modal", customClass) },
   }}
   disableScrollLock
   container={() => document.querySelector(".app-root") as HTMLElement}
   {...props}
  >
   {title && <DialogTitle className="modal-title">{title}</DialogTitle>}
   {onClose && !preventOutsideClose && !hideCloseIcon && (
    <CustomIconButton
     customClass="modal-close-icon"
     onClick={onClose}
     aria-label={closeText}
     icon="x"
    />
   )}
   {children}
  </MuiDialog>
 );
}

export default CustomModal;
