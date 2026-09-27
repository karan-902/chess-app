import { MenuItem as MuiMenuItem } from "@mui/material";
import type { MenuItemProps } from "@mui/material";
import classNames from "classnames";

interface IMenuItemProps extends MenuItemProps {
 customClass?: string;
}

export function CustomMenuItem({ customClass, ...props }: IMenuItemProps) {
 return (
  <MuiMenuItem
   {...props}
   className={classNames("common-menu-item", customClass)}
  />
 );
}

export default CustomMenuItem;
