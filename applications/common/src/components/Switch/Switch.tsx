import { Switch as MuiSwitch } from "@mui/material";
import type { SwitchProps } from "@mui/material";
import classNames from "classnames";
import "./switch.scss";

interface ISwitchProps extends SwitchProps {
 customClass?: string;
}

export function CustomSwitch({ customClass, ...props }: ISwitchProps) {
 return (
  <MuiSwitch {...props} className={classNames("common-switch", customClass)} />
 );
}

export default CustomSwitch;
