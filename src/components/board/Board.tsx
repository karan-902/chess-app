import { useRef, useEffect, useState } from "react";
import Box from "../base/Box/Box";
import { TBoard } from "@/types/types";
import PieceIcon from "./PieceIcon";
import "./board.scss";

interface IChessBoardProps {
    board: TBoard;
    selectedSquare?: string | null;
    legalMoves?: string[];
    attackedSquares?: string[];
    checkSquare?: string | null;
    stalemateSquare?: string | null;
    flashSquare?: string | null;
    onSquareClick?: (square: string) => void;
    onSquareRightClick?: (square: string) => void;
    lastMove?: { from: string; to: string } | null;
    flipped?: boolean;
    premoveMode?: boolean;
}

const PIECE_SVG: Record<string, string> = {
    "♔": "wK",
    "♕": "wQ",
    "♖": "wR",
    "♗": "wB",
    "♘": "wN",
    "♙": "wP",
    "♚": "bK",
    "♛": "bQ",
    "♜": "bR",
    "♝": "bB",
    "♞": "bN",
    "♟": "bP",
};

const LIGHT_SQ = "#c9b48a";
const DARK_SQ = "#7a6440";

const RANKS = ["8", "7", "6", "5", "4", "3", "2", "1"];
const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const RANKS_FLIP = ["1", "2", "3", "4", "5", "6", "7", "8"];
const FILES_FLIP = ["h", "g", "f", "e", "d", "c", "b", "a"];

interface AnimPiece {
    svgFile: string;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    pieceW: number;
    pieceH: number;
}

interface DragState {
    square: string;
    pointerId: number;
    svgFile: string;
    startX: number;
    startY: number;
    x: number;
    y: number;
    liftY: number;
    dragging: boolean;
    hoverSquare: string | null;
}

const DRAG_THRESHOLD = 6;

function squareToIndex(square: string, flipped?: boolean) {
    const col = FILES.indexOf(square[0]);
    const row = RANKS.indexOf(square[1]);
    return flipped ? { col: 7 - col, row: 7 - row } : { col, row };
}

function squareAtPoint(
    rect: DOMRect,
    clientX: number,
    clientY: number,
    files: string[],
    ranks: string[],
): string {
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const col = Math.min(7, Math.max(0, Math.floor((x / rect.width) * 8)));
    const row = Math.min(7, Math.max(0, Math.floor((y / rect.height) * 8)));
    return `${files[col]}${ranks[row]}`;
}

