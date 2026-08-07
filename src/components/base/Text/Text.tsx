import { Typography } from "@mui/material";
import type { TypographyProps } from "@mui/material";
import classNames from "classnames";
import "./text.scss";

interface ITextProps extends TypographyProps {
    customClass?: string;
    uppercase?: boolean;
    truncate?: boolean;
}

export default function Text({
    customClass,
    uppercase,
    truncate,
    ...props
}: ITextProps) {
    const classes = classNames(
        "text",
        uppercase && "uppercase",
        truncate && "truncate",
        customClass,
    );
    return (
        <Typography {...props} className={classes}>
            {props.children}
        </Typography>
    );
}
