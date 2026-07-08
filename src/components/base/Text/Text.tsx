import clsx from "clsx";
import "./text.scss";

type TextFont = "inter" | "outfit" | "mono" | "rajdhani";
type TextColor =
    | "primary"
    | "muted"
    | "accent"
    | "white"
    | "danger"
    | "default";
type TextTag = "span" | "p" | "div" | "h1" | "h2" | "h3" | "h4" | "label";
type TextSize =
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 16
    | 18
    | 20
    | 22
    | 24
    | 28
    | 32
    | 36;
type TextWeight = 300 | 400 | 500 | 600 | 700 | 800;

interface ITextProps {
    children?: React.ReactNode;
    font?: TextFont;
    size?: TextSize;
    weight?: TextWeight;
    color?: TextColor;
    customClass?: string;
    className?: string;
    as?: TextTag;
    width?: string | number;
    height?: string | number;
    uppercase?: boolean;
    truncate?: boolean;
}

function Text({
    children,
    font,
    size,
    weight,
    color,
    customClass,
    className,
    as: Tag = "p",
    width,
    height,
    uppercase,
    truncate,
}: ITextProps) {
    const style: React.CSSProperties = {};
    if (width !== undefined)
        style.width = typeof width === "number" ? `${width}px` : width;
    if (height !== undefined)
        style.height = typeof height === "number" ? `${height}px` : height;

    return (
        <Tag
            className={clsx(
                "text",
                font && `font-${font}`,
                size && `size-${size}`,
                weight && `w-${weight}`,
                color && color !== "default" && `color-${color}`,
                uppercase && "uppercase",
                truncate && "truncate",
                customClass,
                className,
            )}
            style={Object.keys(style).length ? style : undefined}
        >
            {children}
        </Tag>
    );
}

export default Text;
