import { Tabs as MuiTabs, Tab as MuiTab } from "@mui/material";
import type { TabsProps, TabProps } from "@mui/material";
import classNames from "classnames";
import "./tabs.scss";

interface ITabsProps extends TabsProps {
    customClass?: string;
}
interface ITabProps extends TabProps {
    customClass?: string;
}

export function CustomTabs({ customClass, ...props }: ITabsProps) {
    const classes = classNames("tabs", customClass);
    return <MuiTabs {...props} className={classes} />;
}

export function CustomTab({ customClass, ...props }: ITabProps) {
    const classes = classNames("tab", customClass);
    return <MuiTab {...props} className={classes} />;
}
