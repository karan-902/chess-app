import { Skeleton as MuiSkeleton } from "@mui/material";
import type { SkeletonProps } from "@mui/material";
import classNames from "classnames";
import "./skeleton.scss";

interface ISkeletonProps extends SkeletonProps {
    customClass?: string;
}

export default function Skeleton({ customClass, ...props }: ISkeletonProps) {
    const classes = classNames("skeleton", customClass);
    return <MuiSkeleton {...props} className={classes} />;
}
