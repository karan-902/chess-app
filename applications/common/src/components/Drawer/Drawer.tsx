import type { ReactNode } from "react";
import { Drawer as MuiDrawer } from "@mui/material";
import classNames from "classnames";
import { X } from "lucide-react";
import "./drawer.scss";
import IconButton from "../IconButton/IconButton";

interface IDrawerProps {
    open: boolean;
    onClose: () => void;
    anchor?: "left" | "right" | "bottom";
    customClass?: string;
    children?: ReactNode;
}

export default function Drawer({
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
                    className: classNames(
                        "drawer-panel",
                        `drawer-panel--${anchor}`,
                    ),
                },
            }}
            disableScrollLock
            disableAutoFocus
            container={() =>
                document.querySelector(".app-shell") as HTMLElement
            }
        >
            <IconButton
                type="button"
                customClass="drawer-close-icon"
                onClick={onClose}
                aria-label="Close"
            >
                <X size={18} strokeWidth={2} />
            </IconButton>
            {children}
        </MuiDrawer>
    );
}
