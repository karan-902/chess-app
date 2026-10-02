import { forwardRef } from "react";
import "./box.scss";
import { Box as MuiBox } from "@mui/material";
import type { BoxProps } from "@mui/material";
import classNames from "classnames";

interface IBoxProps extends BoxProps {
 customClass?: string;
}

export const Box = forwardRef<HTMLDivElement, IBoxProps>(
 ({ customClass, ...props }, ref) => (
  <MuiBox
   ref={ref}
   {...props}
   className={classNames("common-box", customClass)}
  />
 ),
);

Box.displayName = "Box";

export default Box;
