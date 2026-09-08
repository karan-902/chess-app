import { forwardRef } from "react";
import { Chip as MuiChip } from "@mui/material";
import type { ChipProps } from "@mui/material";
import classNames from "classnames";
import "./chip.scss";

interface IChipProps extends ChipProps {
    customClass?: string;
}

const Chip = forwardRef<HTMLDivElement, IChipProps>(function Chip(
    { customClass, ...props },
    ref,
) {
    const classes = classNames("chip", customClass);
    return <MuiChip ref={ref} {...props} className={classes} />;
});

export default Chip;
