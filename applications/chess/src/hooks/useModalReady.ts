import { useEffect, useState } from "react";

export function useModalReady(open: boolean) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!open) {
            setReady(false);
            return;
        }
        const timer = setTimeout(() => setReady(true), 1000);
        return () => clearTimeout(timer);
    }, [open]);

    return ready;
}
