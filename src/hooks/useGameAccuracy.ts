import { useEffect, useRef, useState } from "react";

const ANALYSIS_DEPTH = 10;

// Converts a UCI "score mate N" into a large-magnitude centipawn number so it
// sorts/subtracts correctly alongside real "score cp" values.
function mateToCp(n: number): number {
    return n > 0 ? 100000 - n * 100 : -100000 - n * 100;
}

function parseScore(line: string): number | null {
    const mate = line.match(/score mate (-?\d+)/);
    if (mate) return mateToCp(parseInt(mate[1], 10));
    const cp = line.match(/score cp (-?\d+)/);
    if (cp) return parseInt(cp[1], 10);
    return null;
}

// chess.com-style centipawn-loss -> accuracy curve, clamped to [0, 100].
function cplToAccuracy(cpl: number): number {
    const raw = 103.1668 * Math.exp(-0.04354 * cpl) - 3.1669;
    return Math.max(0, Math.min(100, raw));
}

async function evaluatePosition(engine: Worker, fen: string): Promise<number> {
    return new Promise((resolve) => {
        let lastScore = 0;
        const onMessage = (e: MessageEvent) => {
            const message = e.data as string;
            const score = parseScore(message);
            if (score !== null) lastScore = score;
            if (message.startsWith("bestmove")) {
                engine.removeEventListener("message", onMessage);
                resolve(lastScore);
            }
        };
        engine.addEventListener("message", onMessage);
        engine.postMessage(`position fen ${fen}`);
        engine.postMessage(`go depth ${ANALYSIS_DEPTH}`);
    });
}

// Post-game accuracy analysis: replays fenHistory through a dedicated
// Stockfish worker (separate from the live opponent-move engine) to compute
// the player's own centipawn loss per move, chess.com-style. Runs once,
// triggered when `enabled` flips true (i.e. when the game ends).
export function useGameAccuracy(
    fenHistory: string[],
    playerSide: "w" | "b",
    enabled: boolean,
) {
    const [accuracy, setAccuracy] = useState<number | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const ranRef = useRef(false);

    useEffect(() => {
        if (!enabled || ranRef.current || fenHistory.length < 2) return;
        ranRef.current = true;
        setAnalyzing(true);

        const engine = new Worker("/stockfish/stockfish-18-lite-single.js");
        let cancelled = false;

        (async () => {
            engine.postMessage("uci");
            engine.postMessage("isready");

            const scores: number[] = [];
            for (const fen of fenHistory) {
                if (cancelled) return;
                scores.push(await evaluatePosition(engine, fen));
            }

            const losses: number[] = [];
            for (let ply = 0; ply < fenHistory.length - 1; ply++) {
                const mover = ply % 2 === 0 ? "w" : "b";
                if (mover !== playerSide) continue;
                const bestBefore = scores[ply];
                const actualAfter = -scores[ply + 1];
                losses.push(Math.max(0, bestBefore - actualAfter));
            }

            if (cancelled) return;
            if (losses.length === 0) {
                setAccuracy(null);
            } else {
                const avgAccuracy =
                    losses.reduce((sum, cpl) => sum + cplToAccuracy(cpl), 0) / losses.length;
                setAccuracy(Math.round(avgAccuracy));
            }
            setAnalyzing(false);
        })();

        return () => {
            cancelled = true;
            engine.terminate();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled]);

    return { accuracy, analyzing };
}
