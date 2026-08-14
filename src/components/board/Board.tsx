import { useRef, useState, useEffect, useMemo } from "react";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    TouchSensor,
    useDraggable,
    useDroppable,
    useSensor,
    useSensors,
    type DragStartEvent,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    restrictToParentElement,
    snapCenterToCursor,
} from "@dnd-kit/modifiers";
import classNames from "classnames";
import Box from "../base/Box/Box";
import PieceIcon from "./PieceIcon";
import "./board.scss";

interface IChessBoardProps {
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
    draggableColor?: "w" | "b";
}

const LIGHT_SQ = "#c9b48a";
const DARK_SQ = "#7a6440";

const RANKS = ["8", "7", "6", "5", "4", "3", "2", "1"];
const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const RANKS_FLIP = ["1", "2", "3", "4", "5", "6", "7", "8"];
const FILES_FLIP = ["h", "g", "f", "e", "d", "c", "b", "a"];

const PIECE_LETTER: Record<string, string> = {
    p: "P",
    n: "N",
    b: "B",
    r: "R",
    q: "Q",
    k: "K",
};

function boardFromFen(fen: string): Record<string, string> {
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
                board[`${"abcdefgh"[file]}${rank}`] =
                    `${color}${PIECE_LETTER[ch.toLowerCase()]}`;
                file += 1;
            }
        }
    });
    return board;
}

function DroppableSquare({
    square,
    className,
    style,
    onClick,
    onContextMenu,
    premoveMode,
    children,
}: {
    square: string;
    className: string;
    style: React.CSSProperties;
    onClick: () => void;
    onContextMenu: (e: React.MouseEvent) => void;
    premoveMode?: boolean;
    children: React.ReactNode;
}) {
    const { setNodeRef, isOver } = useDroppable({ id: square });
    return (
        <Box
            ref={setNodeRef}
            customClass={classNames(
                className,
                isOver &&
                    (premoveMode
                        ? "square-drag-hover-premove"
                        : "square-drag-hover"),
            )}
            style={style}
            onClick={onClick}
            onContextMenu={onContextMenu}
        >
            {children}
        </Box>
    );
}

function DraggablePiece({
    square,
    code,
    col,
    row,
    className,
    onClick,
    draggable,
}: {
    square: string;
    code: string;
    col: number;
    row: number;
    className: string;
    onClick: () => void;
    draggable: boolean;
}) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: square,
        data: { code },
        disabled: !draggable,
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onClick={onClick}
            style={{
                position: "absolute",
                left: `${col * 12.5}%`,
                top: `${row * 12.5}%`,
                width: "12.5%",
                height: "12.5%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                touchAction: "none",
                cursor: draggable ? "grab" : "pointer",
                opacity: isDragging ? 0 : 1,
                zIndex: 2,
                transition: isDragging
                    ? "none"
                    : "left 0.2s ease, top 0.2s ease",
            }}
        >
            <PieceIcon code={code} className={className} />
        </div>
    );
}

