import { AppBar as MuiAppBar, Toolbar } from "@mui/material";
import type { AppBarProps } from "@mui/material";
import classNames from "classnames";
import type { ReactNode } from "react";
import "./app-bar.scss";

interface IAppBarProps extends AppBarProps {
    customClass?: string;
    brand?: ReactNode;
    bottomSlot?: ReactNode;
}

export function CustomAppBar({
    customClass,
    brand,
    children,
    bottomSlot,
    ...props
}: IAppBarProps) {
    return (
        <MuiAppBar {...props} className={classNames("common-app-bar", customClass)} position="static">
            <Toolbar>
                {brand}
                {children}
            </Toolbar>
            {bottomSlot}
        </MuiAppBar>
    );
}

export default CustomAppBar;
