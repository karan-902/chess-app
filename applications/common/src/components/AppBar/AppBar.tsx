import { AppBar as MuiAppBar, Toolbar } from "@mui/material";
import type { AppBarProps } from "@mui/material";
import classNames from "classnames";
import type { ReactNode } from "react";
import "./appbar.scss";

interface IAppBarProps extends AppBarProps {
    customClass?: string;
    toolbarClass?: string;
    brand?: ReactNode;
    bottomSlot?: ReactNode;
}

export default function AppBar({
    customClass,
    toolbarClass,
    brand,
    children,
    bottomSlot,
    ...props
}: IAppBarProps) {
    const classes = classNames("appbar", customClass);
    const toolbarClasses = classNames("toolbar", toolbarClass);

    return (
        <MuiAppBar {...props} className={classes} position="static">
            <Toolbar className={toolbarClasses}>
                {brand}
                {children}
            </Toolbar>
            {bottomSlot}
        </MuiAppBar>
    );
}