export default function Board({
    board,
    selectedSquare,
    legalMoves = [],
    attackedSquares = [],
    checkSquare,
    stalemateSquare,
    flashSquare,
    onSquareClick,
    onSquareRightClick,
    lastMove,
    flipped,
    premoveMode,
}: IChessBoardProps) {
    const gridRef = useRef<HTMLDivElement>(null);
    const [animPiece, setAnimPiece] = useState<AnimPiece | null>(null);
    const [animating, setAnimating] = useState(false);
    const prevLastMove = useRef<typeof lastMove>(null);
    const [dragState, setDragState] = useState<DragState | null>(null);
    const dragRectRef = useRef<DOMRect | null>(null);

    const ranks = flipped ? RANKS_FLIP : RANKS;
    const files = flipped ? FILES_FLIP : FILES;

    useEffect(() => {
        if (
            !lastMove ||
            (prevLastMove.current &&
                prevLastMove.current.from === lastMove.from &&
                prevLastMove.current.to === lastMove.to)
        )
            return;
        if (!gridRef.current) return;

        prevLastMove.current = lastMove;

        const grid = gridRef.current;
        const rect = grid.getBoundingClientRect();
        const sqW = rect.width / 8;
        const sqH = rect.height / 8;

        const from = squareToIndex(lastMove.from, flipped);
        const to = squareToIndex(lastMove.to, flipped);

        const piece = board[to.row]?.[to.col];
        if (!piece) return;

        const svgFile = PIECE_SVG[piece];
        if (!svgFile) return;

        const pieceW = sqW * 0.9;
        const pieceH = sqH * 0.9;
        const offset = { x: sqW * 0.05, y: sqH * 0.05 };

        setAnimPiece({
            svgFile,
            fromX: from.col * sqW + offset.x,
            fromY: from.row * sqH + offset.y,
            toX: to.col * sqW + offset.x,
            toY: to.row * sqH + offset.y,
            pieceW,
            pieceH,
        });
        setAnimating(false);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => setAnimating(true));
        });

        const timer = setTimeout(() => setAnimPiece(null), 320);
        return () => clearTimeout(timer);
    }, [lastMove]);

    useEffect(() => {
        if (!dragState) return;
        const { pointerId, startX, startY, square } = dragState;

        const handleMove = (e: PointerEvent) => {
            if (e.pointerId !== pointerId) return;
            const rect = dragRectRef.current;
            const past =
                Math.hypot(e.clientX - startX, e.clientY - startY) >
                DRAG_THRESHOLD;
            const hoverSquare = rect
                ? squareAtPoint(rect, e.clientX, e.clientY, files, ranks)
                : null;
            setDragState((prev) =>
                prev
                    ? {
                          ...prev,
                          x: e.clientX,
                          y: e.clientY,
                          dragging: prev.dragging || past,
                          hoverSquare,
                      }
                    : prev,
            );
        };

        const handleUp = (e: PointerEvent) => {
            if (e.pointerId !== pointerId) return;
            setDragState((prev) => {
                if (prev?.dragging) {
                    const rect = dragRectRef.current;
                    const dropSquare = rect
                        ? squareAtPoint(rect, e.clientX, e.clientY, files, ranks)
                        : null;
                    if (dropSquare && dropSquare !== square) {
                        prevLastMove.current = { from: square, to: dropSquare };
                        onSquareClick?.(dropSquare);
                    }
                }
                return null;
            });
        };

        window.addEventListener("pointermove", handleMove);
        window.addEventListener("pointerup", handleUp);
        window.addEventListener("pointercancel", handleUp);
        return () => {
            window.removeEventListener("pointermove", handleMove);
            window.removeEventListener("pointerup", handleUp);
            window.removeEventListener("pointercancel", handleUp);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dragState?.square, dragState?.pointerId]);

    const handleSquarePointerDown = (
        square: string,
        svgFile: string | null,
        e: React.PointerEvent,
    ) => {
        if (e.button !== 0) return;
        onSquareClick?.(square);
        if (!svgFile || !gridRef.current) return;
        dragRectRef.current = gridRef.current.getBoundingClientRect();
        setDragState({
            square,
            pointerId: e.pointerId,
            svgFile,
            startX: e.clientX,
            startY: e.clientY,
            x: e.clientX,
            y: e.clientY,
            liftY: e.pointerType === "touch" ? 48 : 0,
            dragging: false,
            hoverSquare: null,
        });
    };

    return (
        <Box customClass="chess-board">
            <Box ref={gridRef} customClass="chess-board-grid">
                {Array.from({ length: 8 }, (_, r) =>
                    Array.from({ length: 8 }, (_, c) => {
                        const piece = flipped
                            ? board[7 - r][7 - c]
                            : board[r][c];
                        const isLight = (r + c) % 2 === 0;
                        const square = `${files[c]}${ranks[r]}`;
                        const isSelected = selectedSquare === square;
                        const isLegal = legalMoves.includes(square);
                        const isCapture = isLegal && !!piece;
                        const isAttacked =
                            attackedSquares.includes(square) && !!piece;
                        const isCheck = checkSquare === square;
                        const isStalemate = stalemateSquare === square;
                        const isFlash = flashSquare === square;

                        const bg = isLight ? LIGHT_SQ : DARK_SQ;
                        const svgFile = piece ? PIECE_SVG[piece] : null;
                        const isAnimTarget =
                            animPiece && lastMove?.to === square;
                        const isDragOrigin =
                            dragState?.dragging && dragState.square === square;
                        const isDragHover =
                            dragState?.dragging &&
                            dragState.hoverSquare === square;

                        const squareBg = isCheck
                            ? "radial-gradient(circle, #ff0000 0%, #a00000 100%)"
                            : isStalemate
                              ? "radial-gradient(circle, #f7931a 0%, #b3650f 100%)"
                              : bg;

                        return (
                            <Box
                                key={`${r}-${c}`}
                                customClass={`chess-board-square${isFlash ? " square-flash" : ""}${isSelected ? " square-selected" : ""}${isSelected && premoveMode ? " square-selected-premove" : ""}${isDragHover ? " square-drag-hover" : ""}`}
                                style={{
                                    backgroundColor: bg,
                                    background: squareBg,
                                    cursor: "pointer",
                                }}
                                onPointerDown={(e) =>
                                    handleSquarePointerDown(square, svgFile, e)
                                }
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    onSquareRightClick?.(square);
                                }}
                            >
                                {c === 0 && (
                                    <span
                                        className={`sq-corner-label sq-rank ${isLight ? "label-on-light" : "label-on-dark"}`}
                                    >
                                        {ranks[r]}
                                    </span>
                                )}
                                {r === 7 && (
                                    <span
                                        className={`sq-corner-label sq-file ${isLight ? "label-on-light" : "label-on-dark"}`}
                                    >
                                        {files[c]}
                                    </span>
                                )}
                                {isLegal && !isCapture && (
                                    <span
                                        className={`legal-dot${premoveMode ? " legal-dot-premove" : ""}`}
                                    />
                                )}
                                {isCapture && (
                                    <span
                                        className={`legal-capture-ring${premoveMode ? " legal-capture-ring-premove" : ""}`}
                                    />
                                )}
                                {isAttacked && (
                                    <span className="water-drop-ripple" />
                                )}
                                {svgFile && !isAnimTarget && !isDragOrigin && (
                                    <PieceIcon
                                        code={svgFile}
                                        className={`chess-piece-svg${isAttacked ? " piece-danger" : ""}${isCheck ? " piece-in-check" : ""}${isStalemate ? " piece-in-stalemate" : ""}`}
                                    />
                                )}
                            </Box>
                        );
                    }),
                )}

                {}
                {animPiece && (
                    <PieceIcon
                        code={animPiece.svgFile}
                        className="chess-piece-svg"
                        style={{
                            position: "absolute",
                            width: animPiece.pieceW,
                            height: animPiece.pieceH,
                            left: animating ? animPiece.toX : animPiece.fromX,
                            top: animating ? animPiece.toY : animPiece.fromY,
                            transition: animating
                                ? "left 0.28s ease, top 0.28s ease"
                                : "none",
                            pointerEvents: "none",
                            zIndex: 50,
                        }}
                    />
                )}

                {dragState?.dragging &&
                    dragRectRef.current &&
                    (() => {
                        const rect = dragRectRef.current;
                        const pieceW = (rect.width / 8) * 0.9;
                        const pieceH = (rect.height / 8) * 0.9;
                        const rawLeft = dragState.x - rect.left - pieceW / 2;
                        const rawTop =
                            dragState.y -
                            rect.top -
                            pieceH / 2 -
                            dragState.liftY;
                        const left = Math.min(
                            Math.max(rawLeft, 0),
                            rect.width - pieceW,
                        );
                        const top = Math.min(
                            Math.max(rawTop, 0),
                            rect.height - pieceH,
                        );
                        return (
                            <PieceIcon
                                code={dragState.svgFile}
                                className="chess-piece-svg chess-piece-dragging"
                                style={{
                                    position: "absolute",
                                    width: pieceW,
                                    height: pieceH,
                                    left,
                                    top,
                                    pointerEvents: "none",
                                    zIndex: 60,
                                }}
                            />
                        );
                    })()}
            </Box>
        </Box>
    );
}
