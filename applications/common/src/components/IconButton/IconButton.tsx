import { forwardRef } from "react";
import { IconButton as MuiIconButton } from "@mui/material";
import type { IconButtonProps } from "@mui/material";
import classNames from "classnames";
import { icons, type TIconName } from "@gopvp/common/src/components/images";
import { usePendingClick } from "@gopvp/common/src/hooks/usePendingClick";
import type { TButtonClickHandler } from "@gopvp/common/src/types/component";
import "./icon-button.scss";

interface IIconButtonProps extends Omit<
 IconButtonProps,
 "children" | "onClick"
> {
 customClass?: string;
 icon: TIconName;
 onClick?: TButtonClickHandler;
}

export const CustomIconButton = forwardRef<HTMLButtonElement, IIconButtonProps>(
 ({ customClass, icon, onClick, ...props }, ref) => {
  const Icon = icons[icon];
  const { isClickPending, handleClick } = usePendingClick(onClick);
  return (
   <MuiIconButton
    ref={ref}
    {...props}
    onClick={isClickPending ? undefined : handleClick}
    aria-disabled={isClickPending || undefined}
    className={classNames("common-icon-button", customClass)}
   >
    <Icon />
   </MuiIconButton>
  );
 },
);

CustomIconButton.displayName = "CustomIconButton";

export default CustomIconButton;
