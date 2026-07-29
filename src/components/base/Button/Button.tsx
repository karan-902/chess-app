import clsx from "clsx";
import Loader from "../Loader/Loader";
import "./button.scss";
import Text from "../Text/Text";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "ghost" | "outline" | "danger";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
    customClass?: string;
    children: React.ReactNode;
    width?: string | number;
    height?: string | number;
    isLoading?: boolean;
    loaderVariant?: "burst" | "ring";
}

function Button({
    variant = "primary",
    size = "md",
    fullWidth,
    customClass,
    className,
    children,
    width,
    height,
    isLoading,
    loaderVariant = "burst",
    disabled,
    ...props
}: IButtonProps) {
    const inlineStyle: React.CSSProperties = {};
    if (width !== undefined)
        inlineStyle.width = typeof width === "number" ? `${width}px` : width;
    if (height !== undefined)
        inlineStyle.height =
            typeof height === "number" ? `${height}px` : height;

    const isPrimary = variant === "primary";

    return (
        <button
            className={clsx(
                "common-button",
                variant,
                size,
                fullWidth && "full-width",
                isLoading && "btn--loading",
                customClass,
                className,
            )}
            style={Object.keys(inlineStyle).length ? inlineStyle : undefined}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <Loader
                    size={15}
                    color={isPrimary ? "#1a0f00" : "#f7931a"}
                    variant={loaderVariant}
                />
            ) : (
                <> {children}</>
            )}
        </button>
    );
}

export default Button;
