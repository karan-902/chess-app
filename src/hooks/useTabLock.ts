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
        const storageKey = `kg_primary:${gameId}`;
        const channelName = `kg_game:${gameId}`;
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

        // ── BroadcastChannel ─────────────────────────────────────────────────
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
        } catch {
            // BroadcastChannel unavailable — fall back to localStorage-only
        }

        // ── Heartbeat — keeps our claim alive (primary) ──────────────────────
        // Secondary tabs also run the interval but do a no-op since the entry
        // won't start with their myId.
        const interval = setInterval(() => {
            const current = localStorage.getItem(storageKey);
            if (current?.startsWith(myId)) {
                localStorage.setItem(storageKey, `${myId}:${Date.now()}`);
            }
        }, 2000);
        heartbeatRef.current = interval;

        // ── Auto-promote when primary tab closes ─────────────────────────────
        const onStorage = (e: StorageEvent) => {
            if (e.key !== storageKey) return;
            if (e.newValue === null) {
                // Primary tab removed the entry — try to claim.
                localStorage.setItem(storageKey, `${myId}:${Date.now()}`);
                setStatus("primary");
            }
        };
        window.addEventListener("storage", onStorage);

        return () => {
            clearInterval(interval);
            heartbeatRef.current = null;
            window.removeEventListener("storage", onStorage);

            // Release claim only if we still own it
            const current = localStorage.getItem(storageKey);
            if (current?.startsWith(myId)) {
                localStorage.removeItem(storageKey);
            }

            bc?.close();
            bcRef.current = null;
        };
    }, [gameId, mode, myId]);

    /** Secondary tab clicks "Take Over" — claim primary on frontend side.
     *  Caller must also emit `rejoin_game` to promote this socket on the backend. */
    const takeOver = useCallback(() => {
        if (!gameId) return;
        const storageKey = `kg_primary:${gameId}`;
        localStorage.setItem(storageKey, `${myId}:${Date.now()}`);

        try {
            const bc = new BroadcastChannel(`kg_game:${gameId}`);
            bc.postMessage({ type: "takeover", tabId: myId });
            bc.close();
        } catch {
            /* ignore */
        }

        setStatus("primary");
    }, [gameId, myId]);

    /** Called when the backend fires `tab_superseded` on this socket. */
    const notifySuperseded = useCallback(() => setStatus("superseded"), []);

    return { tabLockStatus: status, takeOver, notifySuperseded };
}
