import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Drawer as MuiDrawer } from "@mui/material";
import classNames from "classnames";
import "./drawer.scss";
import CustomIconButton from "@gopvp/common/src/components/IconButton/IconButton";
import { closeText } from "@gopvp/common/src/constants/message";
import {
 DRAWER_ENTER_MS,
 DRAWER_EXIT_MS,
 DRAWER_ENTER_EASING,
 DRAWER_EXIT_EASING,
 DRAWER_RESIZE_MS,
 DRAWER_RESIZE_MIN_PX,
} from "@gopvp/common/src/constants/limit";

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
 const [paper, setPaper] = useState<HTMLDivElement | null>(null);
 const isEnteredRef = useRef(false);
 const isReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
 ).matches;

 useEffect(() => {
  if (!open || anchor !== "bottom" || !paper || isReducedMotion) return;
  let lastHeight = paper.offsetHeight;
  let glide: Animation | null = null;
  const observer = new ResizeObserver(() => {
   const delta = paper.offsetHeight - lastHeight;
   if (Math.abs(delta) < DRAWER_RESIZE_MIN_PX || !isEnteredRef.current) return;
   lastHeight = paper.offsetHeight;
   const offset = new DOMMatrix(getComputedStyle(paper).transform).m42;
   glide?.cancel();
   glide = paper.animate(
    [
     { transform: `translateY(${offset + delta}px)` },
     { transform: "translateY(0)" },
    ],
    { duration: DRAWER_RESIZE_MS, easing: DRAWER_ENTER_EASING },
   );
  });
  observer.observe(paper);
  return () => observer.disconnect();
 }, [open, anchor, paper, isReducedMotion]);

 return (
  <MuiDrawer
   anchor={anchor}
   open={open}
   onClose={onClose}
   className={classNames("common-drawer", customClass)}
   disableScrollLock
   disableAutoFocus
   disableRestoreFocus={disableRestoreFocus}
   container={() => document.querySelector(".app-root") as HTMLElement}
   transitionDuration={
    isReducedMotion ? 0 : { enter: DRAWER_ENTER_MS, exit: DRAWER_EXIT_MS }
   }
   slotProps={{
    paper: { ref: setPaper },
    transition: {
     easing: { enter: DRAWER_ENTER_EASING, exit: DRAWER_EXIT_EASING },
     onEntered: () => {
      isEnteredRef.current = true;
     },
     onExit: () => {
      isEnteredRef.current = false;
     },
    },
   }}
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
