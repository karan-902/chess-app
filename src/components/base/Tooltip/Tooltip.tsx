import { Tooltip as MuiTooltip } from "@mui/material";
import type { TooltipProps } from "@mui/material";
import classNames from "classnames";
import "./tooltip.scss";

interface ITooltipProps extends TooltipProps {
    customClass?: string;
}

export default function Tooltip({
    customClass,

    ...props
}: ITooltipProps) {
    return (
        <MuiTooltip
            {...props}
            classes={{
                popper: "popper",
                tooltip: classNames("tooltip", customClass),
            }}
        />
    );
}
