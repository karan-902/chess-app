import { forwardRef, useState } from "react";
import { InputBase, InputAdornment } from "@mui/material";
import type { InputBaseProps } from "@mui/material";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import CustomLabel from "@gopvp/common/src/components/Label/Label";
import AlertMessage from "@gopvp/common/src/components/AlertMessage/AlertMessage";
import Text from "@gopvp/common/src/components/Text/Text";
import "./input.scss";
import CustomIconButton from "@gopvp/common/src/components/IconButton/IconButton";

interface IInputProps extends InputBaseProps {
 customClass?: string;
 isError?: boolean;
 helperText?: string;
 startIcon?: React.ReactNode;
 endIcon?: React.ReactNode;
 label?: React.ReactNode;
 labelClassName?: string;
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
   onBlur,
   ...props
  },
  ref,
 ) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const forwardBlurEvent =
   onBlur &&
   ((event?: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event) onBlur(event);
   });

  return (
   <Box customClass={classNames("common-input", customClass)}>
    {label && (
     <CustomLabel htmlFor={props.id} customClass={labelClassName}>
      {label}
     </CustomLabel>
    )}
    <InputBase
     {...props}
     error={isError}
     fullWidth={fullWidth}
     type={isPassword && showPassword ? "text" : type}
     inputRef={ref}
     onBlur={forwardBlurEvent}
     startAdornment={
      startIcon && <InputAdornment position="start">{startIcon}</InputAdornment>
     }
     endAdornment={
      isPassword ? (
       <InputAdornment position="end">
        <CustomIconButton
         type="button"
         disableRipple
         customClass="input-password-toggle"
         onClick={() => setShowPassword((p) => !p)}
         tabIndex={-1}
         icon={showPassword ? "eyeOff" : "eye"}
        />
       </InputAdornment>
      ) : (
       endIcon && <InputAdornment position="end">{endIcon}</InputAdornment>
      )
     }
    />
    {isError && helperText && (
     <>
      <Text customClass="field-error">{helperText}</Text>
      <AlertMessage
       severity="error"
       message={helperText}
       customClass="field-error"
      />
     </>
    )}
   </Box>
  );
 },
);

Input.displayName = "Input";

export default Input;
