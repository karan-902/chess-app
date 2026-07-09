import { useState } from "react";
import { Chess } from "chess.js";
import type { Square } from "chess.js";
import type { MoveRecord } from "@/types/types";

export function useChessGame() {
    const [chess] = useState(() => new Chess());
    const [fen, setFen] = useState(() => chess.fen());
    const [fenHistory, setFenHistory] = useState<string[]>([chess.fen()]);
    const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
    const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

    // Returns { fen, promotion? } on success, null on invalid move
    const makeMove = (from: string, to: string, promotion = "q"): { fen: string; promotion?: string } | null => {
        try {
            const move = chess.move({ from, to, promotion });
            if (move) {
                setLastMove({ from, to });
                const newFen = chess.fen();
                setFen(newFen);
                setFenHistory(prev => [...prev, newFen]);
                const history = chess.history();
                const records: MoveRecord[] = [];
                for (let i = 0; i < history.length; i += 2) {
                    records.push({ n: i / 2 + 1, w: history[i], b: history[i + 1] ?? "" });
                }
                setMoveHistory(records);
                return { fen: newFen, promotion: move.promotion };
            }
            return null;
        } catch {
            return null;
        }
    };

    const restoreGame = (moves: Array<{ from: string; to: string; promotion: string | null }>) => {
        chess.reset();
        const fenHist = [chess.fen()];
        for (const m of moves) {
            chess.move({ from: m.from, to: m.to, promotion: m.promotion ?? "q" });
            fenHist.push(chess.fen());
        }
        const restoredFen = chess.fen();
        const history = chess.history();
        const records: MoveRecord[] = [];
        for (let i = 0; i < history.length; i += 2) {
            records.push({ n: i / 2 + 1, w: history[i], b: history[i + 1] ?? "" });
        }
        setFen(restoredFen);
        setFenHistory(fenHist);
        setMoveHistory(records);
        if (moves.length > 0) {
            const last = moves[moves.length - 1];
            setLastMove({ from: last.from, to: last.to });
        }
    };

    const getLegalMoves = (square: string): string[] => {
        const moves = chess.moves({ square: square as Square, verbose: true });
        return moves.map((m) => m.to);
    };

    const getAttackedSquares = (): string[] => {
        const board = chess.board();
        const currentColor = chess.turn();
        const opponentColor = currentColor === "w" ? "b" : "w";
        const attacked: string[] = [];

        board.forEach((row) => {
            row.forEach((cell) => {
                if (cell && cell.color === currentColor) {
                    if (chess.isAttacked(cell.square, opponentColor)) {
                        attacked.push(cell.square);
                    }
                }
            });
        });

        return attacked;
    };

    const getRandomMove = (): { from: string; to: string } | null => {
        const moves = chess.moves({ verbose: true });
        if (moves.length === 0) return null;
        const m = moves[Math.floor(Math.random() * moves.length)];
        return { from: m.from, to: m.to };
    };

    // Apply opponent's move using local chess.js (for history), then override the
    // displayed FEN with the server-authoritative value in case they ever diverge.
    const applyOpponentMove = (
        from: string,
        to: string,
        promotion: string | null,
        serverFen: string,
    ) => {
        try {
            const move = chess.move({ from, to, promotion: promotion ?? "q" });
            if (move) {
                setLastMove({ from, to });
                // Capture history before chess.load() wipes it
                const history = chess.history();
                const records: MoveRecord[] = [];
                for (let i = 0; i < history.length; i += 2) {
                    records.push({ n: i / 2 + 1, w: history[i], b: history[i + 1] ?? "" });
                }
                // Sync to server FEN only if there's a discrepancy
                if (chess.fen() !== serverFen) chess.load(serverFen);
                setFen(serverFen);
                setFenHistory(prev => [...prev, serverFen]);
                setMoveHistory(records);
            }
        } catch {
            // Fallback: just load the server FEN if local move fails entirely
            chess.load(serverFen);
            setFen(serverFen);
            setFenHistory(prev => [...prev, serverFen]);
            setLastMove({ from, to });
        }
    };

    const resetGame = () => {
        chess.reset();
        const startFen = chess.fen();
        setFen(startFen);
        setFenHistory([startFen]);
        setMoveHistory([]);
        setLastMove(null);
    };

    const isGameOver = chess.isGameOver();
    const isCheckmate = chess.isCheckmate();
    const isStalemate = chess.isStalemate();
    const isDraw = chess.isDraw();
    const turn = chess.turn();
    const inCheck = chess.isCheck();

    const kingSquare = (): string | null => {
        const board = chess.board();
        for (const row of board) {
            for (const cell of row) {
                if (cell && cell.type === "k" && cell.color === turn) {
                    return cell.square;
                }
            }
        }
        return null;
    };

    return {
        fen,
        fenHistory,
        makeMove,
        applyOpponentMove,
        resetGame,
        restoreGame,
        getLegalMoves,
        getRandomMove,
        getAttackedSquares,
        moveHistory,
        lastMove,
        isGameOver,
        isCheckmate,
        isStalemate,
        isDraw,
        turn,
        inCheck,
        kingSquare,
    };
}
