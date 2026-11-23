import { forwardRef } from "react";
import { SvgIcon as MuiSvgIcon } from "@mui/material";
import type { SvgIconProps } from "@mui/material";
import classNames from "classnames";
import "./svg-icon.scss";

export interface ISvgIconProps extends Omit<SvgIconProps, "ref"> {
 customClass?: string;
 size?: number | string;
}

export const SvgIcon = forwardRef<SVGSVGElement, ISvgIconProps>(
 function SvgIcon({ customClass, className, size, style, ...props }, ref) {
  return (
   <MuiSvgIcon
    ref={ref}
    {...props}
    className={classNames(className, "common-svg-icon", customClass)}
    style={size === undefined ? style : { width: size, height: size, ...style }}
   />
  );
 },
);

export default SvgIcon;
