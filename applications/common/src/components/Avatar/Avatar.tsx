import { Avatar as MuiAvatar } from "@mui/material";
import type { AvatarProps } from "@mui/material";
import classNames from "classnames";
import "./avatar.scss";

interface IAvatarProps extends AvatarProps {
    letter: string;
    customClass?: string;
    online?: boolean;
}

export default function Avatar({
    letter,
    src,
    online,
    customClass,
    ...props
}: IAvatarProps) {
    const classes = classNames("avatar", customClass);
    return (
        <span className="avatar-wrap">
            <MuiAvatar {...props} className={classes} src={src} alt={letter}>
                {letter}
            </MuiAvatar>
            {online && <span className="avatar-status-dot" />}
        </span>
    );
}
