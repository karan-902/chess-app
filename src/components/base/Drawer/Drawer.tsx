import type { ReactNode } from "react";
import { Drawer as MuiDrawer } from "@mui/material";
import classNames from "classnames";
import { X } from "lucide-react";
import Button from "../Button/Button";
import "./drawer.scss";

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
                backdrop: { className: "drawer-backdrop" },
            }}
        >
            <Button
                type="button"
                customClass="drawer-close-icon"
                onClick={onClose}
                aria-label="Close"
            >
                <X size={18} strokeWidth={2} />
            </Button>
            {children}
        </MuiDrawer>
    );
}
