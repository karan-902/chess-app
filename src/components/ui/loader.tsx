"use client";
import { cn } from "@/lib/utils";

export const LoaderTwo = ({
    className,
    color = "#f0b90b",
}: {
    className?: string;
    color?: string;
}) => {
    return (
        <div
            className={cn(
                "flex items-center justify-center gap-[3px]",
                className,
            )}
        >
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className="inline-block h-[3.5px] w-[3.5px] rounded-full"
                    style={{
                        backgroundColor: color,
                        animation: `ace-bounce 0.6s ease-in-out ${i * 0.15}s infinite`,
                    }}
                />
            ))}
        </div>
    );
};
