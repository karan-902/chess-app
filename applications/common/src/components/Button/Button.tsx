import { forwardRef, useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import { Button as MuiButton, CircularProgress } from "@mui/material";
import type { ButtonProps } from "@mui/material";
import classNames from "classnames";
import "./button.scss";
import Text from "../Text/Text";

interface IButtonProps extends ButtonProps {
    customClass?: string;
    isLoading?: boolean;
    loaderOnDark?: boolean;
}

const Button = forwardRef<HTMLButtonElement, IButtonProps>(function Button(
    { customClass, children, isLoading, disabled, loaderOnDark, type, ...props },
    ref,
) {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const setRefs = (node: HTMLButtonElement | null) => {
        buttonRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as MutableRefObject<HTMLButtonElement | null>).current = node;
    };

    useEffect(() => {
        const btn = buttonRef.current;
        if (type !== "submit" || !btn || btn.closest("form")) return;
        const scope = btn.closest('[role="dialog"]') ?? btn.ownerDocument;
        const onKeyDown = (e: Event) => {
            if ((e as KeyboardEvent).key !== "Enter") return;
            const active = btn.ownerDocument.activeElement;
            if (!active || active === btn) return;
            if (active.tagName === "TEXTAREA" || active.tagName === "BUTTON") return;
            if (!scope.contains(active)) return;
            btn.click();
        };
        (scope as EventTarget).addEventListener("keydown", onKeyDown);
        return () => (scope as EventTarget).removeEventListener("keydown", onKeyDown);
    }, [type]);

    const classes = classNames(
        "button",
        customClass,
        isLoading && "btn--loading",
    );

    return (
        <MuiButton
            ref={setRefs}
            type={type}
            {...props}
            className={classes}
            disabled={disabled || isLoading}
            aria-busy={isLoading || undefined}
        >
            {isLoading ? (
                loaderOnDark ? (
                    <CircularProgress
                        size={15}
                        sx={{ color: "primary.contrastText" }}
                    />
                ) : (
                    <CircularProgress size={15} color="inherit" />
                )
            ) : (
                <Text customClass="button-text">{children}</Text>
            )}
        </MuiButton>
    );
});

export default Button;
