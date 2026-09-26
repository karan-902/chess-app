import { Badge as MuiBadge } from "@mui/material";
import type { BadgeProps } from "@mui/material";
import classNames from "classnames";
import "./badge.scss";

interface IBadgeProps extends BadgeProps {
    customClass?: string;
}

export function CustomBadge({ customClass, ...props }: IBadgeProps) {
    const classes = classNames("badge", customClass);
    return <MuiBadge {...props} className={classes} />;
}

export default CustomBadge;