export default function Board({
    fen,
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
    premoveSquares = [],
    draggableColor,
}: IChessBoardProps) {
    const gridRef = useRef<HTMLDivElement>(null);
    const [boardWidth, setBoardWidth] = useState(400);
    const [activeDrag, setActiveDrag] = useState<{
        square: string;
        code: string;
    } | null>(null);

    useEffect(() => {
        const el = gridRef.current;
        if (!el) return;
        const observer = new ResizeObserver((entries) => {
            const width = entries[0]?.contentRect.width;
            if (width) setBoardWidth(width);
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const ranks = flipped ? RANKS_FLIP : RANKS;
    const files = flipped ? FILES_FLIP : FILES;
    const board = useMemo(() => boardFromFen(fen), [fen]);
    const cellSize = boardWidth / 8;
    const pieceSize = cellSize * 0.96;

    const prevKeyMapRef = useRef<Record<string, string>>({});
    const pieceKeys: Record<string, string> = {};
    for (const square of Object.keys(board)) {
        pieceKeys[square] = square;
    }
    if (lastMove && board[lastMove.to] && !board[lastMove.from]) {
        pieceKeys[lastMove.to] =
            prevKeyMapRef.current[lastMove.from] ?? lastMove.from;
    }
    useEffect(() => {
        prevKeyMapRef.current = pieceKeys;
    });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 6 },
        }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 120, tolerance: 8 },
        }),
    );

    const handleDragStart = (e: DragStartEvent) => {
        const square = e.active.id as string;
        const code = board[square];
        if (code) setActiveDrag({ square, code });
        onSquareClick?.(square);
    };

    const handleDragEnd = (e: DragEndEvent) => {
        setActiveDrag(null);
        const from = e.active.id as string;
        const to = e.over?.id as string | undefined;
        if (to && to !== from) onSquareClick?.(to, true);
    };

    return (
        <DndContext
            sensors={sensors}
            modifiers={[snapCenterToCursor, restrictToParentElement]}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <Box customClass="chess-board">
                <Box customClass="chess-board-grid" ref={gridRef}>
                    {Array.from({ length: 8 }, (_, r) =>
                        Array.from({ length: 8 }, (_, c) => {
                            const isLight = (r + c) % 2 === 0;
                            const square = `${files[c]}${ranks[r]}`;
                            const piece = board[square];
                            const isSelected = selectedSquare === square;
                            const isLegal = legalMoves.includes(square);
                            const isCapture = isLegal && !!piece;
                            const isAttacked =
                                attackedSquares.includes(square) && !!piece;
                            const isCheck = checkSquare === square;
                            const isStalemate = stalemateSquare === square;
                            const isFlash = flashSquare === square;
                            const isPremoveQueued =
                                premoveSquares.includes(square);

                            const bg = isLight ? LIGHT_SQ : DARK_SQ;
                            const squareBg = isCheck
                                ? "radial-gradient(circle, #ff0000 0%, #a00000 100%)"
                                : isStalemate
                                  ? "radial-gradient(circle, #f7931a 0%, #b3650f 100%)"
                                  : bg;

                            return (
                                <DroppableSquare
                                    key={square}
                                    square={square}
                                    className={`chess-board-square${isFlash ? " square-flash" : ""}${isSelected ? " square-selected" : ""}${isSelected && premoveMode ? " square-selected-premove" : ""}${isPremoveQueued ? " square-premove-queued" : ""}`}
                                    style={{
                                        backgroundColor: bg,
                                        background: squareBg,
                                        cursor: "pointer",
                                    }}
                                    onClick={() => onSquareClick?.(square)}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        onSquareRightClick?.(square);
                                    }}
                                    premoveMode={premoveMode}
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
                                </DroppableSquare>
                            );
                        }),
                    )}

                    {Object.entries(board).map(([square, code]) => {
                        const col = files.indexOf(square[0]);
                        const row = ranks.indexOf(square[1]);
                        const isAttacked =
                            attackedSquares.includes(square) &&
                            square !== activeDrag?.square;
                        const isCheck = square === checkSquare;
                        const isStalemate = square === stalemateSquare;
                        return (
                            <DraggablePiece
                                key={pieceKeys[square]}
                                square={square}
                                code={code}
                                col={col}
                                row={row}
                                className={`chess-piece-svg${isAttacked ? " piece-danger" : ""}${isCheck ? " piece-in-check" : ""}${isStalemate ? " piece-in-stalemate" : ""}`}
                                onClick={() => onSquareClick?.(square)}
                                draggable={
                                    !draggableColor ||
                                    code[0] === draggableColor
                                }
                            />
                        );
                    })}
                </Box>
            </Box>
            <DragOverlay dropAnimation={null}>
                {activeDrag && (
                    <PieceIcon
                        code={activeDrag.code}
                        className="chess-piece-svg chess-piece-dragging"
                        style={{ width: pieceSize, height: pieceSize }}
                    />
                )}
            </DragOverlay>
        </DndContext>
    );
}
