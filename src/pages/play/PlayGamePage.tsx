import { useState, useEffect, useRef } from "react";
import { useBlocker } from "react-router";
import { toast } from "sonner";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import Button from "../../components/base/Button/Button";
import { Modal } from "@/components/base/Modal/Modal";
import GameOverScreen from "./GameOverScreen";
import WagerBadge from "./WagerBadge";
import PlayerRow from "./PlayerRow";
import EvalBar from "./EvalBar";
import Board from "../../components/board/Board";
import EnginePanel from "./EnginePanel";
import ActionButtons from "./ActionButtons";
import MoveHistory from "./MoveHistory";
import {
    type Difficulty,
    type GameMode,
    type TimeControl,
    DIFFICULTY_CONFIG,
    TIME_SECONDS,
    getInactivitySeconds,
} from "@/types/components";
import { useChessGame } from "@/hooks/useChessGame";
import { useStockfish } from "@/hooks/useStockfish";
import { useGameClock } from "@/hooks/useGameClock";
import { useBoardReview } from "@/hooks/useBoardReview";
import { useComputerOpponent } from "@/hooks/useComputerOpponent";
import { useInactivityTimeout } from "@/hooks/useInactivityTimeout";
import { useRematch } from "@/hooks/useRematch";
import { useGameAccuracy } from "@/hooks/useGameAccuracy";
import { useTabLock } from "@/hooks/useTabLock";
import { fenToBoard } from "@/utils/fenToBoard";
import { callAPIInterface, getDisplayName } from "@/utils";
import { useReduxSelector } from "@/store/hooks";
import { getSocket } from "@/lib/socket";
import { playSound } from "@/lib/sounds";
import { useSocket } from "@/context/SocketContext";
import {
    playReasonInactivity,
    playReasonResignation,
    playReasonAgreement,
    playReasonTimeout,
    playReasonCheckmate,
    playReasonStalemate,
    playReasonDraw,
    playReasonGameOver,
    playOpponentFallbackComputer,
    playOpponentFallbackOpponent,
    playToastOpponentDisconnectedTitle,
    playToastOpponentReconnected,
    playToastOpponentOfferedDraw,
    playToastDrawDeclined,
    playDrawOfferBannerText,
    playDrawOfferBannerAcceptButton,
    playDrawOfferBannerDeclineButton,
    playQuitDialogTitle,
    playQuitDialogPvpDescription,
    playQuitDialogPvcDescription,
    playQuitDialogStayButton,
    playQuitDialogQuitButton,
    playResignDialogTitle,
    playResignDialogPvpDescription,
    playResignDialogPvcDescription,
    playResignDialogKeepPlayingButton,
    playResignDialogResignButton,
    playPromotionTitle,
    playPromotionQueen,
    playPromotionRook,
    playPromotionBishop,
    playPromotionKnight,
} from "@/components/messages";
import type {
    IgameEndedResponse,
    IopponentMoveResponse,
    IdrawOfferedResponse,
    IinactivityTimeoutResponse,
    IMoveConfirmedResponse,
    IClockUpdateResponse,
    IGameSettlement,
} from "@/types/types";
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
    opponentAvatarSeed?: string;
    initialInactivitySeconds?: number;
    stakeAmount?: number;
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
    if (inactiveOut) return { result: "lose", reason: playReasonInactivity };
    if (resigned) return { result: "lose", reason: playReasonResignation };
    if (drawClaimed) return { result: "draw", reason: playReasonAgreement };
    if (timedOut === playerSide)
        return { result: "lose", reason: playReasonTimeout };
    if (timedOut && timedOut !== playerSide)
        return { result: "win", reason: playReasonTimeout };
    if (isCheckmate)
        return {
            result: turn === playerSide ? "lose" : "win",
            reason: playReasonCheckmate,
        };
    if (isStalemate) return { result: "draw", reason: playReasonStalemate };
    return { result: "draw", reason: playReasonDraw };
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
    opponentAvatarSeed: opponentAvatarSeedProp,
    initialInactivitySeconds,
    stakeAmount,
    onNewGame,
}: IPlayViewProps) {
    const session = useReduxSelector((s) => s.auth.session);
    const { socket: ctxSocket } = useSocket();
    const gameRestoredRef = useRef(false);
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const disconnCountdownRef = useRef<ReturnType<typeof setInterval> | null>(
        null,
    );
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
    const [resignDialogOpen, setResignDialogOpen] = useState(false);
    const [drawClaimed, setDrawClaimed] = useState(false);
    const [pvpEnded, setPvpEnded] = useState<{
        result: GameResult;
        reason: string;
        settlement: IGameSettlement | null;
        eloGain?: number;
        streak?: number;
    } | null>(null);
    const [pvpInactivityWarning, setPvpInactivityWarning] = useState<
        number | null
    >(null);
    const [drawOffered, setDrawOffered] = useState(false);
    const [myDrawOfferPending, setMyDrawOfferPending] = useState(false);
    const [opponentDisconnected, setOpponentDisconnected] = useState(false);
    const [pendingPromotion, setPendingPromotion] = useState<{
        from: string;
        to: string;
    } | null>(null);

    useEffect(() => {
        if (mode !== "pvp" || !gameId || !ctxSocket || gameRestoredRef.current)
            return;
        gameRestoredRef.current = true;
        callAPIInterface<undefined, IGameRestoreResponse>(
            "GET",
            `/game/${gameId}`,
        )
            .then((data) => {
                if (data.status !== "ONGOING") {
                    onNewGame();
                    return;
                }

                // If we refreshed right after making a move the DB write may not
                // have committed yet. Use the local buffer if it's ahead of the DB.
                const bufKey = `pvp_moves_${gameId}`;
                const bufRaw = sessionStorage.getItem(bufKey);
                const localBuf: Array<{
                    from: string;
                    to: string;
                    promotion: string | null;
                }> | null = bufRaw ? JSON.parse(bufRaw) : null;

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

    useEffect(() => {
        if (mode !== "pvp" || !gameId || !ctxSocket) return;

        const rejoin = () => ctxSocket.emit("rejoin_game", { game_id: gameId });

        if (ctxSocket.connected) rejoin();
        ctxSocket.on("connect", rejoin);

        return () => {
            ctxSocket.off("connect", rejoin);
        };
    }, [mode, gameId, ctxSocket]);

    useEffect(() => {
        if (
            mode !== "pvp" ||
            playerColor !== "white" ||
            !initialInactivitySeconds ||
            !ctxSocket
        )
            return;
        if (countdownRef.current) return;
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

        const stopDisconnCountdown = () => {
            if (disconnCountdownRef.current) {
                clearInterval(disconnCountdownRef.current);
                disconnCountdownRef.current = null;
            }
        };

        const onGameEnded = (data: IgameEndedResponse) => {
            stopCountdown();
            stopDisconnCountdown();
            toast.dismiss("opp-disconnected");
            if (gameId) sessionStorage.removeItem(`pvp_moves_${gameId}`);
            const result: GameResult =
                data.winner_id === null
                    ? "draw"
                    : data.winner_id === session?.id
                      ? "win"
                      : "lose";
            setPvpEnded({
                result,
                reason: data.reason ?? playReasonGameOver,
                settlement: data.settlement,
                eloGain: data.your_elo_gain,
                streak: data.your_streak,
            });
            setDrawOffered(false);
        };

        const onOpponentMove = (data: IopponentMoveResponse) => {
            game.applyOpponentMove(
                data.from,
                data.to,
                data.promotion ?? null,
                data.fen,
            );
            // Mirror opponent's move into the local buffer so a refresh
            // won't lose it even if the DB hasn't committed yet.
            if (gameId) {
                const key = `pvp_moves_${gameId}`;
                const buf: Array<{
                    from: string;
                    to: string;
                    promotion: string | null;
                }> = JSON.parse(sessionStorage.getItem(key) ?? "[]");
                buf.push({
                    from: data.from,
                    to: data.to,
                    promotion: data.promotion ?? null,
                });
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

        const onMoveConfirmed = (data: IMoveConfirmedResponse) => {
            game.confirmMove(data.fen);
        };

        const onOpponentDisconnected = (data?: {
            grace_period_seconds?: number;
        }) => {
            setOpponentDisconnected(true);
            stopDisconnCountdown();
            const totalSecs = data?.grace_period_seconds ?? 60;
            let secs = totalSecs;

            const showToast = (remaining: number) => {
                toast.warning(playToastOpponentDisconnectedTitle, {
                    description: `Waiting for them to reconnect (${remaining}s)…`,
                    id: "opp-disconnected",
                    duration: (remaining + 2) * 1000,
                });
            };

            showToast(secs);
            disconnCountdownRef.current = setInterval(() => {
                secs -= 1;
                if (secs <= 0) {
                    stopDisconnCountdown();
                    toast.dismiss("opp-disconnected");
                } else {
                    showToast(secs);
                }
            }, 1000);
        };

        const onOpponentReconnected = () => {
            setOpponentDisconnected(false);
            stopDisconnCountdown();
            toast.dismiss("opp-disconnected");
            toast.success(playToastOpponentReconnected);
        };

        const onInactivityTimeout = (data: IinactivityTimeoutResponse) => {
            if (!pvpEnded) {
                const result: GameResult =
                    data.loser_id === session?.id ? "lose" : "win";
                setPvpEnded({
                    result,
                    reason: playReasonInactivity,
                    settlement: data.settlement,
                    eloGain: data.your_elo_gain,
                });
                setPvpInactivityWarning(null);
            }
        };

        const onDrawOffered = (_data: IdrawOfferedResponse) => {
            setDrawOffered(true);
            toast.info(playToastOpponentOfferedDraw);
        };

        const onDrawRejected = () => {
            setMyDrawOfferPending(false);
            toast.info(playToastDrawDeclined);
        };

        socket.on("game_ended", onGameEnded);
        socket.on("opponent_move", onOpponentMove);
        socket.on("move_confirmed", onMoveConfirmed);
        socket.on("inactivity_timeout", onInactivityTimeout);
        socket.on("draw_offered", onDrawOffered);
        socket.on("draw_rejected", onDrawRejected);
        socket.on("opponent_disconnected", onOpponentDisconnected);
        socket.on("opponent_reconnected", onOpponentReconnected);
        socket.on("tab_superseded", notifySuperseded);

        return () => {
            socket.off("game_ended", onGameEnded);
            socket.off("opponent_move", onOpponentMove);
            socket.off("move_confirmed", onMoveConfirmed);
            socket.off("inactivity_timeout", onInactivityTimeout);
            socket.off("draw_offered", onDrawOffered);
            socket.off("draw_rejected", onDrawRejected);
            socket.off("opponent_disconnected", onOpponentDisconnected);
            socket.off("opponent_reconnected", onOpponentReconnected);
            socket.off("tab_superseded", notifySuperseded);
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
                countdownRef.current = null;
            }
            if (disconnCountdownRef.current) {
                clearInterval(disconnCountdownRef.current);
                disconnCountdownRef.current = null;
            }
            toast.dismiss("opp-disconnected");
            setPvpInactivityWarning(null);
        };
    }, [mode, session?.id, pvpEnded, ctxSocket]);

    const baseEnded = game.isGameOver || resigned || drawClaimed;
    const clock = useGameClock(
        timeControl,
        baseEnded || opponentDisconnected,
        game.turn,
    );
    const inactivity = useInactivityTimeout(
        mode === "pvp" ? true : baseEnded || !!clock.timedOut,
        game.turn,
        game.fenHistory.length,
        playerSide,
        mode === "pvc"
            ? getInactivitySeconds(TIME_SECONDS[timeControl])
            : undefined,
    );

    const gameEnded =
        baseEnded ||
        (mode === "pvc" && !!clock.timedOut) ||
        inactivity.inactiveOut ||
        !!pvpEnded;

    const { accuracy, analyzing: analyzingAccuracy } = useGameAccuracy(
        game.fenHistory,
        playerSide,
        gameEnded,
    );

    // ── Confirm before leaving an in-progress game ────────────────────────────
    // In-app navigation (clicking Lobby/Match/etc, or the browser back button)
    // never disconnects the socket — the game would just sit ONGOING with no
    // one driving it. Block that navigation and ask first; on confirm, resign
    // (pvp) so the opponent gets a real result instead of a hung game.
    const blocker = useBlocker(!gameEnded);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (gameEnded) return;
            e.preventDefault();
            e.returnValue = "";
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [gameEnded]);

    const confirmQuit = () => {
        if (mode === "pvp" && gameId && !gameEnded) {
            getSocket()?.emit("resign_game", { game_id: gameId });
        }
        blocker.proceed?.();
    };

    // ── Server-authoritative clock (pvp) ──────────────────────────────────────
    // The server tracks the real clock and pushes it on every move; ours is
    // just a visual countdown between updates, re-synced here to correct drift.
    useEffect(() => {
        if (mode !== "pvp") return;
        const socket = ctxSocket ?? getSocket();
        if (!socket) return;

        const onClockUpdate = (data: IClockUpdateResponse) => {
            clock.syncClock(data.white_remaining_ms, data.black_remaining_ms);
        };

        socket.on("clock_update", onClockUpdate);
        return () => {
            socket.off("clock_update", onClockUpdate);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, ctxSocket]);

    // ── Sound effects ─────────────────────────────────────────────────────────
    useEffect(() => {
        playSound("game-start");
    }, []);

    const gameEndSoundPlayedRef = useRef(false);
    useEffect(() => {
        if (gameEnded && !game.isGameOver && !gameEndSoundPlayedRef.current) {
            gameEndSoundPlayedRef.current = true;
            playSound("game-end");
        }
    }, [gameEnded, game.isGameOver]);

    // ── Two-tab prevention (pvp only) ────────────────────────────────────────
    const { tabLockStatus, takeOver, notifySuperseded } = useTabLock(
        gameId,
        mode,
    );

    // ── Quick rematch (pvp only) ──────────────────────────────────────────────
    const rematch = useRematch(mode === "pvp" ? gameId : undefined);

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
    const handlePromotionChoice = (piece: "q" | "r" | "b" | "n") => {
        if (!pendingPromotion) return;
        const { from: pFrom, to: pTo } = pendingPromotion;
        const result = game.makeMove(pFrom, pTo, piece);
        if (mode === "pvp" && gameId && opponentId && result) {
            getSocket()?.emit("move_made", {
                game_id: gameId,
                from: pFrom,
                to: pTo,
                promotion: piece,
            });
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
                countdownRef.current = null;
            }
            setPvpInactivityWarning(null);
            const key = `pvp_moves_${gameId}`;
            const buf: Array<{
                from: string;
                to: string;
                promotion: string | null;
            }> = JSON.parse(sessionStorage.getItem(key) ?? "[]");
            buf.push({ from: pFrom, to: pTo, promotion: piece });
            sessionStorage.setItem(key, JSON.stringify(buf));
        }
        setPendingPromotion(null);
        setFrom(null);
        setLegalMoves([]);
    };

    const handleSquareClick = (square: string) => {
        if (gameEnded || review.isReviewing || pendingPromotion) return;
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
            if (game.isPromotionMove(from, square)) {
                setPendingPromotion({ from, to: square });
                return;
            }
            const result = game.makeMove(from, square);
            if (mode === "pvp" && gameId && opponentId && result) {
                getSocket()?.emit("move_made", {
                    game_id: gameId,
                    from,
                    to: square,
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
                const buf: Array<{
                    from: string;
                    to: string;
                    promotion: string | null;
                }> = JSON.parse(sessionStorage.getItem(key) ?? "[]");
                buf.push({
                    from,
                    to: square,
                    promotion: result.promotion ?? null,
                });
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

    const handleTakeOver = () => {
        takeOver();
        getSocket()?.emit("rejoin_game", { game_id: gameId });
    };

    const handleNewGame = () => {
        if (mode === "pvp" && !gameEnded) return;
        game.resetGame();
        setFrom(null);
        setLegalMoves([]);
        setFlashSquare(null);
        setResigned(false);
        setDrawClaimed(false);
        setPvpEnded(null);
        setPvpInactivityWarning(null);
        setDrawOffered(false);
        setMyDrawOfferPending(false);
        setPendingPromotion(null);
        clock.reset();
        inactivity.reset();
        onNewGame();
    };

    // ── Derived values ────────────────────────────────────────────────────────
    const oppSide: "w" | "b" = playerSide === "w" ? "b" : "w";
    const resolvedOpponentName =
        opponentNameProp ??
        (mode === "pvc"
            ? playOpponentFallbackComputer
            : playOpponentFallbackOpponent);
    const resolvedOpponentRating =
        opponentRatingProp ?? (mode === "pvc" ? config.rating : 1200);
    const opponentLetter = resolvedOpponentName[0]?.toUpperCase() ?? "?";
    const computerTurn = mode === "pvc" && game.turn === "b" && !gameEnded;

    // Assign timers: player always gets their side's clock
    const playerTimer =
        playerSide === "w" ? clock.whiteTimer : clock.blackTimer;
    const opponentTimer = oppSide === "w" ? clock.whiteTimer : clock.blackTimer;
    const playerTimerActive =
        !gameEnded && game.turn === playerSide && !computerTurn;
    const opponentTimerActive = !gameEnded && game.turn === oppSide;

    const board = fenToBoard(review.displayFen);
    // Threat/danger hints are an assistance feature — fine for practice
    // against the computer, unfair when a real-money opponent is on the
    // other side, so they're simply not computed at all in pvp.
    const attackedSquares = mode === "pvp" ? [] : game.getAttackedSquares();
    const checkSquare = game.inCheck ? game.kingSquare() : null;
    const stalemateSquare = game.isStalemate ? game.kingSquare() : null;
    const captured = game.getCapturedPieces();

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
    const settlementSide =
        gameOverResult === "win"
            ? pvpEnded?.settlement?.winner
            : gameOverResult === "lose"
              ? pvpEnded?.settlement?.loser
              : undefined;
    const lastRecord = game.moveHistory[game.moveHistory.length - 1];
    const totalMoves =
        game.moveHistory.length * 2 - (lastRecord?.b === "" ? 1 : 0);

    const opponentRow = (
        <PlayerRow
            name={resolvedOpponentName}
            rating={resolvedOpponentRating}
            letter={opponentLetter}
            avatarSeed={opponentAvatarSeedProp}
            variant="danger"
            timer={opponentTimer}
            timerActive={opponentTimerActive}
            isThinking={computerTurn}
            pieceColor={oppSide === "w" ? "white" : "black"}
            capturedPieces={
                oppSide === "w" ? captured.byBlack : captured.byWhite
            }
        />
    );
    const playerRow = (
        <PlayerRow
            name={userName}
            rating={session?.elo_rating ?? 1200}
            letter={userLetter}
            avatarSeed={session?.avatar_seed}
            variant="primary"
            timer={playerTimer}
            timerActive={playerTimerActive}
            inactivityWarning={
                mode === "pvp"
                    ? game.turn === playerSide
                        ? pvpInactivityWarning
                        : null
                    : inactivity.secsLeft
            }
            pieceColor={playerSide === "w" ? "white" : "black"}
            capturedPieces={
                playerSide === "w" ? captured.byBlack : captured.byWhite
            }
            streak={mode === "pvp" ? (session?.current_streak ?? 0) : undefined}
        />
    );
    const handleResign = () => {
        if (gameEnded) return;
        setResignDialogOpen(true);
    };

    const confirmResign = () => {
        setResignDialogOpen(false);
        if (gameEnded) return;
        if (mode === "pvp" && gameId) {
            getSocket()?.emit("resign_game", { game_id: gameId });
        } else {
            setResigned(true);
        }
    };

    const handleDraw = () => {
        if (gameEnded || myDrawOfferPending) return;
        if (mode === "pvp" && gameId) {
            getSocket()?.emit("offer_draw", { game_id: gameId });
            setMyDrawOfferPending(true);
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
                    <Text as="span" customClass="draw-offer-text">
                        {playDrawOfferBannerText}
                    </Text>
                    <Box customClass="draw-offer-actions">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleAcceptDraw}
                        >
                            {playDrawOfferBannerAcceptButton}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDeclineDraw}
                        >
                            {playDrawOfferBannerDeclineButton}
                        </Button>
                    </Box>
                </Box>
            )}
            <ActionButtons
                mode={mode}
                onResign={handleResign}
                onDraw={handleDraw}
                disabled={gameEnded}
                drawDisabled={myDrawOfferPending}
            />
        </>
    );
    const panel = (
        <MoveHistory
            moves={game.moveHistory}
            fenHistory={game.fenHistory}
            viewIndex={review.viewIndex}
            onGoBack={review.goBack}
            onGoForward={review.goForward}
            onJumpTo={review.jumpTo}
        />
    );

    return (
        <Box customClass="play-view">
            <Modal
                open={blocker.state === "blocked"}
                title={playQuitDialogTitle}
                customClass="modal--danger"
                preventOutsideClose
            >
                <p className="modal-description">
                    {mode === "pvp"
                        ? playQuitDialogPvpDescription(stakeAmount ?? 0)
                        : playQuitDialogPvcDescription}
                </p>
                <Box customClass="cta-btn-row">
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={() => blocker.reset?.()}
                    >
                        {playQuitDialogStayButton}
                    </Button>
                    <Button variant="danger" fullWidth onClick={confirmQuit}>
                        {playQuitDialogQuitButton}
                    </Button>
                </Box>
            </Modal>

            <Modal
                open={resignDialogOpen}
                onClose={() => setResignDialogOpen(false)}
                title={playResignDialogTitle}
                customClass="modal--danger"
                preventOutsideClose
            >
                <p className="modal-description">
                    {mode === "pvp"
                        ? playResignDialogPvpDescription(stakeAmount ?? 0)
                        : playResignDialogPvcDescription}
                </p>
                <Box customClass="cta-btn-row">
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={() => setResignDialogOpen(false)}
                    >
                        {playResignDialogKeepPlayingButton}
                    </Button>
                    <Button variant="danger" fullWidth onClick={confirmResign}>
                        {playResignDialogResignButton}
                    </Button>
                </Box>
            </Modal>

            {tabLockStatus !== "primary" && !gameEnded && (
                <Box customClass="tab-lock-overlay">
                    <Box customClass="tab-lock-panel">
                        <Text as="span" customClass="tab-lock-icon">
                            {tabLockStatus === "secondary" ? "🎮" : "📡"}
                        </Text>
                        <Text as="p" customClass="tab-lock-title">
                            {tabLockStatus === "secondary"
                                ? "Game open in another tab"
                                : "Session moved to another tab"}
                        </Text>
                        <Text as="p" customClass="tab-lock-sub">
                            {tabLockStatus === "secondary"
                                ? "Only one tab can play at a time."
                                : "Your moves are no longer accepted here."}
                        </Text>
                        <Box customClass="tab-lock-actions">
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={handleTakeOver}
                            >
                                {tabLockStatus === "secondary"
                                    ? "Take Over"
                                    : "Rejoin Here"}
                            </Button>
                            <Button
                                variant="ghost"
                                fullWidth
                                onClick={onNewGame}
                            >
                                Leave Game
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}

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
                    canRematch={mode === "pvp" && !!gameId}
                    rematchStatus={rematch.status}
                    rematchSecondsLeft={rematch.secondsLeft}
                    onRematch={rematch.offerRematch}
                    settlementUsd={settlementSide?.usd}
                    ratingDelta={pvpEnded?.eloGain}
                    accuracy={accuracy}
                    analyzingAccuracy={analyzingAccuracy}
                    mode={mode}
                    streakCount={pvpEnded?.streak}
                />
            )}

            <Box customClass="play-top-bar">
                <WagerBadge
                    mode={mode}
                    difficulty={difficulty}
                    stakeAmount={stakeAmount}
                />
                {opponentRow}
            </Box>

            <Box customClass="play-main">
                <WagerBadge
                    mode={mode}
                    difficulty={difficulty}
                    stakeAmount={stakeAmount}
                />
                {opponentRow}
                <Box customClass="play-board-row">
                    <Box customClass="play-board-col">
                        <EvalBar evalPct={57} />
                        <Board
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
                        {pendingPromotion && !gameEnded && (
                            <Box customClass="promo-overlay">
                                <Box
                                    customClass="promo-overlay__backdrop"
                                    onClick={() => {
                                        setPendingPromotion(null);
                                        setFrom(null);
                                        setLegalMoves([]);
                                    }}
                                />
                                <Box customClass="promo-overlay__panel">
                                    <Text
                                        as="p"
                                        customClass="promo-overlay__title"
                                    >
                                        {playPromotionTitle}
                                    </Text>
                                    <Box customClass="promo-overlay__options">
                                        {(
                                            [
                                                {
                                                    piece: "q",
                                                    label: playPromotionQueen,
                                                    w: "♕",
                                                    b: "♛",
                                                },
                                                {
                                                    piece: "r",
                                                    label: playPromotionRook,
                                                    w: "♖",
                                                    b: "♜",
                                                },
                                                {
                                                    piece: "b",
                                                    label: playPromotionBishop,
                                                    w: "♗",
                                                    b: "♝",
                                                },
                                                {
                                                    piece: "n",
                                                    label: playPromotionKnight,
                                                    w: "♘",
                                                    b: "♞",
                                                },
                                            ] as const
                                        ).map(({ piece, label, w, b }) => (
                                            <Button
                                                key={piece}
                                                variant="outline"
                                                customClass="promo-overlay__option"
                                                onClick={() =>
                                                    handlePromotionChoice(piece)
                                                }
                                            >
                                                <Text
                                                    as="span"
                                                    customClass="promo-overlay__symbol"
                                                >
                                                    {playerSide === "w" ? w : b}
                                                </Text>
                                                <Text
                                                    as="span"
                                                    customClass="promo-overlay__label"
                                                >
                                                    {label}
                                                </Text>
                                            </Button>
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Box>
                    <Box customClass="play-notation-col">
                        {mode === "pvc" && <EnginePanel />}
                        {panel}
                        {actionButtons}
                    </Box>
                </Box>
                {playerRow}
            </Box>

            {/* Mobile bottom bar */}
            <Box customClass="play-bottom-bar">
                {mode === "pvc" && <EnginePanel />}
                {playerRow}
                {panel}
                {actionButtons}
            </Box>
        </Box>
    );
}
