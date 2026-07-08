import { useEffect, useRef, useState } from "react";

export function useStockfish(
    fen: string,
    depth: number = 10,
    enabled: boolean = true,
    elo?: number,
    skillLevel?: number,
) {
    const engineRef = useRef<Worker | null>(null);
    const [bestMove, setBestMove] = useState<string | null>(null);

    useEffect(() => {
        const engine = new Worker("/stockfish/stockfish-18-lite-single.js");
        engineRef.current = engine;
        engine.postMessage("uci");
        engine.postMessage("isready");
        engine.onmessage = (e: MessageEvent) => {
            const message = e.data as string;
            if (message.startsWith("bestmove")) {
                const move = message.split(" ")[1];
                setBestMove(move);
            }
        };
        return () => engine.terminate();
    }, []);

    useEffect(() => {
        if (!engineRef.current || !fen || !enabled) return;
        setBestMove(null);

        // Skill Level (0–20): makes Stockfish blunder intentionally — most effective for easy mode
        if (skillLevel !== undefined) {
            engineRef.current.postMessage(`setoption name Skill Level value ${skillLevel}`);
        } else {
            engineRef.current.postMessage("setoption name Skill Level value 20");
        }

        // ELO cap — secondary layer of weakness
        if (elo !== undefined) {
            engineRef.current.postMessage("setoption name UCI_LimitStrength value true");
            engineRef.current.postMessage(`setoption name UCI_Elo value ${elo}`);
        } else {
            engineRef.current.postMessage("setoption name UCI_LimitStrength value false");
        }

        engineRef.current.postMessage(`position fen ${fen}`);
        engineRef.current.postMessage(`go depth ${depth}`);
    }, [fen, depth, enabled, elo, skillLevel]);

    return { bestMove };
}
