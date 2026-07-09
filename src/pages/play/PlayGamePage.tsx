import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { toast } from "sonner";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import Button from "../../components/base/Button/Button";
import GameOverScreen from "./GameOverScreen";
import WagerBadge from "./WagerBadge";
import PlayerRow from "./PlayerRow";
import EvalBar from "./EvalBar";
import ChessBoard from "../../components/ChessBoard/ChessBoard";
import EnginePanel from "./EnginePanel";
import ActionButtons from "./ActionButtons";
import MoveHistory from "./MoveHistory";
import ChatPanel from "./ChatPanel";
import {
    type Difficulty,
    type GameMode,
    type TimeControl,
    DIFFICULTY_CONFIG,
} from "@/types/components";
import { useChessGame } from "@/hooks/useChessGame";
import { useStockfish } from "@/hooks/useStockfish";
import { useGameClock } from "@/hooks/useGameClock";
import { useBoardReview } from "@/hooks/useBoardReview";
import { useComputerOpponent } from "@/hooks/useComputerOpponent";
import { useInactivityTimeout } from "@/hooks/useInactivityTimeout";
import { fenToBoard } from "@/utils/fenToBoard";
import { callAPIInterface, getDisplayName } from "@/utils";
import { useReduxSelector } from "@/store/hooks";
import { getSocket } from "@/lib/socket";
import { useSocket } from "@/context/SocketContext";
import type { IgameEndedResponse, IopponentMoveResponse, IdrawOfferedResponse, IinactivityTimeoutResponse } from "@/types/types";
import type { IGameRestoreResponse } from "@/types/utils";

interface IPlayViewProps {
    mode: GameMode;
    difficulty: Difficulty;
    timeControl: TimeControl;
    playerColor?: "white" | "black";
    opponentName?: string;
    opponentRating?: number;
    gameId?: string;
    opponentId?: string;
    initialInactivitySeconds?: number;
    onNewGame: () => void;
}

type GameResult = "win" | "lose" | "draw";

function getGameOverInfo(
    inactiveOut: boolean,
    resigned: boolean,
    drawClaimed: boolean,
    timedOut: "w" | "b" | null,
    isCheckmate: boolean,
    isStalemate: boolean,
    turn: "w" | "b",
    playerSide: "w" | "b",
): { result: GameResult; reason: string } {
    if (inactiveOut) return { result: "lose", reason: "Inactivity" };
    if (resigned) return { result: "lose", reason: "Resignation" };
    if (drawClaimed) return { result: "draw", reason: "Agreement" };
    if (timedOut === playerSide) return { result: "lose", reason: "Timeout" };
    if (timedOut && timedOut !== playerSide) return { result: "win", reason: "Timeout" };
    if (isCheckmate)
        return { result: turn === playerSide ? "lose" : "win", reason: "Checkmate" };
    if (isStalemate) return { result: "draw", reason: "Stalemate" };
    return { result: "draw", reason: "Draw" };
}

