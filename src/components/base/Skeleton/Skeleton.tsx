import clsx from "clsx";
import "./skeleton.scss";

interface ISkeletonProps {
    variant?: "text" | "circle" | "rounded";
    width?: string | number;
    height?: string | number;
    className?: string;
    customClass?: string;
}

function Skeleton({
    variant = "text",
    width,
    height,
    className,
    customClass,
}: ISkeletonProps) {
    const style: React.CSSProperties = {};
    if (width !== undefined)
        style.width = typeof width === "number" ? `${width}px` : width;
    if (height !== undefined)
        style.height = typeof height === "number" ? `${height}px` : height;

    return (
        <span
            className={clsx("common-skeleton", variant, customClass, className)}
            style={style}
        />
    );
}

export default Skeleton;
