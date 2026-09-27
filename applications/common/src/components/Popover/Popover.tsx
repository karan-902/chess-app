import { Popover as MuiPopover } from "@mui/material";
import type { PopoverProps } from "@mui/material";
import classNames from "classnames";
import "./popover.scss";

interface IPopoverProps extends PopoverProps {
 customClass?: string;
}

export function CustomPopover({ customClass, ...props }: IPopoverProps) {
 return (
  <MuiPopover
   {...props}
   className={classNames("common-popover", customClass)}
  />
 );
}

export default CustomPopover;
