import { useLayoutEffect, useRef, useState } from "react";
import classNames from "classnames";
import Box from "@/components/base/Box/Box";
import Button from "@/components/base/Button/Button";
import Text from "@/components/base/Text/Text";
import type { IChipSelectProps } from "@/types/components";

export default function ChipSelect<T extends string>({
    options,
    value,
    onChange,
    label,
    subLabel,
    customClass = "segment",
}: IChipSelectProps<T>) {
    const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const [thumb, setThumb] = useState({ left: 0, width: 0 });

    useLayoutEffect(() => {
        const btn = btnRefs.current[options.indexOf(value)];
        if (!btn) return;
        setThumb({ left: btn.offsetLeft, width: btn.offsetWidth });
    }, [value, options]);

    return (
        <Box customClass={customClass}>
            <Box
                customClass="segment-thumb"
                style={{
                    width: thumb.width,
                    transform: `translateX(${thumb.left}px)`,
                }}
            />
            {options.map((option, i) => (
                <Button
                    key={option}
                    ref={(el) => {
                        btnRefs.current[i] = el;
                    }}
                    type="button"
                    customClass={classNames(
                        "segment-btn",
                        value === option && "active",
                    )}
                    onClick={() => onChange(option)}
                >
                    <Text component="span" customClass="segment-btn-label">
                        {label(option)}
                    </Text>
                    {subLabel && (
                        <Text component="span" customClass="segment-btn-sub caption">
                            {subLabel(option)}
                        </Text>
                    )}
                </Button>
            ))}
        </Box>
    );
}
