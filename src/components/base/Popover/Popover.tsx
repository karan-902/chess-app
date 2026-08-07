import { Popover as MuiPopover } from "@mui/material";
import type { PopoverProps } from "@mui/material";
import classNames from "classnames";
import Box from "../Box/Box";
import "./popover.scss";

interface IPopoverProps extends PopoverProps {
    customClass?: string;
}

export default function Popover({
    customClass,
    open,
    children,
    ...props
}: IPopoverProps) {
    const classes = classNames("popover", customClass);
    return (
        <MuiPopover {...props} className={classes} open={open}>
            <Box>{children}</Box>
        </MuiPopover>
    );
}
