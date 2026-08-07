import { InputLabel } from "@mui/material";
import type { InputLabelProps } from "@mui/material";
import classNames from "classnames";

interface ILabelProps extends InputLabelProps {
    customClass?: string;
}

export default function Label({ customClass, ...props }: ILabelProps) {
    const classes = classNames("label", customClass);
    return <InputLabel {...props} className={classes} />;
}
