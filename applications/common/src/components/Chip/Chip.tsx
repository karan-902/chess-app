import { forwardRef } from "react";
import { Chip as MuiChip } from "@mui/material";
import type { ChipProps } from "@mui/material";
import classNames from "classnames";
import "./chip.scss";

interface IChipProps extends ChipProps {
    customClass?: string;
}

export const CustomChip = forwardRef<HTMLDivElement, IChipProps>(function CustomChip(
    { customClass, ...props },
    ref,
) {
    const classes = classNames("chip", customClass);
    return <MuiChip ref={ref} {...props} className={classes} />;
});

export default CustomChip;
