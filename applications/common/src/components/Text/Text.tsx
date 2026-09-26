import { Typography } from "@mui/material";
import type { TypographyProps } from "@mui/material";
import classNames from "classnames";
import "./text.scss";

interface ITextProps extends TypographyProps {
    customClass?: string;
    uppercase?: boolean;
}

export function Text({
    customClass,
    uppercase,
    ...props
}: ITextProps) {
    return (
        <Typography
            {...props}
            className={classNames("common-text", uppercase && "uppercase", customClass)}
        />
    );
}

export default Text;
