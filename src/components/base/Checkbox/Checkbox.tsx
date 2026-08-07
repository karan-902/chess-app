import { Checkbox as MuiCheckbox } from "@mui/material";
import type { CheckboxProps } from "@mui/material";
import classNames from "classnames";

interface ICheckboxProps extends CheckboxProps {
    customClass?: string;
}

export default function Checkbox({ customClass, ...props }: ICheckboxProps) {
    const classes = classNames("checkbox", customClass);
    return <MuiCheckbox {...props} className={classes} />;
}
