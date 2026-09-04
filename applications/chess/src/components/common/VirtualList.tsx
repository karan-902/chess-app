import { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import type { VirtuosoProps } from "react-virtuoso";

export default function VirtualList<ItemData = unknown, Context = unknown>(
    props: Omit<VirtuosoProps<ItemData, Context>, "customScrollParent">,
) {
    const [scrollParent, setScrollParent] = useState<HTMLElement | null>(
        null,
    );
    useEffect(() => {
        setScrollParent(document.querySelector<HTMLElement>(".app-content"));
    }, []);

    return (
        <Virtuoso customScrollParent={scrollParent ?? undefined} {...props} />
    );
}
