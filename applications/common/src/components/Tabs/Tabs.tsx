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
    return <MuiTabs {...props} className={classNames("common-tabs", customClass)} />;
}

export function CustomTab({ customClass, ...props }: ITabProps) {
    return <MuiTab {...props} className={classNames("common-tab", customClass)} />;
}
