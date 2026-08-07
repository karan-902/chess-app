import { useEffect } from "react";
import type { ReactNode } from "react";
import classNames from "classnames";
import { X } from "lucide-react";
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
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, onClose]);

    const classes = classNames(
        "drawer",
        `drawer--${anchor}`,
        open && "drawer--open",
        customClass,
    );

    return (
        <div className={classes}>
            <div className="drawer-backdrop" onClick={onClose} />
            <div className="drawer-panel">
                <button
                    type="button"
                    className="drawer-close-icon"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <X size={18} strokeWidth={2} />
                </button>
                {children}
            </div>
        </div>
    );
}
