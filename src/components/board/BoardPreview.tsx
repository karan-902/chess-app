import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import Box from "../base/Box/Box";
import PieceIcon from "./PieceIcon";
import "./board.scss";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const RANKS = ["8", "7", "6", "5", "4", "3", "2", "1"];
const BACK = ["R", "N", "B", "Q", "K", "B", "N", "R"];

interface PieceData {
    code: string;
    col: number;
    row: number;
    noTransition?: boolean;
    captured?: boolean;
    inCheck?: boolean;
    breathing?: boolean;
}

interface RenderedPiece extends PieceData {
    id: string;
}

interface OverlayItem {
    id: number;
    kind: "ghost" | "ring" | "flash" | "check-ring";
    col: number;
    row: number;
    code?: string;
    danger?: boolean;
    phase: "in" | "out";
}

function squareToRC(square: string) {
    return { col: FILES.indexOf(square[0]), row: RANKS.indexOf(square[1]) };
}

function startPosition() {
    const list: { id: string; code: string; square: string }[] = [];
    FILES.forEach((f, i) => {
        list.push({ id: `b${BACK[i]}-${f}8`, code: `b${BACK[i]}`, square: `${f}8` });
        list.push({ id: `bP-${f}7`, code: "bP", square: `${f}7` });
        list.push({ id: `wP-${f}2`, code: "wP", square: `${f}2` });
        list.push({ id: `w${BACK[i]}-${f}1`, code: `w${BACK[i]}`, square: `${f}1` });
    });
    return list;
}

