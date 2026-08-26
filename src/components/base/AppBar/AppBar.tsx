import { AppBar as MuiAppBar, Toolbar } from "@mui/material";
import type { AppBarProps } from "@mui/material";
import classNames from "classnames";
import { Link } from "react-router";
import type { ReactNode } from "react";
import { ShatranjLogo } from "@/components/constants";
import "./appbar.scss";

interface IAppBarProps extends AppBarProps {
    customClass?: string;
    toolbarClass?: string;
    bottomSlot?: ReactNode;
}

export default function AppBar({
    customClass,
    toolbarClass,
    children,
    bottomSlot,
    ...props
}: IAppBarProps) {
    const classes = classNames("appbar", customClass);
    const toolbarClasses = classNames("toolbar", toolbarClass);

    return (
        <MuiAppBar {...props} className={classes} position="static">
            <Toolbar className={toolbarClasses}>
                <Link to="/play" className="appbar-brand" title="Go to Play">
                    <ShatranjLogo showText size={30} />
                </Link>
                {children}
            </Toolbar>
            {bottomSlot}
        </MuiAppBar>
    );
}
