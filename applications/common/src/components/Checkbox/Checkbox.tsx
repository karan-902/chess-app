import { Checkbox as MuiCheckbox } from "@mui/material";
import type { CheckboxProps } from "@mui/material";
import classNames from "classnames";

interface ICheckboxProps extends CheckboxProps {
 customClass?: string;
}

export function CustomCheckbox({ customClass, ...props }: ICheckboxProps) {
 return (
  <MuiCheckbox
   {...props}
   className={classNames("common-checkbox", customClass)}
  />
 );
}

export default CustomCheckbox;
