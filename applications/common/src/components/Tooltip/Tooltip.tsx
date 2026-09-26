import { Tooltip as MuiTooltip } from "@mui/material";
import type { TooltipProps } from "@mui/material";
import classNames from "classnames";
import "./tooltip.scss";

interface ITooltipProps extends TooltipProps {
    customClass?: string;
}

export function CustomTooltip({ customClass, ...props }: ITooltipProps) {
    return (
        <MuiTooltip
            {...props}
            classes={{
                popper: "common-tooltip",
                tooltip: classNames("tooltip-content", customClass),
            }}
        />
    );
}

export default CustomTooltip;
