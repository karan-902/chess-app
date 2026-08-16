import { useState, useEffect, useRef, useCallback } from "react";
import type { TimeControl } from "@/types/components";
import { TIME_SECONDS } from "@/types/components";
import type { GameCategory } from "@/types/types";

type Anchor = { turn: "w" | "b"; at: number; whiteMs: number; blackMs: number };

export function useGameClock(
    timeControl: TimeControl,
    paused: boolean,
    turn: "w" | "b",
) {
    const startingMs =
        TIME_SECONDS[timeControl.toUpperCase() as GameCategory] * 1000;

    const anchorRef = useRef<Anchor>({
        turn,
        at: Date.now(),
        whiteMs: startingMs,
        blackMs: startingMs,
    });
    const [whiteMs, setWhiteMs] = useState(startingMs);
    const [blackMs, setBlackMs] = useState(startingMs);
    const [timedOut, setTimedOut] = useState<"w" | "b" | null>(null);
    const [elapsed, setElapsed] = useState(0);
    const timedOutRef = useRef<"w" | "b" | null>(null);

    const snapshot = useCallback(() => {
        const { turn: t, at, whiteMs: w0, blackMs: b0 } = anchorRef.current;
        const elapsedMs = Date.now() - at;
        return {
            w: t === "w" ? Math.max(0, w0 - elapsedMs) : w0,
            b: t === "b" ? Math.max(0, b0 - elapsedMs) : b0,
        };
    }, []);

    useEffect(() => {
        const { w, b } = snapshot();
        anchorRef.current = { turn, at: Date.now(), whiteMs: w, blackMs: b };
        setWhiteMs(w);
        setBlackMs(b);
    }, [turn, snapshot]);

    useEffect(() => {
        if (paused) return;
        const id = setInterval(() => setElapsed((s) => s + 1), 1000);
        return () => clearInterval(id);
    }, [paused]);

    useEffect(() => {
        if (paused) return;
        const id = setInterval(() => {
            if (timedOutRef.current) return;
            const { w, b } = snapshot();
            setWhiteMs(w);
            setBlackMs(b);
            if (w === 0 && anchorRef.current.turn === "w") {
                timedOutRef.current = "w";
                setTimedOut("w");
            } else if (b === 0 && anchorRef.current.turn === "b") {
                timedOutRef.current = "b";
                setTimedOut("b");
            }
        }, 1000);
        return () => clearInterval(id);
    }, [paused, snapshot]);

    const reset = useCallback(() => {
        anchorRef.current = {
            turn,
            at: Date.now(),
            whiteMs: startingMs,
            blackMs: startingMs,
        };
        setWhiteMs(startingMs);
        setBlackMs(startingMs);
        setTimedOut(null);
        setElapsed(0);
        timedOutRef.current = null;
    }, [startingMs, turn]);

    const syncClock = useCallback(
        (whiteRemainingMs: number, blackRemainingMs: number) => {
            anchorRef.current = {
                turn: anchorRef.current.turn,
                at: Date.now(),
                whiteMs: whiteRemainingMs,
                blackMs: blackRemainingMs,
            };
            setWhiteMs(whiteRemainingMs);
            setBlackMs(blackRemainingMs);
            setTimedOut(null);
            timedOutRef.current = null;
        },
        [],
    );

    const fmt = (ms: number) => {
        const s = Math.max(0, Math.floor(ms / 1000));
        return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    };
    const fmtElapsed = (s: number) => {
        const m = Math.floor(s / 60);
        return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
    };

    return {
        whiteTimer: fmt(whiteMs),
        blackTimer: fmt(blackMs),
        whiteTimeMs: whiteMs,
        blackTimeMs: blackMs,
        timedOut,
        elapsedFormatted: fmtElapsed(elapsed),
        reset,
        syncClock,
    };
}
