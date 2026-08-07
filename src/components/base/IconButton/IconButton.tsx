import { forwardRef } from "react";
import { IconButton as MuiIconButton } from "@mui/material";
import type { IconButtonProps } from "@mui/material";
import classNames from "classnames";
import "./iconbutton.scss";

interface IIconButtonProps extends IconButtonProps {
    customClass?: string;
}

const IconButton = forwardRef<HTMLButtonElement, IIconButtonProps>(
    ({ customClass, children, ...props }, ref) => {
        const classes = classNames("icon-button", customClass);

        return (
            <MuiIconButton ref={ref} {...props} className={classes}>
                {children}
            </MuiIconButton>
        );
    },
);

IconButton.displayName = "IconButton";

export default IconButton;
