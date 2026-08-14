import { useState, useEffect, useRef, useCallback } from "react";
import type { TimeControl } from "@/types/components";
import { TIME_SECONDS } from "@/types/components";
import type { GameCategory } from "@/types/types";

export function useGameClock(timeControl: TimeControl, paused: boolean, turn: "w" | "b") {
    const startingSeconds =
        TIME_SECONDS[timeControl.toUpperCase() as GameCategory];
    const [whiteTime, setWhiteTime] = useState(startingSeconds);
    const [blackTime, setBlackTime] = useState(startingSeconds);
    const [timedOut, setTimedOut] = useState<"w" | "b" | null>(null);
    const [elapsed, setElapsed] = useState(0);

    const turnRef = useRef(turn);
    const timedOutRef = useRef<"w" | "b" | null>(null);

    useEffect(() => { turnRef.current = turn; }, [turn]);

    useEffect(() => {
        if (paused) return;
        const id = setInterval(() => setElapsed(s => s + 1), 1000);
        return () => clearInterval(id);
    }, [paused]);

    useEffect(() => {
        if (paused) return;
        const id = setInterval(() => {
            if (timedOutRef.current) { clearInterval(id); return; }
            if (turnRef.current === "w") {
                setWhiteTime(t => {
                    if (t <= 1) { timedOutRef.current = "w"; setTimedOut("w"); return 0; }
                    return t - 1;
                });
            } else {
                setBlackTime(t => {
                    if (t <= 1) { timedOutRef.current = "b"; setTimedOut("b"); return 0; }
                    return t - 1;
                });
            }
        }, 1000);
        return () => clearInterval(id);
    }, [paused]);

    const reset = useCallback(() => {
        setWhiteTime(startingSeconds);
        setBlackTime(startingSeconds);
        setTimedOut(null);
        setElapsed(0);
        timedOutRef.current = null;
    }, [startingSeconds]);

    const syncClock = useCallback((whiteMs: number, blackMs: number) => {
        setWhiteTime(Math.round(whiteMs / 1000));
        setBlackTime(Math.round(blackMs / 1000));
        setTimedOut(null);
        timedOutRef.current = null;
    }, []);

    const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    const fmtElapsed = (s: number) => {
        const m = Math.floor(s / 60);
        return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
    };

    return {
        whiteTimer: fmt(whiteTime),
        blackTimer: fmt(blackTime),
        timedOut,
        elapsedFormatted: fmtElapsed(elapsed),
        reset,
        syncClock,
    };
}
