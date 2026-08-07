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

export function Tabs({ customClass, ...props }: ITabsProps) {
    const classes = classNames("tabs", customClass);
    return <MuiTabs {...props} className={classes} />;
}

export function Tab({ customClass, ...props }: ITabProps) {
    const classes = classNames("tab", customClass);
    return <MuiTab {...props} className={classes} />;
}
