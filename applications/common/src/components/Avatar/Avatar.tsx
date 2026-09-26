import { Avatar as MuiAvatar } from "@mui/material";
import type { AvatarProps } from "@mui/material";
import classNames from "classnames";
import "./avatar.scss";

interface IAvatarProps extends AvatarProps {
    letter: string;
    customClass?: string;
}

export function CustomAvatar({ letter, customClass, ...props }: IAvatarProps) {
    return (
        <MuiAvatar {...props} className={classNames("common-avatar", customClass)} alt={letter}>
            {letter}
        </MuiAvatar>
    );
}

export default CustomAvatar;