function sleep(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export default function BoardPreview() {
    const pieceDataRef = useRef<Record<string, PieceData>>({});
    const boardMapRef = useRef<Record<string, string>>({});
    const overlayIdRef = useRef(0);
    const cancelledRef = useRef(false);
    const [pieces, setPieces] = useState<RenderedPiece[]>([]);
    const [overlays, setOverlays] = useState<OverlayItem[]>([]);
    const [shimmerPhase, setShimmerPhase] = useState<
        "idle" | "mounted" | "running"
    >("idle");

    const render = () => {
        setPieces(
            Object.entries(pieceDataRef.current).map(([id, d]) => ({
                id,
                ...d,
            })),
        );
    };

    const addOverlay = (
        item: Omit<OverlayItem, "id" | "phase">,
        ttl: number,
    ) => {
        const id = ++overlayIdRef.current;
        setOverlays((prev) => [...prev, { id, phase: "in", ...item }]);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (cancelledRef.current) return;
                setOverlays((prev) =>
                    prev.map((o) => (o.id === id ? { ...o, phase: "out" } : o)),
                );
            });
        });
        setTimeout(() => {
            setOverlays((prev) => prev.filter((o) => o.id !== id));
        }, ttl);
    };

    const cascadeEntrance = async () => {
        pieceDataRef.current = {};
        boardMapRef.current = {};
        setOverlays([]);

        const list = startPosition();
        list.forEach(({ id, code, square }) => {
            const { col } = squareToRC(square);
            const isWhite = code[0] === "w";
            pieceDataRef.current[id] = {
                code,
                col,
                row: isWhite ? 9 : -2,
                noTransition: true,
            };
            boardMapRef.current[square] = id;
        });
        render();

        await sleep(60);
        if (cancelledRef.current) return;

        list
            .slice()
            .sort(
                (a, b) =>
                    Math.abs(squareToRC(a.square).col - 3.5) -
                    Math.abs(squareToRC(b.square).col - 3.5),
            )
            .forEach(({ id, square }, i) => {
                setTimeout(() => {
                    if (cancelledRef.current || !pieceDataRef.current[id]) return;
                    const { col, row } = squareToRC(square);
                    pieceDataRef.current[id] = {
                        ...pieceDataRef.current[id],
                        col,
                        row,
                        noTransition: false,
                    };
                    render();
                }, i * 24);
            });

        await sleep(list.length * 24 + 900);
    };

    const idleShimmer = async () => {
        setShimmerPhase("mounted");
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (!cancelledRef.current) setShimmerPhase("running");
            });
        });

        Object.keys(pieceDataRef.current).forEach((id, i) => {
            setTimeout(() => {
                if (cancelledRef.current || !pieceDataRef.current[id]) return;
                pieceDataRef.current[id] = {
                    ...pieceDataRef.current[id],
                    breathing: true,
                };
                render();
                setTimeout(() => {
                    if (cancelledRef.current || !pieceDataRef.current[id]) return;
                    pieceDataRef.current[id] = {
                        ...pieceDataRef.current[id],
                        breathing: false,
                    };
                    render();
                }, 900);
            }, (i % 8) * 40);
        });

        await sleep(1400);
        if (!cancelledRef.current) setShimmerPhase("idle");
    };

    const animateCapture = async (
        capturedId: string,
        rc: { col: number; row: number },
    ) => {
        if (!pieceDataRef.current[capturedId]) return;
        pieceDataRef.current[capturedId] = {
            ...pieceDataRef.current[capturedId],
            captured: true,
        };
        render();

        addOverlay({ kind: "flash", col: rc.col, row: rc.row }, 450);

        await sleep(350);
        delete pieceDataRef.current[capturedId];
        render();
    };

    const animateCheck = async (kingSquare: string) => {
        const rc = squareToRC(kingSquare);
        const kingId = boardMapRef.current[kingSquare];

        addOverlay({ kind: "check-ring", col: rc.col, row: rc.row }, 1500);

        if (kingId && pieceDataRef.current[kingId]) {
            pieceDataRef.current[kingId] = {
                ...pieceDataRef.current[kingId],
                inCheck: true,
            };
            render();
        }

        await sleep(1500);
        if (cancelledRef.current) return;

        if (kingId && pieceDataRef.current[kingId]) {
            pieceDataRef.current[kingId] = {
                ...pieceDataRef.current[kingId],
                inCheck: false,
            };
            render();
        }
    };

    const playMove = async (
        from: string,
        to: string,
        opts?: { capture?: boolean; check?: string },
    ) => {
        const fromRC = squareToRC(from);
        const toRC = squareToRC(to);
        const movingId = boardMapRef.current[from];
        if (!movingId) return;
        const movingData = pieceDataRef.current[movingId];

        addOverlay(
            { kind: "ghost", col: fromRC.col, row: fromRC.row, code: movingData.code },
            620,
        );

        if (opts?.capture) {
            const capturedId = boardMapRef.current[to];
            if (capturedId) await animateCapture(capturedId, toRC);
            if (cancelledRef.current) return;
        }

        pieceDataRef.current[movingId] = {
            ...pieceDataRef.current[movingId],
            col: toRC.col,
            row: toRC.row,
        };
        delete boardMapRef.current[from];
        boardMapRef.current[to] = movingId;
        render();

        addOverlay(
            { kind: "ring", col: toRC.col, row: toRC.row, danger: !!opts?.capture },
            680,
        );
        await sleep(620);
        if (cancelledRef.current) return;

        if (opts?.check) await animateCheck(opts.check);
    };

    useEffect(() => {
        cancelledRef.current = false;

        const runLoop = async () => {
            while (!cancelledRef.current) {
                await cascadeEntrance();
                if (cancelledRef.current) return;
                await idleShimmer();
                if (cancelledRef.current) return;

                await playMove("e2", "e4");
                await sleep(420);
                await playMove("e7", "e5");
                await sleep(420);
                await playMove("d1", "h5");
                await sleep(420);
                await playMove("b8", "c6");
                await sleep(420);
                await playMove("f1", "c4");
                await sleep(420);
                await playMove("g8", "f6");
                await sleep(500);
                await playMove("h5", "f7", { capture: true, check: "e8" });
                if (cancelledRef.current) return;

                await idleShimmer();
                await sleep(600);
            }
        };

        const start = () => {
            if (!cancelledRef.current) runLoop();
        };

        let idleId: number | undefined;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        if (typeof window.requestIdleCallback === "function") {
            idleId = window.requestIdleCallback(start, { timeout: 1000 });
        } else {
            timeoutId = setTimeout(start, 200);
        }

        return () => {
            cancelledRef.current = true;
            if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
            if (timeoutId !== undefined) clearTimeout(timeoutId);
        };
    }, []);

    return (
        <Box customClass="chess-board">
            <Box customClass="chess-board-grid">
                {Array.from({ length: 8 }, (_, r) =>
                    Array.from({ length: 8 }, (_, c) => {
                        const isLight = (r + c) % 2 === 0;
                        return (
                            <Box
                                key={`${r}-${c}`}
                                customClass="chess-board-square"
                                style={{
                                    backgroundColor: isLight ? "#c9b48a" : "#7a6440",
                                }}
                            >
                                {c === 0 && (
                                    <span
                                        className={`sq-corner-label sq-rank ${isLight ? "label-on-light" : "label-on-dark"}`}
                                    >
                                        {RANKS[r]}
                                    </span>
                                )}
                                {r === 7 && (
                                    <span
                                        className={`sq-corner-label sq-file ${isLight ? "label-on-light" : "label-on-dark"}`}
                                    >
                                        {FILES[c]}
                                    </span>
                                )}
                            </Box>
                        );
                    }),
                )}

                <Box customClass="board-preview-layer">
                    {pieces.map((p) => (
                        <Box
                            key={p.id}
                            customClass={classNames(
                                "board-preview-piece",
                                p.captured && "captured",
                                p.inCheck && "in-check",
                                p.breathing && "breathing",
                            )}
                            style={
                                {
                                    "--tx": `${p.col * 100}%`,
                                    "--ty": `${p.row * 100}%`,
                                    transform: "translate(var(--tx), var(--ty))",
                                    transition: p.noTransition ? "none" : undefined,
                                } as React.CSSProperties
                            }
                        >
                            <PieceIcon
                                code={p.code}
                                className="board-preview-piece-svg"
                            />
                        </Box>
                    ))}

                    {overlays.map((o) => {
                        if (o.kind === "ghost") {
                            return (
                                <Box
                                    key={o.id}
                                    customClass="board-preview-ghost"
                                    style={{
                                        transform:
                                            o.phase === "out"
                                                ? `translate(${o.col * 100}%, calc(${o.row * 100}% - 6px)) scale(0.82)`
                                                : `translate(${o.col * 100}%, ${o.row * 100}%)`,
                                        opacity: o.phase === "out" ? 0 : 0.55,
                                    }}
                                >
                                    <PieceIcon
                                        code={o.code!}
                                        className="board-preview-piece-svg"
                                    />
                                </Box>
                            );
                        }
                        if (o.kind === "ring") {
                            return (
                                <Box
                                    key={o.id}
                                    customClass={classNames(
                                        "board-preview-ring",
                                        o.danger && "danger",
                                    )}
                                    style={{
                                        transform: `translate(${o.col * 100}%, ${o.row * 100}%) scale(${o.phase === "out" ? 1.15 : 0.3})`,
                                        opacity: o.phase === "out" ? 0 : 0.9,
                                    }}
                                />
                            );
                        }
                        if (o.kind === "flash") {
                            return (
                                <Box
                                    key={o.id}
                                    customClass="board-preview-flash"
                                    style={{
                                        transform: `translate(${o.col * 100}%, ${o.row * 100}%)`,
                                        opacity: o.phase === "out" ? 0 : 1,
                                    }}
                                />
                            );
                        }
                        return (
                            <Box
                                key={o.id}
                                customClass="board-preview-check-ring"
                                style={{
                                    transform: `translate(${o.col * 100}%, ${o.row * 100}%)`,
                                }}
                            />
                        );
                    })}

                    {shimmerPhase !== "idle" && (
                        <Box
                            customClass={classNames(
                                "board-preview-shimmer",
                                shimmerPhase === "running" && "run",
                            )}
                        />
                    )}
                </Box>
            </Box>
        </Box>
    );
}
