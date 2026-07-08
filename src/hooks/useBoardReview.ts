import { useState, useEffect } from "react";

export function useBoardReview(fenHistory: string[]) {
    const [viewIndex, setViewIndex] = useState<number | null>(null);

    // Jump back to live position whenever a new move arrives
    useEffect(() => { setViewIndex(null); }, [fenHistory.length]);

    const goBack = () =>
        setViewIndex(v => Math.max(0, (v ?? fenHistory.length - 1) - 1));

    const goForward = () =>
        setViewIndex(v => {
            if (v === null) return null;
            const next = v + 1;
            return next >= fenHistory.length - 1 ? null : next;
        });

    const jumpTo = (i: number) =>
        setViewIndex(i >= fenHistory.length - 1 ? null : i);

    const isReviewing = viewIndex !== null && viewIndex < fenHistory.length - 1;
    const displayFen = viewIndex !== null
        ? fenHistory[viewIndex]
        : fenHistory[fenHistory.length - 1];

    return { viewIndex, isReviewing, displayFen, goBack, goForward, jumpTo };
}
