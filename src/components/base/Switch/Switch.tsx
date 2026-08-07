import { Switch as MuiSwitch } from "@mui/material";
import type { SwitchProps } from "@mui/material";
import classNames from "classnames";

interface ISwitchProps extends SwitchProps {
    customClass?: string;
}

export default function Switch({ customClass, ...props }: ISwitchProps) {
    const classes = classNames("switch", customClass);
    return <MuiSwitch {...props} className={classes} />;
}
