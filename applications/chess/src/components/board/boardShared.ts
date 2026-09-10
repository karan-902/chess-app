import { useEffect, useState, type RefObject } from "react";

export interface IChessBoardProps {
    fen: string;
    selectedSquare?: string | null;
    legalMoves?: string[];
    attackedSquares?: string[];
    checkSquare?: string | null;
    stalemateSquare?: string | null;
    flashSquare?: string | null;
    onSquareClick?: (square: string, viaDrag?: boolean) => void;
    onSquareRightClick?: (square: string) => void;
    lastMove?: { from: string; to: string } | null;
    flipped?: boolean;
    premoveMode?: boolean;
    premoveSquares?: string[];
    premoveMoves?: { from: string; to: string }[];
    draggableColor?: "w" | "b";
}

export const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const RANKS = ["1", "2", "3", "4", "5", "6", "7", "8"];

export const ALL_PIECES = [
    "wP", "wN", "wB", "wR", "wQ", "wK",
    "bP", "bN", "bB", "bR", "bQ", "bK",
];

export const pieceUrl = (code: string) => `/pieces/${code}.svg`;

export const MOVE_MS = 500;

function makeCubicBezier(x1: number, y1: number, x2: number, y2: number) {
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;
    const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
    const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
    const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
    return (x: number) => {
        if (x <= 0) return 0;
        if (x >= 1) return 1;
        let t = x;
        for (let i = 0; i < 8; i++) {
            const err = sampleX(t) - x;
            if (Math.abs(err) < 1e-4) break;
            const d = slopeX(t);
            if (Math.abs(d) < 1e-6) break;
            t -= err / d;
        }
        return sampleY(t);
    };
}

export const easeStandard = makeCubicBezier(0.4, 0, 0.2, 1);

export const COLORS = {
    light: 0xc9b48a,
    dark: 0x7a6440,
    lastMove: 0xb59a2b,
    selected: 0xd7b03a,
    legal: 0xd7b03a,
    premoveTint: 0xc84a4a,
    premoveQueued: 0xc84a4a,
    check: 0xc21a1a,
    stalemate: 0xf7931a,
    flash: 0xdc3232,
    attacked: 0xdc3232,
};

const PIECE_LETTER: Record<string, string> = {
    p: "P", n: "N", b: "B", r: "R", q: "Q", k: "K",
};

export function boardFromFen(fen: string): Record<string, string> {
    const placement = fen.split(" ")[0] ?? "";
    const board: Record<string, string> = {};
    placement.split("/").forEach((rankStr, i) => {
        const rank = 8 - i;
        let file = 0;
        for (const ch of rankStr) {
            if (/\d/.test(ch)) {
                file += Number(ch);
            } else {
                const color = ch === ch.toUpperCase() ? "w" : "b";
                board[`${FILES[file]}${rank}`] =
                    `${color}${PIECE_LETTER[ch.toLowerCase()]}`;
                file += 1;
            }
        }
    });
    return board;
}

export function squareToColRow(square: string, flipped = false) {
    const f = FILES.indexOf(square[0]);
    const r = RANKS.indexOf(square[1]);
    return flipped ? { col: 7 - f, row: r } : { col: f, row: 7 - r };
}

export function colRowToSquare(col: number, row: number, flipped = false) {
    if (col < 0 || col > 7 || row < 0 || row > 7) return null;
    const f = flipped ? 7 - col : col;
    const r = flipped ? row : 7 - row;
    return `${FILES[f]}${RANKS[r]}`;
}

export function isDraggable(code: string, draggableColor?: "w" | "b") {
    return !draggableColor || code[0] === draggableColor;
}

export type Hint =
    | { kind: "tint"; square: string; color: number; alpha: number }
    | { kind: "dot"; square: string; color: number }
    | { kind: "ring"; square: string; color: number }
    | { kind: "check"; square: string };

export function computeHints(p: IChessBoardProps): Hint[] {
    const board = boardFromFen(p.fen);
    const hints: Hint[] = [];
    const tint = (square: string | null | undefined, color: number, alpha: number) => {
        if (square) hints.push({ kind: "tint", square, color, alpha });
    };

    (p.lastMove ? [p.lastMove.from, p.lastMove.to] : []).forEach((s) =>
        tint(s, COLORS.lastMove, 0.45),
    );
    (p.premoveSquares ?? []).forEach((s) => tint(s, COLORS.premoveQueued, 0.4));
    tint(p.flashSquare, COLORS.flash, 0.7);
    tint(p.stalemateSquare, COLORS.stalemate, 0.55);
    (p.attackedSquares ?? []).forEach((s) => {
        if (board[s]) tint(s, COLORS.attacked, 0.3);
    });
    if (p.selectedSquare)
        tint(p.selectedSquare, p.premoveMode ? COLORS.premoveTint : COLORS.selected, 0.5);
    if (p.checkSquare) hints.push({ kind: "check", square: p.checkSquare });

    const legalColor = p.premoveMode ? COLORS.premoveTint : COLORS.legal;
    (p.legalMoves ?? []).forEach((s) => {
        hints.push(
            board[s]
                ? { kind: "ring", square: s, color: legalColor }
                : { kind: "dot", square: s, color: legalColor },
        );
    });
    return hints;
}

export function castleRookMove(
    fromSq: string,
    toSq: string,
    movedPiece: string,
): { from: string; to: string } | null {
    if (movedPiece?.[1] !== "K") return null;
    if (Math.abs(FILES.indexOf(toSq[0]) - FILES.indexOf(fromSq[0])) !== 2)
        return null;
    const rank = fromSq[1];
    const kingside = toSq[0] === "g";
    return {
        from: `${kingside ? "h" : "a"}${rank}`,
        to: `${kingside ? "f" : "d"}${rank}`,
    };
}

export function useSquareSize(hostRef: RefObject<HTMLElement | null>) {
    const [size, setSize] = useState(0);
    useEffect(() => {
        const el = hostRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => {
            const w = entry?.contentRect.width;
            if (w) setSize(Math.round(w));
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, [hostRef]);
    return size;
}
