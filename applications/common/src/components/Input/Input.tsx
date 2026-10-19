import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { InputBase } from "@mui/material";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import CustomLabel from "@gopvp/common/src/components/Label/Label";
import AlertMessage from "@gopvp/common/src/components/AlertMessage/AlertMessage";
import "./input.scss";
import CustomIconButton from "@gopvp/common/src/components/IconButton/IconButton";

interface IInputProps
 extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
 customClass?: string;
 isError?: boolean;
 helperText?: string;
 startIcon?: ReactNode;
 endIcon?: ReactNode;
 label?: ReactNode;
 labelClassName?: string;
 fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, IInputProps>(
 (
  {
   customClass,
   isError,
   helperText,
   startIcon,
   endIcon,
   label,
   labelClassName,
   fullWidth,
   type,
   disabled,
   ...props
  },
  ref,
 ) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
  const isPassword = type === "password";

  return (
   <Box
    customClass={classNames(
     "common-input",
     customClass,
     fullWidth && "full-width",
     isError && "error",
     disabled && "disabled",
    )}
   >
    {label && (
     <CustomLabel htmlFor={props.id} customClass={labelClassName}>
      {label}
     </CustomLabel>
    )}
    <Box customClass="input-row">
     {startIcon && <span className="input-adornment start">{startIcon}</span>}
     <InputBase
      inputProps={{ ...props, "aria-invalid": isError || undefined }}
      type={isPassword && showPassword ? "text" : type}
      disabled={disabled}
      inputRef={inputRef}
     />
     {isPassword ? (
      <span className="input-adornment end">
       <CustomIconButton
        type="button"
        disableRipple
        customClass="input-password-toggle"
        onClick={() => setShowPassword((p) => !p)}
        tabIndex={-1}
        icon={showPassword ? "eyeOff" : "eye"}
       />
      </span>
     ) : (
      endIcon && <span className="input-adornment end">{endIcon}</span>
     )}
    </Box>
    {isError && helperText && (
     <AlertMessage severity="error" message={helperText} inline />
    )}
   </Box>
  );
 },
);

Input.displayName = "Input";

export default Input;
