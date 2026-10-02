import type { ReactNode } from "react";
import { Drawer as MuiDrawer } from "@mui/material";
import classNames from "classnames";
import "./drawer.scss";
import CustomIconButton from "@gopvp/common/src/components/IconButton/IconButton";
import { closeText } from "@gopvp/common/src/constants/message";

interface IDrawerProps {
 open: boolean;
 onClose: () => void;
 anchor?: "left" | "right" | "bottom";
 customClass?: string;
 hideCloseIcon?: boolean;
 disableRestoreFocus?: boolean;
 children?: ReactNode;
}

export function CustomDrawer({
 open,
 onClose,
 anchor = "right",
 customClass,
 hideCloseIcon,
 disableRestoreFocus,
 children,
}: IDrawerProps) {
 return (
  <MuiDrawer
   anchor={anchor}
   open={open}
   onClose={onClose}
   className={classNames("common-drawer", customClass)}
   disableScrollLock
   disableAutoFocus
   disableRestoreFocus={disableRestoreFocus}
   container={() => document.querySelector(".app-shell") as HTMLElement}
  >
   {!hideCloseIcon && (
    <CustomIconButton
     type="button"
     customClass="drawer-close-icon"
     onClick={onClose}
     aria-label={closeText}
     icon="close"
    />
   )}
   {children}
  </MuiDrawer>
 );
}

export default CustomDrawer;
