import { forwardRef, useState } from "react";
import { InputBase, InputAdornment } from "@mui/material";
import type { InputBaseProps } from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import classNames from "classnames";
import Box from "../Box/Box";
import AlertMessage from "../AlertMessage/AlertMessage";
import "./input.scss";

interface IInputProps extends InputBaseProps {
    customClass?: string;
    isError?: boolean;
    helperText?: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, IInputProps>(
    (
        {
            customClass,
            isError,
            helperText,
            startIcon,
            endIcon,
            fullWidth,
            type,
            onBlur,
            ...props
        },
        ref,
    ) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === "password";
        const classes = classNames("input", customClass);

        return (
            <Box customClass="input-wrap">
                <InputBase
                    {...props}
                    className={classes}
                    error={isError}
                    fullWidth={fullWidth}
                    type={isPassword && showPassword ? "text" : type}
                    inputRef={ref}
                    onBlur={
                        // MUI calls onBlur() with no event when `disabled`
                        // flips true on a focused input to simulate the
                        // blur browsers won't fire themselves
                        onBlur &&
                        ((
                            event?: React.FocusEvent<
                                HTMLInputElement | HTMLTextAreaElement
                            >,
                        ) => {
                            if (event) onBlur(event);
                        })
                    }
                    startAdornment={
                        startIcon && (
                            <InputAdornment position="start">
                                {startIcon}
                            </InputAdornment>
                        )
                    }
                    endAdornment={
                        isPassword ? (
                            <InputAdornment position="end">
                                <button
                                    type="button"
                                    className="input-password-toggle"
                                    onClick={() => setShowPassword((p) => !p)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </InputAdornment>
                        ) : (
                            endIcon && (
                                <InputAdornment position="end">
                                    {endIcon}
                                </InputAdornment>
                            )
                        )
                    }
                />
                {isError && helperText && (
                    <AlertMessage severity="error" message={helperText} />
                )}
            </Box>
        );
    },
);

Input.displayName = "Input";

export default Input;
