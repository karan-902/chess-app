import { forwardRef } from "react";
import { Button as MuiButton, CircularProgress } from "@mui/material";
import type { ButtonProps } from "@mui/material";
import classNames from "classnames";
import "./button.scss";

interface IButtonProps extends ButtonProps {
    customClass?: string;
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, IButtonProps>(function Button(
    { customClass, children, isLoading, disabled, ...props },
    ref,
) {
    const classes = classNames("button", customClass, isLoading && "btn--loading");

    return (
        <MuiButton
            ref={ref}
            {...props}
            className={classes}
            disabled={disabled && !isLoading}
            aria-busy={isLoading || undefined}
        >
            {isLoading ? (
                <CircularProgress size={15} color="inherit" />
            ) : (
                children
            )}
        </MuiButton>
    );
});

export default Button;
