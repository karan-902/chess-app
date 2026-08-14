import { useState, useCallback } from "react";
import { Chess } from "chess.js";
import type { Square } from "chess.js";
import type { MoveRecord } from "@/types/types";
import { playSound, getMoveSound } from "@/lib/sounds";

export const CAPTURE_ORDER = ["p", "n", "b", "r", "q"] as const;
const STARTING_COUNTS: Record<string, number> = {
    p: 8,
    n: 2,
    b: 2,
    r: 2,
    q: 1,
};
const PIECE_VALUES: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 };

export interface ICapturedPieces {
    byWhite: string[];
    byBlack: string[];
    whiteAdvantage: number;
}

export function useChessGame() {
    const [chess] = useState(() => new Chess());
    const [fen, setFen] = useState(() => chess.fen());
    const [fenHistory, setFenHistory] = useState<string[]>([chess.fen()]);
    const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
    const [lastMove, setLastMove] = useState<{
        from: string;
        to: string;
    } | null>(null);
    const [moveLog, setMoveLog] = useState<
        Array<{ from: string; to: string; promotion: string | null }>
    >([]);

    const makeMove = useCallback(
        (
            from: string,
            to: string,
            promotion = "q",
        ): { fen: string; promotion?: string } | null => {
            try {
                const move = chess.move({ from, to, promotion });
                if (move) {
                    playSound(
                        getMoveSound(move, chess.isCheck(), chess.isGameOver()),
                    );
                    setLastMove({ from, to });
                    const newFen = chess.fen();
                    setFen(newFen);
                    setFenHistory((prev) => [...prev, newFen]);
                    const history = chess.history();
                    const records: MoveRecord[] = [];
                    for (let i = 0; i < history.length; i += 2) {
                        records.push({
                            n: i / 2 + 1,
                            w: history[i],
                            b: history[i + 1] ?? "",
                        });
                    }
                    setMoveHistory(records);
                    setMoveLog((prev) => [
                        ...prev,
                        { from, to, promotion: move.promotion ?? null },
                    ]);
                    return { fen: newFen, promotion: move.promotion };
                }
                return null;
            } catch {
                return null;
            }
        },
        [chess],
    );

    const restoreGame = useCallback(
        (
            moves: Array<{ from: string; to: string; promotion: string | null }>,
        ) => {
            chess.reset();
            const fenHist = [chess.fen()];
            for (const m of moves) {
                chess.move({
                    from: m.from,
                    to: m.to,
                    promotion: m.promotion ?? "q",
                });
                fenHist.push(chess.fen());
            }
            const restoredFen = chess.fen();
            const history = chess.history();
            const records: MoveRecord[] = [];
            for (let i = 0; i < history.length; i += 2) {
                records.push({
                    n: i / 2 + 1,
                    w: history[i],
                    b: history[i + 1] ?? "",
                });
            }
            setFen(restoredFen);
            setFenHistory(fenHist);
            setMoveHistory(records);
            setMoveLog(moves);
            if (moves.length > 0) {
                const last = moves[moves.length - 1];
                setLastMove({ from: last.from, to: last.to });
            }
        },
        [chess],
    );

    const getLegalMoves = useCallback(
        (square: string): string[] => {
            const moves = chess.moves({
                square: square as Square,
                verbose: true,
            });
            return moves.map((m) => m.to);
        },
        [chess],
    );

    const isPromotionMove = useCallback(
        (from: string, to: string): boolean => {
            const moves = chess.moves({
                square: from as Square,
                verbose: true,
            });
            return moves.some((m) => m.to === to && m.promotion !== undefined);
        },
        [chess],
    );

    const getAttackedSquares = useCallback((): string[] => {
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
    }, [chess]);

    const getCapturedPieces = useCallback((): ICapturedPieces => {
        const board = chess.board();
        const remaining: Record<"w" | "b", Record<string, number>> = {
            w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
            b: { p: 0, n: 0, b: 0, r: 0, q: 0 },
        };
        board.forEach((row) =>
            row.forEach((cell) => {
                if (cell && cell.type !== "k")
                    remaining[cell.color][cell.type]++;
            }),
        );

        const byWhite: string[] = [];
        const byBlack: string[] = [];
        for (const type of CAPTURE_ORDER) {
            const blackMissing = STARTING_COUNTS[type] - remaining.b[type];
            const whiteMissing = STARTING_COUNTS[type] - remaining.w[type];
            for (let i = 0; i < blackMissing; i++) byWhite.push(type);
            for (let i = 0; i < whiteMissing; i++) byBlack.push(type);
        }

        const materialWhite = byWhite.reduce(
            (sum, t) => sum + PIECE_VALUES[t],
            0,
        );
        const materialBlack = byBlack.reduce(
            (sum, t) => sum + PIECE_VALUES[t],
            0,
        );

        return {
            byWhite,
            byBlack,
            whiteAdvantage: materialWhite - materialBlack,
        };
    }, [chess]);

    const getPieceColor = useCallback(
        (square: string): "w" | "b" | null => {
            return chess.get(square as Square)?.color ?? null;
        },
        [chess],
    );

    type PremoveEntry = { from: string; to: string; promotion?: string };

    const buildPremoveClone = useCallback(
        (priorMoves: PremoveEntry[], asColor: "w" | "b") => {
            let fen = chess.fen();
            for (const mv of priorMoves) {
                const parts = fen.split(" ");
                parts[1] = asColor;
                const clone = new Chess(parts.join(" "));
                clone.move({
                    from: mv.from as Square,
                    to: mv.to as Square,
                    promotion: mv.promotion ?? "q",
                });
                fen = clone.fen();
            }
            const parts = fen.split(" ");
            parts[1] = asColor;
            return new Chess(parts.join(" "));
        },
        [chess],
    );

    const getPremoveMoves = useCallback(
        (
            square: string,
            asColor: "w" | "b",
            priorMoves: PremoveEntry[] = [],
        ): string[] => {
            try {
                return buildPremoveClone(priorMoves, asColor)
                    .moves({ square: square as Square, verbose: true })
                    .map((m) => m.to);
            } catch {
                return [];
            }
        },
        [buildPremoveClone],
    );

    const getPremovePieceColor = useCallback(
        (
            square: string,
            asColor: "w" | "b",
            priorMoves: PremoveEntry[] = [],
        ): "w" | "b" | null => {
            if (priorMoves.length === 0) return getPieceColor(square);
            try {
                return (
                    buildPremoveClone(priorMoves, asColor).get(
                        square as Square,
                    )?.color ?? null
                );
            } catch {
                return getPieceColor(square);
            }
        },
        [buildPremoveClone, getPieceColor],
    );

    const getRandomMove = useCallback((): {
        from: string;
        to: string;
    } | null => {
        const moves = chess.moves({ verbose: true });
        if (moves.length === 0) return null;
        const m = moves[Math.floor(Math.random() * moves.length)];
        return { from: m.from, to: m.to };
    }, [chess]);

    const applyOpponentMove = useCallback(
        (
            from: string,
            to: string,
            promotion: string | null,
            serverFen: string,
        ) => {
            try {
                const move = chess.move({
                    from,
                    to,
                    promotion: promotion ?? "q",
                });
                if (move) {
                    playSound(
                        getMoveSound(move, chess.isCheck(), chess.isGameOver()),
                    );
                    setLastMove({ from, to });

                    const history = chess.history();
                    const records: MoveRecord[] = [];
                    for (let i = 0; i < history.length; i += 2) {
                        records.push({
                            n: i / 2 + 1,
                            w: history[i],
                            b: history[i + 1] ?? "",
                        });
                    }
                    if (chess.fen() !== serverFen) chess.load(serverFen);
                    setFen(serverFen);
                    setFenHistory((prev) => [...prev, serverFen]);
                    setMoveHistory(records);
                    setMoveLog((prev) => [...prev, { from, to, promotion }]);
                }
            } catch {
                chess.load(serverFen);
                setFen(serverFen);
                setFenHistory((prev) => [...prev, serverFen]);
                setLastMove({ from, to });
                setMoveLog((prev) => [...prev, { from, to, promotion }]);
            }
        },
        [chess],
    );

    const confirmMove = useCallback(
        (serverFen: string) => {
            if (chess.fen() === serverFen) return;
            chess.load(serverFen);
            setFen(serverFen);
            setFenHistory((prev) => [...prev.slice(0, -1), serverFen]);
        },
        [chess],
    );

    const resetGame = useCallback(() => {
        chess.reset();
        const startFen = chess.fen();
        setFen(startFen);
        setFenHistory([startFen]);
        setMoveHistory([]);
        setLastMove(null);
        setMoveLog([]);
    }, [chess]);

    const isGameOver = chess.isGameOver();
    const isCheckmate = chess.isCheckmate();
    const isStalemate = chess.isStalemate();
    const isDraw = chess.isDraw();
    const turn = chess.turn();
    const inCheck = chess.isCheck();

    const kingSquare = useCallback((): string | null => {
        const board = chess.board();
        for (const row of board) {
            for (const cell of row) {
                if (cell && cell.type === "k" && cell.color === turn) {
                    return cell.square;
                }
            }
        }
        return null;
    }, [chess, turn]);

    return {
        fen,
        fenHistory,
        makeMove,
        applyOpponentMove,
        confirmMove,
        resetGame,
        restoreGame,
        getLegalMoves,
        isPromotionMove,
        getRandomMove,
        getPieceColor,
        getPremoveMoves,
        getPremovePieceColor,
        getAttackedSquares,
        getCapturedPieces,
        moveHistory,
        moveLog,
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
