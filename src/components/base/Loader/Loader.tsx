import clsx from "clsx";
import { LoaderIcon, Loader2Icon } from "lucide-react";

interface ILoaderProps {
    size?: number;
    color?: string;
    variant?: "burst" | "ring";
    customClass?: string;
}

function Loader({
    size = 16,
    color = "currentColor",
    variant = "ring",
    customClass,
}: ILoaderProps) {
    const Icon = variant === "burst" ? LoaderIcon : Loader2Icon;

    return (
        <Icon
            role="status"
            aria-label="Loading"
            size={size}
            color={color}
            className={clsx("animate-spin", customClass)}
        />
    );
}

export default Loader;
