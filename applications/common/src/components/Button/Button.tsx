import { forwardRef, useEffect, useRef } from "react";
import type {
 ButtonHTMLAttributes,
 ComponentProps,
 ComponentType,
 MutableRefObject,
} from "react";
import { Button as NeoPopButtonBase } from "@cred/neopop-web/lib/components";
import classNames from "classnames";
import "./button.scss";
import Text from "@gopvp/common/src/components/Text/Text";
import { icons, type TIconName } from "@gopvp/common/src/components/images";

type TButtonVariant = "contained" | "outlined" | "text";

interface IButtonProps
 extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
 variant?: TButtonVariant;
 size?: "small" | "medium" | "large";
 fullWidth?: boolean;
 customClass?: string;
 isLoading?: boolean;
 loaderOnDark?: boolean;
 startIcon?: TIconName;
 endIcon?: TIconName;
 onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const NeoPopButton = NeoPopButtonBase as ComponentType<
 ComponentProps<typeof NeoPopButtonBase> &
  Pick<ButtonHTMLAttributes<HTMLButtonElement>, "type">
>;

const NEOPOP_KIND = {
 contained: "elevated",
 outlined: "elevated",
 text: "flat",
} as const;

const TRANSPARENT_EDGES = {
 top: "transparent",
 left: "transparent",
 right: "transparent",
 bottom: "transparent",
};

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
   variant = "text",
   size = "medium",
   fullWidth,
   onClick,
   ...props
  },
  ref,
 ) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const setRefs = (wrapper: HTMLSpanElement | null) => {
   const node = (wrapper?.firstElementChild as HTMLButtonElement) ?? null;
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

  const renderIcon = (name: TIconName | undefined, side: "start" | "end") => {
   if (!name || isLoading) return null;
   const Icon = icons[name];
   return (
    <span className={classNames("button-icon", side)}>
     <Icon />
    </span>
   );
  };

  const isDisabled = disabled || isLoading;

  return (
   <span ref={setRefs} className="common-button-ref">
    <NeoPopButton
     {...props}
     type={type}
     kind={NEOPOP_KIND[variant]}
     fullWidth={fullWidth}
     disabled={isDisabled}
     colorConfig={{
      backgroundColor: "transparent",
      color: "inherit",
      edgeColors: TRANSPARENT_EDGES,
      disabledColors: { color: "inherit", edgeColors: TRANSPARENT_EDGES },
     }}
     onClick={onClick as () => void}
     className={classNames(
      "common-button",
      variant,
      `size-${size}`,
      customClass,
      fullWidth && "full-width",
      isDisabled && "disabled",
      isLoading && "loading",
     )}
     aria-busy={isLoading || undefined}
    >
     {isLoading ? (
      <span
       className={classNames("button-spinner", loaderOnDark && "on-dark")}
       role="progressbar"
      />
     ) : (
      <>
       {renderIcon(startIcon, "start")}
       <Text customClass="button-text">{children}</Text>
       {renderIcon(endIcon, "end")}
      </>
     )}
    </NeoPopButton>
   </span>
  );
 },
);

export default Button;
