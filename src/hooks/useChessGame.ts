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

    const makeMove = (from: string, to: string) => {
        try {
            const move = chess.move({ from, to, promotion: "q" });
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
                return true;
            }
            return false;
        } catch {
            return false;
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
        resetGame,
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
