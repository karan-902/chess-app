import { Skeleton as MuiSkeleton } from "@mui/material";
import type { SkeletonProps } from "@mui/material";
import classNames from "classnames";
import "./skeleton.scss";

interface ISkeletonProps extends SkeletonProps {
    customClass?: string;
}

export function Skeleton({ customClass, ...props }: ISkeletonProps) {
    return <MuiSkeleton {...props} className={classNames("common-skeleton", customClass)} />;
}

export default Skeleton;
