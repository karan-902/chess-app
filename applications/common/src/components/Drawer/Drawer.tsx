import type { ReactNode } from "react";
import { Drawer as MuiDrawer } from "@mui/material";
import classNames from "classnames";
import CloseIcon from "@mui/icons-material/Close";
import "./drawer.scss";
import CustomIconButton from "../IconButton/IconButton";

interface IDrawerProps {
 open: boolean;
 onClose: () => void;
 anchor?: "left" | "right" | "bottom";
 customClass?: string;
 children?: ReactNode;
}

export function CustomDrawer({
 open,
 onClose,
 anchor = "right",
 customClass,
 children,
}: IDrawerProps) {
 return (
  <MuiDrawer
   anchor={anchor}
   open={open}
   onClose={onClose}
   className={classNames("drawer", customClass)}
   slotProps={{
    paper: {
     className: classNames("drawer-panel", `drawer-panel--${anchor}`),
    },
   }}
   disableScrollLock
   disableAutoFocus
   container={() => document.querySelector(".app-shell") as HTMLElement}
  >
   <CustomIconButton
    type="button"
    customClass="drawer-close-icon"
    onClick={onClose}
    aria-label="Close"
   >
    <CloseIcon />
   </CustomIconButton>
   {children}
  </MuiDrawer>
 );
}

export default CustomDrawer;
