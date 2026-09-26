import { Menu as MuiMenu } from "@mui/material";
import type { MenuProps } from "@mui/material";
import classNames from "classnames";
import "./menu.scss";

interface IMenuProps extends MenuProps {
    customClass?: string;
}

export function CustomMenu({ customClass, ...props }: IMenuProps) {
    const classes = classNames("menu", customClass);
    return <MuiMenu {...props} className={classes} />;
}

export default CustomMenu;
