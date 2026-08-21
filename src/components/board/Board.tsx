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
import { motion } from "motion/react";
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
    premoveMoves?: { from: string; to: string }[];
    draggableColor?: "w" | "b";
}


const ANNOTATION_COLORS: Record<string, string> = {
    plain: "#15c60c",
    shift: "#e0341f",
    alt: "#1a5fd6",
    ctrl: "#e8a33d",
};

function colorKeyFromEvent(e: {
    shiftKey: boolean;
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
}) {
    if (e.shiftKey) return "shift";
    if (e.altKey) return "alt";
    if (e.ctrlKey || e.metaKey) return "ctrl";
    return "plain";
}

type Arrow = { from: string; to: string; colorKey: string };
type Highlight = { square: string; colorKey: string };

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
            className="chess-piece-slot"
            style={{
                transform: `translate(${col * 100}%, ${row * 100}%)`,
                cursor: draggable ? "grab" : "pointer",
                opacity: isDragging ? 0 : 1,
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
    premoveMoves = [],
    draggableColor,
}: IChessBoardProps) {
    const gridRef = useRef<HTMLDivElement>(null);
    const [boardWidth, setBoardWidth] = useState(400);
    const [activeDrag, setActiveDrag] = useState<{
        square: string;
        code: string;
    } | null>(null);
    const [arrows, setArrows] = useState<Arrow[]>([]);
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const annotateRef = useRef<{ square: string; colorKey: string } | null>(
        null,
    );
    const [landings, setLandings] = useState<{ id: number; square: string }[]>(
        [],
    );
    const landingIdRef = useRef(0);
    const prevLastMoveRef = useRef<{ from: string; to: string } | null>(null);
    const prevPremoveCountRef = useRef(0);
    const prevPremoveMovesRef = useRef<{ from: string; to: string }[]>([]);

    useEffect(() => {
        setArrows([]);
        setHighlights([]);
    }, [fen]);

    useEffect(() => {
        const prev = prevLastMoveRef.current;
        const alreadyGhosted = prevPremoveMovesRef.current.some(
            (m) => lastMove && m.from === lastMove.from && m.to === lastMove.to,
        );
        if (
            lastMove &&
            !alreadyGhosted &&
            (!prev || prev.from !== lastMove.from || prev.to !== lastMove.to)
        ) {
            const id = ++landingIdRef.current;
            setLandings((q) => [...q, { id, square: lastMove.to }]);
        }
        prevLastMoveRef.current = lastMove ?? null;
    }, [lastMove]);

    useEffect(() => {
        if (premoveMoves.length > prevPremoveCountRef.current) {
            const last = premoveMoves[premoveMoves.length - 1];
            if (last) {
                const id = ++landingIdRef.current;
                setLandings((q) => [...q, { id, square: last.to }]);
            }
        }
        prevPremoveCountRef.current = premoveMoves.length;
        prevPremoveMovesRef.current = premoveMoves;
    }, [premoveMoves]);

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

    const resolveDisplaySquare = (square: string, code: string) => {
        let current = square;
        for (const m of premoveMoves) {
            if (m.from !== current) continue;
            const occupant = board[m.to];
            if (occupant && occupant[0] !== code[0]) break;
            current = m.to;
        }
        return current;
    };

    const hiddenCaptureSquares = useMemo(() => {
        const hidden = new Set<string>();
        for (const [square, code] of Object.entries(board)) {
            let current = square;
            for (const m of premoveMoves) {
                if (m.from !== current) continue;
                const occupant = board[m.to];
                if (occupant && occupant[0] !== code[0]) {
                    hidden.add(m.to);
                    break;
                }
                current = m.to;
            }
        }
        return hidden;
    }, [board, premoveMoves]);

    const prevKeyMapRef = useRef<Record<string, string>>({});
    const pieceKeys: Record<string, string> = {};
    for (const square of Object.keys(board)) {
        pieceKeys[square] = square;
    }
    if (lastMove && board[lastMove.to] && !board[lastMove.from]) {
        pieceKeys[lastMove.to] =
            prevKeyMapRef.current[lastMove.from] ?? lastMove.from;

        const isCastle =
            board[lastMove.to][1] === "K" &&
            Math.abs(
                FILES.indexOf(lastMove.to[0]) -
                    FILES.indexOf(lastMove.from[0]),
            ) === 2;
        if (isCastle) {
            const rank = lastMove.from[1];
            const kingside = lastMove.to[0] === "g";
            const rookFrom = `${kingside ? "h" : "a"}${rank}`;
            const rookTo = `${kingside ? "f" : "d"}${rank}`;
            if (board[rookTo] && !board[rookFrom]) {
                pieceKeys[rookTo] =
                    prevKeyMapRef.current[rookFrom] ?? rookFrom;
            }
        }
    }
    useEffect(() => {
        prevKeyMapRef.current = pieceKeys;
    });

    const pieceOrderRef = useRef<Map<string, number>>(new Map());
    const pieceEntries = Object.entries(board);
    for (const [square] of pieceEntries) {
        const key = pieceKeys[square];
        if (!pieceOrderRef.current.has(key)) {
            pieceOrderRef.current.set(key, pieceOrderRef.current.size);
        }
    }
    const orderedPieceEntries = [...pieceEntries].sort(
        (a, b) =>
            pieceOrderRef.current.get(pieceKeys[a[0]])! -
            pieceOrderRef.current.get(pieceKeys[b[0]])!,
    );

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
        onSquareClick?.(
            code ? resolveDisplaySquare(square, code) : square,
        );
    };

    const handleDragEnd = (e: DragEndEvent) => {
        setActiveDrag(null);
        const from = e.active.id as string;
        const to = e.over?.id as string | undefined;
        if (to && to !== from) onSquareClick?.(to, true);
    };

    const squareFromPoint = (clientX: number, clientY: number) => {
        const el = gridRef.current;
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;
        const col = Math.min(7, Math.floor((x / rect.width) * 8));
        const row = Math.min(7, Math.floor((y / rect.height) * 8));
        return `${files[col]}${ranks[row]}`;
    };

    const handleGridMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 2) return;
        const square = squareFromPoint(e.clientX, e.clientY);
        if (!square) return;
        annotateRef.current = { square, colorKey: colorKeyFromEvent(e) };
    };

    const handleGridMouseUp = (e: React.MouseEvent) => {
        if (e.button !== 2) return;
        const start = annotateRef.current;
        annotateRef.current = null;
        if (!start) return;
        const end = squareFromPoint(e.clientX, e.clientY);
        if (!end) return;

        if (end === start.square) {
            if (premoveMoves.length > 0) {
                onSquareRightClick?.(end);
                return;
            }
            setHighlights((prev) => {
                const existing = prev.find((h) => h.square === end);
                if (existing) {
                    return existing.colorKey === start.colorKey
                        ? prev.filter((h) => h.square !== end)
                        : prev.map((h) =>
                              h.square === end
                                  ? { ...h, colorKey: start.colorKey }
                                  : h,
                          );
                }
                return [...prev, { square: end, colorKey: start.colorKey }];
            });
            return;
        }

        setArrows((prev) => {
            const existing = prev.find(
                (a) => a.from === start.square && a.to === end,
            );
            if (existing) {
                return existing.colorKey === start.colorKey
                    ? prev.filter(
                          (a) => !(a.from === start.square && a.to === end),
                      )
                    : prev.map((a) =>
                          a.from === start.square && a.to === end
                              ? { ...a, colorKey: start.colorKey }
                              : a,
                      );
            }
            return [
                ...prev,
                { from: start.square, to: end, colorKey: start.colorKey },
            ];
        });
    };

    return (
        <DndContext
            sensors={sensors}
            modifiers={[snapCenterToCursor, restrictToParentElement]}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            autoScroll={false}
        >
            <Box customClass="chess-board">
                <Box
                    customClass="chess-board-grid"
                    ref={gridRef}
                    onMouseDown={handleGridMouseDown}
                    onMouseUp={handleGridMouseUp}
                    onContextMenu={(e: React.MouseEvent) =>
                        e.preventDefault()
                    }
                >
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

                    {orderedPieceEntries.map(([square, code]) => {
                        const isCaptureTarget =
                            hiddenCaptureSquares.has(square);
                        const displaySquare = resolveDisplaySquare(
                            square,
                            code,
                        );
                        const col = files.indexOf(displaySquare[0]);
                        const row = ranks.indexOf(displaySquare[1]);
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
                                className={`chess-piece-svg${code[0] === "b" ? " piece-black" : ""}${isAttacked ? " piece-danger" : ""}${isCheck ? " piece-in-check" : ""}${isStalemate ? " piece-in-stalemate" : ""}${isCaptureTarget ? " piece-capture-pending" : ""}`}
                                onClick={() => onSquareClick?.(displaySquare)}
                                draggable={
                                    !draggableColor ||
                                    code[0] === draggableColor
                                }
                            />
                        );
                    })}

                    {landings.map(({ id, square }) => {
                        const col = files.indexOf(square[0]);
                        const row = ranks.indexOf(square[1]);
                        return (
                            <motion.div
                                key={id}
                                className="board-preview-ring"
                                initial={{
                                    x: `${col * 100}%`,
                                    y: `${row * 100}%`,
                                    scale: 0.3,
                                    opacity: 0.9,
                                }}
                                animate={{
                                    x: `${col * 100}%`,
                                    y: `${row * 100}%`,
                                    scale: 1.15,
                                    opacity: 0,
                                }}
                                transition={{
                                    duration: 0.9,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                onAnimationComplete={() =>
                                    setLandings((q) =>
                                        q.filter((l) => l.id !== id),
                                    )
                                }
                            />
                        );
                    })}

                    {(highlights.length > 0 || arrows.length > 0) && (
                        <svg
                            viewBox="0 0 800 800"
                            style={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                pointerEvents: "none",
                                zIndex: 4,
                            }}
                        >
                            <defs>
                                {Object.entries(ANNOTATION_COLORS).map(
                                    ([key, color]) => (
                                        <marker
                                            key={key}
                                            id={`arrow-head-${key}`}
                                            markerWidth="4"
                                            markerHeight="4"
                                            refX="2.2"
                                            refY="2"
                                            orient="auto"
                                        >
                                            <path
                                                d="M0,0 L4,2 L0,4 Z"
                                                fill={color}
                                            />
                                        </marker>
                                    ),
                                )}
                            </defs>
                            {highlights.map(({ square, colorKey }) => {
                                const col = files.indexOf(square[0]);
                                const row = ranks.indexOf(square[1]);
                                return (
                                    <motion.rect
                                        key={`hl-${square}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.55 }}
                                        x={col * 100}
                                        y={row * 100}
                                        width={100}
                                        height={100}
                                        fill={ANNOTATION_COLORS[colorKey]}
                                    />
                                );
                            })}
                            {arrows.map(({ from, to, colorKey }) => {
                                const fc = files.indexOf(from[0]);
                                const fr = ranks.indexOf(from[1]);
                                const tc = files.indexOf(to[0]);
                                const tr = ranks.indexOf(to[1]);
                                const x1 = fc * 100 + 50;
                                const y1 = fr * 100 + 50;
                                const x2raw = tc * 100 + 50;
                                const y2raw = tr * 100 + 50;
                                const dx = x2raw - x1;
                                const dy = y2raw - y1;
                                const len = Math.hypot(dx, dy) || 1;
                                const shorten = 34;
                                const x2 = x2raw - (dx / len) * shorten;
                                const y2 = y2raw - (dy / len) * shorten;
                                return (
                                    <motion.line
                                        key={`arrow-${from}-${to}`}
                                        initial={{
                                            pathLength: 0,
                                            opacity: 0,
                                        }}
                                        animate={{
                                            pathLength: 1,
                                            opacity: 0.85,
                                        }}
                                        transition={{
                                            duration: 0.18,
                                            ease: "easeOut",
                                        }}
                                        x1={x1}
                                        y1={y1}
                                        x2={x2}
                                        y2={y2}
                                        stroke={ANNOTATION_COLORS[colorKey]}
                                        strokeWidth={16}
                                        strokeLinecap="round"
                                        markerEnd={`url(#arrow-head-${colorKey})`}
                                    />
                                );
                            })}
                        </svg>
                    )}
                </Box>
            </Box>
            <DragOverlay dropAnimation={null}>
                {activeDrag && (
                    <PieceIcon
                        code={activeDrag.code}
                        className={`chess-piece-svg chess-piece-dragging${activeDrag.code[0] === "b" ? " piece-black" : ""}`}
                        style={{ width: pieceSize, height: pieceSize }}
                    />
                )}
            </DragOverlay>
        </DndContext>
    );
}