export default function PlayGamePage({
    mode,
    difficulty,
    timeControl,
    playerColor,
    opponentName: opponentNameProp,
    opponentRating: opponentRatingProp,
    gameId,
    opponentId,
    initialInactivitySeconds,
    onNewGame,
}: IPlayViewProps) {
    const session = useReduxSelector((s) => s.auth.session);
    const { socket: ctxSocket } = useSocket();
    const gameRestoredRef = useRef(false);
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const userName = getDisplayName(session) || "You";
    const userLetter = session?.first_name?.[0]?.toUpperCase() ?? "?";

    // playerSide: "w" for pvc (always white) or when color=white; "b" when color=black
    const playerSide: "w" | "b" = playerColor === "black" ? "b" : "w";
    const boardFlipped = playerSide === "b";

    // ── Chess engine ──────────────────────────────────────────────────────────
    const game = useChessGame();
    const config = DIFFICULTY_CONFIG[difficulty];

    const { bestMove } = useStockfish(
        game.fen,
        config.depth,
        mode === "pvc" && game.turn === "b" && difficulty !== "easy",
        config.elo,
    );

    // ── Board interaction state ───────────────────────────────────────────────
    const [from, setFrom] = useState<string | null>(null);
    const [legalMoves, setLegalMoves] = useState<string[]>([]);
    const [flashSquare, setFlashSquare] = useState<string | null>(null);
    const [resigned, setResigned] = useState(false);
    const [drawClaimed, setDrawClaimed] = useState(false);
    const [panelTab, setPanelTab] = useState<"moves" | "chat">("moves");
    const [pvpEnded, setPvpEnded]                     = useState<{ result: GameResult; reason: string } | null>(null);
    const [pvpInactivityWarning, setPvpInactivityWarning] = useState<number | null>(null);
    const [drawOffered, setDrawOffered]               = useState(false);

    // ── Game restore on mount (PvP only) ─────────────────────────────────────
    // Runs when ctxSocket becomes available (handles page refresh timing).
    // gameRestoredRef prevents double-restore if socket instance changes.
    useEffect(() => {
        if (mode !== "pvp" || !gameId || !ctxSocket || gameRestoredRef.current) return;
        gameRestoredRef.current = true;
        ctxSocket.emit("rejoin_game", { game_id: gameId });
        callAPIInterface<undefined, IGameRestoreResponse>("GET", `/game/${gameId}`)
            .then(data => {
                if (data.status !== "ONGOING") { onNewGame(); return; }

                // If we refreshed right after making a move the DB write may not
                // have committed yet. Use the local buffer if it's ahead of the DB.
                const bufKey = `pvp_moves_${gameId}`;
                const bufRaw = sessionStorage.getItem(bufKey);
                const localBuf: Array<{ from: string; to: string; promotion: string | null }> | null =
                    bufRaw ? JSON.parse(bufRaw) : null;

                const movesToRestore =
                    localBuf && localBuf.length > data.moves.length
                        ? localBuf
                        : data.moves;

                if (movesToRestore.length > 0) game.restoreGame(movesToRestore);

                // If DB has caught up with our local buffer, we can drop it
                if (!localBuf || data.moves.length >= localBuf.length) {
                    sessionStorage.removeItem(bufKey);
                }
            })
            .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctxSocket, mode, gameId]);

    // ── Initial countdown for white (before first move is made) ──────────────
    useEffect(() => {
        if (mode !== "pvp" || playerColor !== "white" || !initialInactivitySeconds || !ctxSocket) return;
        if (countdownRef.current) return; // already running (e.g. strict-mode double-fire)
        let secs = initialInactivitySeconds;
        setPvpInactivityWarning(secs);
        countdownRef.current = setInterval(() => {
            secs -= 1;
            if (secs <= 0) {
                clearInterval(countdownRef.current!);
                countdownRef.current = null;
                setPvpInactivityWarning(null);
            } else {
                setPvpInactivityWarning(secs);
            }
        }, 1000);
        return () => {
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
                countdownRef.current = null;
            }
            setPvpInactivityWarning(null);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctxSocket, mode, playerColor]);

    // ── PvP socket listeners ──────────────────────────────────────────────────
    useEffect(() => {
        if (mode !== "pvp") return;
        const socket = ctxSocket ?? getSocket();
        if (!socket) return;

        const stopCountdown = () => {
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
                countdownRef.current = null;
            }
            setPvpInactivityWarning(null);
        };

        const onGameEnded = (data: IgameEndedResponse) => {
            stopCountdown();
            if (gameId) sessionStorage.removeItem(`pvp_moves_${gameId}`);
            const result: GameResult =
                data.winner_id === null ? "draw"
                : data.winner_id === session?.id ? "win"
                : "lose";
            setPvpEnded({ result, reason: data.reason ?? "Game over" });
            setDrawOffered(false);
        };

        const onOpponentMove = (data: IopponentMoveResponse) => {
            game.applyOpponentMove(data.from, data.to, data.promotion ?? null, data.fen);
            // Mirror opponent's move into the local buffer so a refresh
            // won't lose it even if the DB hasn't committed yet.
            if (gameId) {
                const key = `pvp_moves_${gameId}`;
                const buf: Array<{ from: string; to: string; promotion: string | null }> =
                    JSON.parse(sessionStorage.getItem(key) ?? "[]");
                buf.push({ from: data.from, to: data.to, promotion: data.promotion ?? null });
                sessionStorage.setItem(key, JSON.stringify(buf));
            }
            // Start visible countdown so player knows how long they have to move.
            if (data.inactivity_timeout_seconds) {
                stopCountdown();
                let secs = data.inactivity_timeout_seconds;
                setPvpInactivityWarning(secs);
                countdownRef.current = setInterval(() => {
                    secs -= 1;
                    if (secs <= 0) {
                        stopCountdown();
                    } else {
                        setPvpInactivityWarning(secs);
                    }
                }, 1000);
            }
        };

        const onOpponentDisconnected = () => {
            toast.warning("Opponent disconnected", {
                description: "Waiting for them to reconnect (45s)…",
                id: "opp-disconnected",
                duration: 45_000,
            });
        };

        const onOpponentReconnected = () => {
            toast.dismiss("opp-disconnected");
            toast.success("Opponent reconnected!");
        };

        const onInactivityTimeout = (data: IinactivityTimeoutResponse) => {
            if (!pvpEnded) {
                const result: GameResult = data.loser_id === session?.id ? "lose" : "win";
                setPvpEnded({ result, reason: "Inactivity" });
                setPvpInactivityWarning(null);
            }
        };

        const onDrawOffered = (_data: IdrawOfferedResponse) => {
            setDrawOffered(true);
            toast.info("Opponent offered a draw");
        };

        const onDrawRejected = () => {
            toast.info("Draw offer declined");
        };

        socket.on("game_ended",             onGameEnded);
        socket.on("opponent_move",           onOpponentMove);
        socket.on("inactivity_timeout",      onInactivityTimeout);
        socket.on("draw_offered",            onDrawOffered);
        socket.on("draw_rejected",           onDrawRejected);
        socket.on("opponent_disconnected",   onOpponentDisconnected);
        socket.on("opponent_reconnected",    onOpponentReconnected);

        return () => {
            socket.off("game_ended",            onGameEnded);
            socket.off("opponent_move",          onOpponentMove);
            socket.off("inactivity_timeout",     onInactivityTimeout);
            socket.off("draw_offered",           onDrawOffered);
            socket.off("draw_rejected",          onDrawRejected);
            socket.off("opponent_disconnected",  onOpponentDisconnected);
            socket.off("opponent_reconnected",   onOpponentReconnected);
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
                countdownRef.current = null;
            }
            setPvpInactivityWarning(null);
        };
    }, [mode, session?.id, pvpEnded, ctxSocket]);

    // ── Game-end hooks ────────────────────────────────────────────────────────
    const baseEnded = game.isGameOver || resigned || drawClaimed;
    const clock = useGameClock(timeControl, baseEnded, game.turn);
    const inactivity = useInactivityTimeout(
        mode === "pvp" ? true : (baseEnded || !!clock.timedOut),
        game.turn,
        game.fenHistory.length,
        playerSide,
    );
    const gameEnded = baseEnded || !!clock.timedOut || inactivity.inactiveOut || !!pvpEnded;

    // ── Computer opponent ─────────────────────────────────────────────────────
    const review = useBoardReview(game.fenHistory);
    useComputerOpponent({
        mode,
        difficulty,
        fen: game.fen,
        turn: game.turn,
        gameEnded,
        bestMove,
        makeMove: game.makeMove,
        getRandomMove: game.getRandomMove,
    });

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleSquareClick = (square: string) => {
        if (gameEnded || review.isReviewing) return;
        // pvc: only white moves; pvp with explicit color: only player's side moves
        if (mode === "pvc" && game.turn === "b") return;
        if (mode === "pvp" && playerColor && game.turn !== playerSide) return;

        if (!from) {
            const moves = game.getLegalMoves(square);
            if (moves.length > 0) {
                setFrom(square);
                setLegalMoves(moves);
            } else {
                setFlashSquare(square);
                setTimeout(() => setFlashSquare(null), 500);
            }
        } else if (from === square) {
            setFrom(null);
            setLegalMoves([]);
        } else if (legalMoves.includes(square)) {
            const result = game.makeMove(from, square);
            if (mode === "pvp" && gameId && opponentId && result) {
                getSocket()?.emit("move_made", {
                    game_id: gameId,
                    from,
                    to:      square,
                    ...(result.promotion && { promotion: result.promotion }),
                });
                if (countdownRef.current) {
                    clearInterval(countdownRef.current);
                    countdownRef.current = null;
                }
                setPvpInactivityWarning(null);
                // Buffer locally so a refresh before the DB write completes
                // doesn't lose this move (see restore effect).
                const key = `pvp_moves_${gameId}`;
                const buf: Array<{ from: string; to: string; promotion: string | null }> =
                    JSON.parse(sessionStorage.getItem(key) ?? "[]");
                buf.push({ from, to: square, promotion: result.promotion ?? null });
                sessionStorage.setItem(key, JSON.stringify(buf));
            }
            setFrom(null);
            setLegalMoves([]);
        } else {
            const moves = game.getLegalMoves(square);
            if (moves.length > 0) {
                setFrom(square);
                setLegalMoves(moves);
            } else {
                setFlashSquare(square);
                setTimeout(() => setFlashSquare(null), 500);
            }
        }
    };

    const handleNewGame = () => {
        game.resetGame();
        setFrom(null);
        setLegalMoves([]);
        setFlashSquare(null);
        setResigned(false);
        setDrawClaimed(false);
        setPvpEnded(null);
        setPvpInactivityWarning(null);
        setDrawOffered(false);
        clock.reset();
        inactivity.reset();
        onNewGame();
    };

    // ── Derived values ────────────────────────────────────────────────────────
    const oppSide: "w" | "b" = playerSide === "w" ? "b" : "w";
    const resolvedOpponentName =
        opponentNameProp ?? (mode === "pvc" ? "Computer" : "Opponent");
    const resolvedOpponentRating =
        opponentRatingProp ?? (mode === "pvc" ? config.rating : 1200);
    const opponentLetter = resolvedOpponentName[0]?.toUpperCase() ?? "?";
    const computerTurn = mode === "pvc" && game.turn === "b" && !gameEnded;

    // Assign timers: player always gets their side's clock
    const playerTimer = playerSide === "w" ? clock.whiteTimer : clock.blackTimer;
    const opponentTimer = oppSide === "w" ? clock.whiteTimer : clock.blackTimer;
    const playerTimerActive = !gameEnded && game.turn === playerSide && !computerTurn;
    const opponentTimerActive = !gameEnded && game.turn === oppSide;

    const board = fenToBoard(review.displayFen);
    const attackedSquares = game.getAttackedSquares();
    const checkSquare = game.inCheck ? game.kingSquare() : null;
    const stalemateSquare = game.isStalemate ? game.kingSquare() : null;

    const { result: localResult, reason: localReason } = getGameOverInfo(
        inactivity.inactiveOut,
        resigned,
        drawClaimed,
        clock.timedOut,
        game.isCheckmate,
        game.isStalemate,
        game.turn,
        playerSide,
    );
    const gameOverResult = pvpEnded?.result ?? localResult;
    const gameOverReason = pvpEnded?.reason ?? localReason;
    const lastRecord = game.moveHistory[game.moveHistory.length - 1];
    const totalMoves =
        game.moveHistory.length * 2 - (lastRecord?.b === "" ? 1 : 0);

    // ── Shared sub-trees (rendered in both mobile and desktop layouts) ────────
    const opponentRow = (
        <PlayerRow
            name={resolvedOpponentName}
            rating={resolvedOpponentRating}
            letter={opponentLetter}
            variant="danger"
            timer={opponentTimer}
            timerActive={opponentTimerActive}
            isThinking={computerTurn}
        />
    );
    const playerRow = (
        <PlayerRow
            name={userName}
            rating={session?.elo_rating ?? 1200}
            letter={userLetter}
            variant="primary"
            timer={playerTimer}
            timerActive={playerTimerActive}
            inactivityWarning={
                mode === "pvp"
                    ? (game.turn === playerSide ? pvpInactivityWarning : null)
                    : inactivity.secsLeft
            }
        />
    );
    const handleResign = () => {
        if (gameEnded) return;
        if (mode === "pvp" && gameId) {
            getSocket()?.emit("resign_game", { game_id: gameId });
        } else {
            setResigned(true);
        }
    };

    const handleDraw = () => {
        if (gameEnded) return;
        if (mode === "pvp" && gameId) {
            getSocket()?.emit("offer_draw", { game_id: gameId });
        } else {
            setDrawClaimed(true);
        }
    };

    const handleAcceptDraw = () => {
        if (gameId) getSocket()?.emit("accept_draw", { game_id: gameId });
        setDrawOffered(false);
    };

    const handleDeclineDraw = () => {
        if (gameId) getSocket()?.emit("reject_draw", { game_id: gameId });
        setDrawOffered(false);
    };

    const actionButtons = (
        <>
            {drawOffered && !gameEnded && (
                <Box customClass="draw-offer-banner">
                    <Text as="span" customClass="draw-offer-text">Opponent offered a draw</Text>
                    <Box customClass="draw-offer-actions">
                        <Button variant="primary" size="sm" onClick={handleAcceptDraw}>Accept</Button>
                        <Button variant="ghost"   size="sm" onClick={handleDeclineDraw}>Decline</Button>
                    </Box>
                </Box>
            )}
            <ActionButtons
                onNewGame={handleNewGame}
                onResign={handleResign}
                onDraw={handleDraw}
                disabled={gameEnded}
            />
        </>
    );
    const panel = (
        <>
            {mode === "pvp" && (
                <Box customClass="game-tabs">
                    {(["moves", "chat"] as const).map((tab) => (
                        <button
                            key={tab}
                            className={clsx("game-tab", panelTab === tab && "active")}
                            onClick={() => setPanelTab(tab)}
                        >
                            <Text as="span" customClass="game-tab-label">{tab}</Text>
                        </button>
                    ))}
                </Box>
            )}
            {panelTab === "chat" ? (
                <ChatPanel />
            ) : (
                <MoveHistory
                    moves={game.moveHistory}
                    fenHistory={game.fenHistory}
                    viewIndex={review.viewIndex}
                    onGoBack={review.goBack}
                    onGoForward={review.goForward}
                    onJumpTo={review.jumpTo}
                />
            )}
        </>
    );

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <Box customClass="play-view">
            {gameEnded && (
                <GameOverScreen
                    result={gameOverResult}
                    reason={gameOverReason}
                    opponentName={resolvedOpponentName}
                    opponentRating={resolvedOpponentRating}
                    totalMoves={totalMoves}
                    elapsedTime={clock.elapsedFormatted}
                    onNewGame={handleNewGame}
                    onClose={onNewGame}
                />
            )}

            {/* Mobile top bar */}
            <Box customClass="play-top-bar">
                <WagerBadge mode={mode} difficulty={difficulty} />
                {opponentRow}
            </Box>

            {/* Main layout: board + side panel */}
            <Box customClass="play-main">
                <Box customClass="play-board-col">
                    <EvalBar evalPct={57} />
                    <ChessBoard
                        board={board}
                        selectedSquare={from}
                        legalMoves={legalMoves}
                        attackedSquares={attackedSquares}
                        checkSquare={checkSquare}
                        stalemateSquare={stalemateSquare}
                        flashSquare={flashSquare}
                        onSquareClick={handleSquareClick}
                        lastMove={game.lastMove}
                        flipped={boardFlipped}
                    />
                </Box>
                <Box customClass="play-panel-col">
                    <WagerBadge mode={mode} difficulty={difficulty} />
                    {opponentRow}
                    {mode === "pvc" && <EnginePanel />}
                    {playerRow}
                    {actionButtons}
                    {panel}
                </Box>
            </Box>

            {/* Mobile bottom bar */}
            <Box customClass="play-bottom-bar">
                {mode === "pvc" && <EnginePanel />}
                {playerRow}
                {actionButtons}
                {panel}
            </Box>
        </Box>
    );
}
