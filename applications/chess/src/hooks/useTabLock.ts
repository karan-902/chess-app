import { useState, useEffect, useRef, useCallback } from "react";

export type TabLockStatus = "primary" | "secondary" | "superseded";

export function useTabLock(gameId: string | undefined, mode: string) {
    const [status, setStatus] = useState<TabLockStatus>("primary");

    const myId = useRef(
        `${Date.now()}_${Math.random().toString(36).slice(2)}`,
    ).current;
    const bcRef = useRef<BroadcastChannel | null>(null);
    const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (mode !== "pvp" || !gameId) return;
        const storageKey = `sj_primary:${gameId}`;
        const channelName = `sj_game:${gameId}`;
        const existing = localStorage.getItem(storageKey);
        const isSecondary =
            !!existing &&
            !existing.startsWith(myId) &&
            Date.now() - Number(existing.split(":")[1] ?? 0) < 4000;

        if (isSecondary) {
            setStatus("secondary");
        } else {
            localStorage.setItem(storageKey, `${myId}:${Date.now()}`);
            setStatus("primary");
        }

        let bc: BroadcastChannel | null = null;
        try {
            bc = new BroadcastChannel(channelName);
            bcRef.current = bc;

            bc.onmessage = (e: MessageEvent) => {
                if (e.data?.tabId === myId) return;
                if (e.data?.type === "takeover") {
                    setStatus("superseded");
                }
            };
        } catch {}

        const interval = setInterval(() => {
            const current = localStorage.getItem(storageKey);
            if (current?.startsWith(myId)) {
                localStorage.setItem(storageKey, `${myId}:${Date.now()}`);
            }
        }, 2000);
        heartbeatRef.current = interval;

        const onStorage = (e: StorageEvent) => {
            if (e.key !== storageKey) return;
            if (e.newValue === null) {
                localStorage.setItem(storageKey, `${myId}:${Date.now()}`);
                setStatus("primary");
            }
        };
        window.addEventListener("storage", onStorage);

        return () => {
            clearInterval(interval);
            heartbeatRef.current = null;
            window.removeEventListener("storage", onStorage);

            const current = localStorage.getItem(storageKey);
            if (current?.startsWith(myId)) {
                localStorage.removeItem(storageKey);
            }

            bc?.close();
            bcRef.current = null;
        };
    }, [gameId, mode, myId]);

    const takeOver = useCallback(() => {
        if (!gameId) return;
        const storageKey = `sj_primary:${gameId}`;
        localStorage.setItem(storageKey, `${myId}:${Date.now()}`);

        try {
            const bc = new BroadcastChannel(`sj_game:${gameId}`);
            bc.postMessage({ type: "takeover", tabId: myId });
            bc.close();
        } catch {}

        setStatus("primary");
    }, [gameId, myId]);

    const notifySuperseded = useCallback(() => setStatus("superseded"), []);

    return { tabLockStatus: status, takeOver, notifySuperseded };
}
