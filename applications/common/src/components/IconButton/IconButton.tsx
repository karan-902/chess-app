import { forwardRef } from "react";
import { IconButton as MuiIconButton } from "@mui/material";
import type { IconButtonProps } from "@mui/material";
import classNames from "classnames";
import { icons, type TIconName } from "../images";
import "./icon-button.scss";

interface IIconButtonProps extends Omit<IconButtonProps, "children"> {
    customClass?: string;
    icon: TIconName;
}

export const CustomIconButton = forwardRef<HTMLButtonElement, IIconButtonProps>(
    ({ customClass, icon, ...props }, ref) => {
        const Icon = icons[icon];
        return (
            <MuiIconButton ref={ref} {...props} className={classNames("common-icon-button", customClass)}>
                <Icon />
            </MuiIconButton>
        );
    },
);

CustomIconButton.displayName = "CustomIconButton";

export default CustomIconButton;
