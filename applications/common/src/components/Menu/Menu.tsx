import { Menu as MuiMenu } from "@mui/material";
import type { MenuProps } from "@mui/material";
import classNames from "classnames";
import "./menu.scss";

interface IMenuProps extends MenuProps {
    customClass?: string;
}

export function CustomMenu({ customClass, ...props }: IMenuProps) {
    return <MuiMenu {...props} className={classNames("common-menu", customClass)} />;
}

export default CustomMenu;
