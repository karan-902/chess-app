import { Badge as MuiBadge } from "@mui/material";
import type { BadgeProps } from "@mui/material";
import classNames from "classnames";
import "./badge.scss";

interface IBadgeProps extends BadgeProps {
    customClass?: string;
}

export function CustomBadge({ customClass, ...props }: IBadgeProps) {
    return <MuiBadge {...props} className={classNames("common-badge", customClass)} />;
}

export default CustomBadge;
