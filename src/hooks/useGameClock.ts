import { useState, useEffect, useRef } from "react";
import type { TimeControl } from "@/types/components";
import { TIME_SECONDS } from "@/types/components";

export function useGameClock(timeControl: TimeControl, paused: boolean, turn: "w" | "b") {
    const [whiteTime, setWhiteTime] = useState(TIME_SECONDS[timeControl]);
    const [blackTime, setBlackTime] = useState(TIME_SECONDS[timeControl]);
    const [timedOut, setTimedOut] = useState<"w" | "b" | null>(null);
    const [elapsed, setElapsed] = useState(0);

    const turnRef = useRef(turn);
    const timedOutRef = useRef<"w" | "b" | null>(null);

    useEffect(() => { turnRef.current = turn; }, [turn]);

    // Total elapsed game time
    useEffect(() => {
        if (paused) return;
        const id = setInterval(() => setElapsed(s => s + 1), 1000);
        return () => clearInterval(id);
    }, [paused]);

    // Per-player countdown — self-terminates when a player times out
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

    const reset = () => {
        setWhiteTime(TIME_SECONDS[timeControl]);
        setBlackTime(TIME_SECONDS[timeControl]);
        setTimedOut(null);
        setElapsed(0);
        timedOutRef.current = null;
    };

    // Re-syncs the visual clock to the server's authoritative values (pvp
    // `clock_update`, sent on every move). The local per-second countdown
    // above is just interpolation between syncs — this corrects any drift
    // and, since a fresh sync only ever arrives while the game is still
    // ongoing, also clears any locally-guessed timedOut state.
    const syncClock = (whiteMs: number, blackMs: number) => {
        setWhiteTime(Math.round(whiteMs / 1000));
        setBlackTime(Math.round(blackMs / 1000));
        setTimedOut(null);
        timedOutRef.current = null;
    };

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
