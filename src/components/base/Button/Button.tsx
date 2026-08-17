import { forwardRef } from "react";
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
    { customClass, children, isLoading, disabled, loaderOnDark, ...props },
    ref,
) {
    const classes = classNames(
        "button",
        customClass,
        isLoading && "btn--loading",
    );

    return (
        <MuiButton
            ref={ref}
            {...props}
            className={classes}
            disabled={disabled && !isLoading}
            aria-busy={isLoading || undefined}
        >
            {isLoading ? (
                loaderOnDark ? (
                    <CircularProgress size={15} sx={{ color: "#ffffff" }} />
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
