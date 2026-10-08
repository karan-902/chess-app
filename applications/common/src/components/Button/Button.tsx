import { forwardRef, useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import { Button as MuiButton, CircularProgress } from "@mui/material";
import type { ButtonProps } from "@mui/material";
import classNames from "classnames";
import "./button.scss";
import Text from "@gopvp/common/src/components/Text/Text";
import { icons, type TIconName } from "@gopvp/common/src/components/images";

interface IButtonProps extends Omit<ButtonProps, "startIcon" | "endIcon"> {
 customClass?: string;
 isLoading?: boolean;
 loaderOnDark?: boolean;
 startIcon?: TIconName;
 endIcon?: TIconName;
 elevated?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, IButtonProps>(
 function Button(
  {
   customClass,
   children,
   isLoading,
   disabled,
   loaderOnDark,
   type,
   startIcon,
   endIcon,
   elevated = false,
   ...props
  },
  ref,
 ) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const setRefs = (node: HTMLButtonElement | null) => {
   buttonRef.current = node;
   if (typeof ref === "function") ref(node);
   else if (ref)
    (ref as MutableRefObject<HTMLButtonElement | null>).current = node;
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
   return () =>
    (scope as EventTarget).removeEventListener("keydown", onKeyDown);
  }, [type]);

  const renderIcon = (name?: TIconName) => {
   if (!name || isLoading) return undefined;
   const Icon = icons[name];
   return <Icon />;
  };

  return (
   <MuiButton
    ref={setRefs}
    type={type}
    {...props}
    startIcon={renderIcon(startIcon)}
    endIcon={renderIcon(endIcon)}
    className={classNames(
     "common-button",
     customClass,
     isLoading && "loading",
     elevated && "elevated",
    )}
    disabled={disabled || isLoading}
    aria-busy={isLoading || undefined}
   >
    {isLoading ? (
     <CircularProgress
      size={20}
      color="inherit"
      sx={loaderOnDark ? { color: "primary.contrastText" } : undefined}
     />
    ) : (
     <Text customClass="button-text">{children}</Text>
    )}
   </MuiButton>
  );
 },
);

export default Button;
