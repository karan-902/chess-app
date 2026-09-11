import { forwardRef } from "react";
import "./box.scss";
import { Box as MuiBox } from "@mui/material";
import type { BoxProps } from "@mui/material";
import classNames from "classnames";

interface IBoxProps extends BoxProps {
    customClass?: string;
}

const Box = forwardRef<HTMLDivElement, IBoxProps>(
    ({ customClass, ...props }, ref) => {
        const classes = classNames("box", customClass);
        return (
            <MuiBox ref={ref} {...props} className={classes}>
                {props.children}
            </MuiBox>
        );
    },
);

Box.displayName = "Box";

export default Box;
