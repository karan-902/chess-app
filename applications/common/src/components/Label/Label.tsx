import { InputLabel } from "@mui/material";
import type { InputLabelProps } from "@mui/material";
import classNames from "classnames";
import "./label.scss";
interface ILabelProps extends InputLabelProps {
 customClass?: string;
}

export function CustomLabel({ customClass, ...props }: ILabelProps) {
 return (
  <InputLabel {...props} className={classNames("common-label", customClass)} />
 );
}

export default CustomLabel;
