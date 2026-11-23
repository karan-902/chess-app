import { forwardRef, useSyncExternalStore } from "react";
import { IconButton as MuiIconButton } from "@mui/material";
import type { IconButtonProps } from "@mui/material";
import classNames from "classnames";
import { icons, type TIconName } from "@gopvp/common/src/components/images";
import {
 getIsApiPending,
 subscribeApiPending,
} from "@gopvp/common/src/util/api";
import "./icon-button.scss";

interface IIconButtonProps extends Omit<IconButtonProps, "children"> {
 customClass?: string;
 icon: TIconName;
}

export const CustomIconButton = forwardRef<HTMLButtonElement, IIconButtonProps>(
 ({ customClass, icon, onClick, ...props }, ref) => {
  const Icon = icons[icon];
  const isApiPending = useSyncExternalStore(
   subscribeApiPending,
   getIsApiPending,
  );
  return (
   <MuiIconButton
    ref={ref}
    {...props}
    onClick={isApiPending ? undefined : onClick}
    aria-disabled={isApiPending || undefined}
    className={classNames("common-icon-button", customClass)}
   >
    <Icon />
   </MuiIconButton>
  );
 },
);

CustomIconButton.displayName = "CustomIconButton";

export default CustomIconButton;
