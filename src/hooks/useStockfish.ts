import { useEffect, useRef, useState } from "react";

export function useStockfish(
    fen: string,
    depth: number = 2,
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
            // console.log(message);
        };
        return () => engine.terminate();
    }, []);

    useEffect(() => {
        if (!engineRef.current || !fen || !enabled) return;
        setBestMove(null);

        if (skillLevel !== undefined) {
            engineRef.current.postMessage(
                `setoption name Skill Level value ${skillLevel}`,
            );
        } else {
            engineRef.current.postMessage(
                "setoption name Skill Level value 20",
            );
        }

        if (elo !== undefined) {
            engineRef.current.postMessage(
                "setoption name UCI_LimitStrength value true",
            );
            engineRef.current.postMessage(
                `setoption name UCI_Elo value ${elo}`,
            );
        } else {
            engineRef.current.postMessage(
                "setoption name UCI_LimitStrength value false",
            );
        }

        engineRef.current.postMessage(`position fen ${fen}`);

        engineRef.current.postMessage(`go depth ${depth} movetime 3000`);
    }, [fen, depth, enabled, elo, skillLevel]);

    return { bestMove };
}
