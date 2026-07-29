import clsx from "clsx";
import * as RadixAvatar from "@radix-ui/react-avatar";
import "./avatar.scss";

interface IAvatarProps {
    letter: string;
    src?: string;
    variant?: "primary" | "danger" | "neutral";
    size?: "sm" | "md" | "lg";
    ringColor?: string;
    online?: boolean;
    className?: string;
    customClass?: string;
}

function Avatar({
    letter,
    src,
    variant = "primary",
    size = "md",
    ringColor,
    online,
    className,
    customClass,
}: IAvatarProps) {
    return (
        <span
            className={clsx(
                "common-avatar",
                ringColor && "common-avatar--ringed",
            )}
            style={
                ringColor
                    ? ({
                          "--avatar-ring-color": ringColor,
                      } as React.CSSProperties)
                    : undefined
            }
        >
            <RadixAvatar.Root
                className={clsx(
                    "avatar",
                    variant,
                    size,
                    customClass,
                    className,
                )}
            >
                {src && (
                    <RadixAvatar.Image
                        src={src}
                        alt={letter}
                        className="avatar-image"
                    />
                )}
                <RadixAvatar.Fallback
                    className="avatar-fallback"
                    delayMs={src ? 300 : 0}
                >
                    {letter}
                </RadixAvatar.Fallback>
            </RadixAvatar.Root>
            {online && <span className="avatar-status-dot" />}
        </span>
    );
}

export default Avatar;
