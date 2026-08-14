import { useCallback, useEffect, useRef, useState } from "react";
import {
    useSearchParams,
    useNavigate,
    useBlocker,
    Navigate,
} from "react-router";
import classNames from "classnames";
import { showToast } from "@/redux/toast.slice";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Skeleton from "@/components/base/Skeleton/Skeleton";
import ChessBoard from "@/components/board/Board";
import PieceIcon from "@/components/board/PieceIcon";
import { useChessGame } from "@/hooks/useChessGame";
import { useBoardReview } from "@/hooks/useBoardReview";
import { useGameClock } from "@/hooks/useGameClock";
import { useTabLock } from "@/hooks/useTabLock";
import { useRematch } from "@/hooks/useRematch";
import { useStockfish } from "@/hooks/useStockfish";
import { useComputerOpponent } from "@/hooks/useComputerOpponent";
import { useSocket } from "@/context/SocketContext";
import { useWalletBalance } from "@/hooks/useWallet";
import { useReduxSelector, useReduxDispatch } from "@/redux/hooks";
import { formateAmount } from "@/utils/formate";
import { DIFFICULTY_CONFIG } from "@/types/components";
import type { TimeControl, GameMode, Difficulty } from "@/types/components";
import type {
    IopponentMoveResponse,
    IMoveConfirmedResponse,
    IClockUpdateResponse,
    IdrawOfferedResponse,
    IdrawRejectedResponse,
    IgameEndedResponse,
    ISocketErrorResponse,
    IopponentDisconnectedResponse,
    IopponentReconnectedResponse,
    IgameRestoreResponse,
    GameCategory,
} from "@/types/types";
import {
    playOpponentFallbackOpponent,
    playOpponentFallbackComputer,
    playResignDialogPvcDescription,
    playWagerBadgeDifficultyLabels,
    playActionButtonsResign,
    playActionButtonsDraw,
    playResignDialogTitle,
    playResignDialogPvpDescription,
    playResignDialogKeepPlayingButton,
    playResignDialogResignButton,
    playDrawOfferBannerText,
    playDrawOfferBannerAcceptButton,
    playDrawOfferBannerDeclineButton,
    playToastDrawDeclined,
    playToastOpponentDisconnectedTitle,
    playToastOpponentDisconnectedDesc,
    playToastOpponentReconnected,
    playGameOverHeaderWin,
    playGameOverHeaderDraw,
    playGameOverHeaderLose,
    playGameOverSettlementLabel,
    playGameOverNewGameButton,
    playGameOverRematchButton,
    playGameOverWaitingForOpponent,
    playGameOverAcceptRematchButton,
    playReasonCheckmate,
    playReasonResignation,
    playReasonStalemate,
    playReasonDraw,
    playReasonTimeout,
    playReasonInactivity,
    playReasonGameOver,
    playMoveHistoryReviewing,
    playPromotionTitle,
    playPromotionQueen,
    playPromotionRook,
    playPromotionBishop,
    playPromotionKnight,
    matchmakingPoolCardInsufficientBalance,
    leaderboardRankFallback,
} from "@/constants/messages";
import Button from "@/components/base/Button/Button";
import Modal from "@/components/base/Modal/Modal";

const REASON_LABEL: Record<string, string> = {
    checkmate: playReasonCheckmate,
    resign: playReasonResignation,
    draw: playReasonDraw,
    stalemate: playReasonStalemate,
    timeout: playReasonTimeout,
    opponent_disconnected: playReasonInactivity,
};

const PROMOTION_PIECES = ["q", "r", "b", "n"] as const;
const PROMOTION_LABEL: Record<(typeof PROMOTION_PIECES)[number], string> = {
    q: playPromotionQueen,
    r: playPromotionRook,
    b: playPromotionBishop,
    n: playPromotionKnight,
};

function markGameFinished(id: string) {
    try {
        sessionStorage.setItem(`gr_finished:${id}`, "1");
    } catch {}
}

function isGameFinished(id: string) {
    try {
        return sessionStorage.getItem(`gr_finished:${id}`) === "1";
    } catch {
        return false;
    }
}

function getPvcColor(id: string): string | null {
    try {
        return sessionStorage.getItem(`pvc_color:${id}`);
    } catch {
        return null;
    }
}

function setPvcColor(id: string, color: string) {
    try {
        sessionStorage.setItem(`pvc_color:${id}`, color);
    } catch {}
}

type SnapshotMove = { from: string; to: string; promotion: string | null };
type PvcSnapshot = {
    moves: SnapshotMove[];
    whiteMs: number;
    blackMs: number;
};

function savePvcSnapshot(id: string, snapshot: PvcSnapshot) {
    try {
        sessionStorage.setItem(`pvc_snapshot:${id}`, JSON.stringify(snapshot));
    } catch {}
}

function loadPvcSnapshot(id: string): PvcSnapshot | null {
    try {
        const raw = sessionStorage.getItem(`pvc_snapshot:${id}`);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function clearPvcSnapshot(id: string) {
    try {
        sessionStorage.removeItem(`pvc_snapshot:${id}`);
    } catch {}
}

function capturedCode(type: string, color: "w" | "b") {
    return `${color}${type.toUpperCase()}`;
}

function pairCapturedPieces(types: string[]) {
    return types.map((type, i) => ({
        type,
        stacked: types[i - 1] === type,
        stackEnd: i + 1 < types.length && types[i + 1] !== type,
    }));
}

export default function GameRoom() {
    const [params] = useSearchParams();
    const dispatch = useReduxDispatch();
    const session = useReduxSelector((state) => state.auth.session);
    const navigate = useNavigate();
    const { socket } = useSocket();
    const { usdValue } = useWalletBalance();
    const myUserId = useReduxSelector((state) => state.auth.session?.id);

    const mode: GameMode = params.get("mode") === "pvc" ? "pvc" : "pvp";
    const isPvc = mode === "pvc";
    const difficulty: Difficulty =
        (params.get("difficulty") as Difficulty) || "medium";
    const gameId = params.get("game_id") ?? undefined;
    const timeControl = (params.get("time") as TimeControl) || "rapid";
    const myCategory = timeControl.toUpperCase() as GameCategory;
    const playerSide: "w" | "b" = params.get("color") === "black" ? "b" : "w";
    const computerSide: "w" | "b" = playerSide === "w" ? "b" : "w";
    const opponentName = isPvc
        ? playOpponentFallbackComputer
        : params.get("opponent")
          ? decodeURIComponent(params.get("opponent")!)
          : playOpponentFallbackOpponent;
    const opponentRating = Number(params.get("opp_rating") ?? 0);
    const opponentId = params.get("opp_id") ?? undefined;
    const stakeAmount = Number(params.get("stake_amount") ?? 0);
    const canAffordRematch = usdValue >= stakeAmount;

    const [wasAlreadyFinished] = useState(
        () => !!gameId && isGameFinished(gameId),
    );

    const [pvcColorRedirect] = useState<string | null>(() => {
        if (!isPvc || !gameId) return null;
        const urlColor = params.get("color") ?? "white";
        const storedColor = getPvcColor(gameId);
        if (!storedColor) {
            setPvcColor(gameId, urlColor);
            return null;
        }
        if (storedColor === urlColor) return null;
        const corrected = new URLSearchParams(params);
        corrected.set("color", storedColor);
        return `/play?${corrected.toString()}`;
    });

    if (wasAlreadyFinished) {
        return <Navigate to="/play" replace />;
    }

    if (pvcColorRedirect) {
        return <Navigate to={pvcColorRedirect} replace />;
    }

    const {
        fen,
        fenHistory,
        moveHistory,
        moveLog,
        lastMove,
        turn,
        inCheck,
        isStalemate,
        isGameOver,
        isCheckmate,
        kingSquare,
        makeMove,
        applyOpponentMove,
        confirmMove,
        restoreGame,
        getLegalMoves,
        isPromotionMove,
        getRandomMove,
        getCapturedPieces,
        getPremoveMoves,
        getPremovePieceColor,
    } = useChessGame();

    const { viewIndex, isReviewing, displayFen, goBack, goForward } =
        useBoardReview(fenHistory);

    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    const [premoveFrom, setPremoveFrom] = useState<string | null>(null);
    const [premoveQueue, setPremoveQueue] = useState<
        { from: string; to: string }[]
    >([]);
    const [flashSquare, setFlashSquare] = useState<string | null>(null);
    const [pendingPromotion, setPendingPromotion] = useState<{
        from: string;
        to: string;
    } | null>(null);
    const [gameEnded, setGameEnded] = useState<IgameEndedResponse | null>(null);
    const [clockReady, setClockReady] = useState(isPvc);
    const [opponentDisconnected, setOpponentDisconnected] = useState(false);
    const [resignOpen, setResignOpen] = useState(false);
    const bypassBlockRef = useRef(false);
    const blocker = useBlocker(
        useCallback(() => {
            if (bypassBlockRef.current) {
                bypassBlockRef.current = false;
                return false;
            }
            return true;
        }, []),
    );
    const [drawOffer, setDrawOffer] = useState<IdrawOfferedResponse | null>(
        null,
    );

    useEffect(() => {
        if (blocker.state !== "blocked") return;
        if (!gameEnded) return;
        setResignOpen(false);
        const { pathname, search } = blocker.location;
        blocker.reset();
        bypassBlockRef.current = true;
        navigate(pathname + search, { replace: true });
    }, [blocker, gameEnded, navigate]);

    useEffect(() => {
        if (!gameEnded || !gameId) return;
        markGameFinished(gameId);
        if (isPvc) clearPvcSnapshot(gameId);
    }, [gameEnded, gameId, isPvc]);

    useEffect(() => {
        setPremoveQueue([]);
        setPremoveFrom(null);
    }, [gameId]);

    const paused = !!gameEnded || opponentDisconnected;
    const {
        whiteTimer,
        blackTimer,
        whiteTimeMs,
        blackTimeMs,
        timedOut,
        syncClock,
    } = useGameClock(
        timeControl,
        paused,
        turn,
    );

    useEffect(() => {
        if (!isPvc || !gameId) return;
        const snapshot = loadPvcSnapshot(gameId);
        if (!snapshot) return;
        restoreGame(snapshot.moves);
        syncClock(snapshot.whiteMs, snapshot.blackMs);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPvc, gameId]);

    useEffect(() => {
        if (!isPvc || !gameId || moveLog.length === 0) return;
        savePvcSnapshot(gameId, {
            moves: moveLog,
            whiteMs: whiteTimeMs,
            blackMs: blackTimeMs,
        });
    }, [isPvc, gameId, moveLog, whiteTimeMs, blackTimeMs]);

    const { tabLockStatus, takeOver, notifySuperseded } = useTabLock(
        gameId,
        mode,
    );
    const {
        status: rematchStatus,
        secondsLeft: rematchSecs,
        offerRematch,
    } = useRematch(gameId);

    const { bestMove } = useStockfish(
        fen,
        DIFFICULTY_CONFIG[difficulty].depth,
        isPvc && difficulty !== "easy" && turn === computerSide && !isGameOver,
        DIFFICULTY_CONFIG[difficulty].elo,
    );
    useComputerOpponent({
        mode,
        difficulty,
        fen,
        turn,
        computerSide,
        gameEnded: isGameOver,
        bestMove,
        makeMove,
        getRandomMove,
    });

    useEffect(() => {
        if (!isPvc || !isGameOver || gameEnded) return;
        const winnerIsMe = isCheckmate && turn === "b";
        setGameEnded({
            game_id: gameId ?? "pvc",
            winner_id: !isCheckmate
                ? null
                : winnerIsMe
                  ? (myUserId ?? "me")
                  : "computer",
            reason: isCheckmate
                ? "checkmate"
                : isStalemate
                  ? "stalemate"
                  : "draw",
            settlement: null,
        });
    }, [
        isPvc,
        isGameOver,
        isCheckmate,
        isStalemate,
        gameEnded,
        turn,
        gameId,
        myUserId,
    ]);

    useEffect(() => {
        if (!isPvc || !timedOut || gameEnded) return;
        setGameEnded({
            game_id: gameId ?? "pvc",
            winner_id: timedOut === "w" ? "computer" : (myUserId ?? "me"),
            reason: "timeout",
            settlement: null,
        });
    }, [isPvc, timedOut, gameEnded, gameId, myUserId]);

    useEffect(() => {
        if (!socket || !gameId || isPvc) return;

        const rejoin = () => socket.emit("rejoin_game", { game_id: gameId });
        rejoin();
        socket.on("connect", rejoin);

        const onOpponentMove = (data: IopponentMoveResponse) => {
            console.log("[socket] opponent_move received", data);
            applyOpponentMove(data.from, data.to, data.promotion, data.fen);
        };
        const onMoveConfirmed = (data: IMoveConfirmedResponse) => {
            console.log("[socket] move_confirmed received", data);
            confirmMove(data.fen);
        };
        const onGameRestored = (data: IgameRestoreResponse) => {
            restoreGame(
                data.moves.map((m) => ({
                    from: m.from,
                    to: m.to,
                    promotion: m.promotion,
                })),
            );
            syncClock(data.white_remaining_ms, data.black_remaining_ms);
            setClockReady(true);
        };
        const onClockUpdate = (data: IClockUpdateResponse) => {
            syncClock(data.white_remaining_ms, data.black_remaining_ms);
            setClockReady(true);
        };
        const onDrawOffered = (data: IdrawOfferedResponse) => {
            if (data.game_id === gameId) setDrawOffer(data);
        };
        const onDrawRejected = (data: IdrawRejectedResponse) => {
            if (data.game_id === gameId)
                dispatch(
                    showToast({
                        message: playToastDrawDeclined,
                        severity: "info",
                    }),
                );
        };
        const onGameEnded = (data: IgameEndedResponse) => {
            if (data.game_id === gameId) setGameEnded(data);
        };
        const onSocketError = (data: ISocketErrorResponse) => {
            dispatch(showToast({ message: data.message, severity: "error" }));
        };
        const onOpponentDisconnected = (
            data: IopponentDisconnectedResponse,
        ) => {
            if (data.game_id !== gameId) return;
            setOpponentDisconnected(true);
            dispatch(
                showToast({
                    message: `${playToastOpponentDisconnectedTitle} — ${playToastOpponentDisconnectedDesc(
                        data.grace_period_seconds,
                    )}`,
                    severity: "info",
                }),
            );
        };
        const onOpponentReconnected = (data: IopponentReconnectedResponse) => {
            if (data.game_id !== gameId) return;
            setOpponentDisconnected(false);
            dispatch(
                showToast({
                    message: playToastOpponentReconnected,
                    severity: "success",
                }),
            );
        };

        socket.on("opponent_move", onOpponentMove);
        socket.on("move_confirmed", onMoveConfirmed);
        socket.on("game_restored", onGameRestored);
        socket.on("clock_update", onClockUpdate);
        socket.on("draw_offered", onDrawOffered);
        socket.on("draw_rejected", onDrawRejected);
        socket.on("game_ended", onGameEnded);
        socket.on("tab_superseded", notifySuperseded);
        socket.on("socket_error", onSocketError);
        socket.on("opponent_disconnected", onOpponentDisconnected);
        socket.on("opponent_reconnected", onOpponentReconnected);

        return () => {
            socket.off("connect", rejoin);
            socket.off("opponent_move", onOpponentMove);
            socket.off("move_confirmed", onMoveConfirmed);
            socket.off("game_restored", onGameRestored);
            socket.off("clock_update", onClockUpdate);
            socket.off("draw_offered", onDrawOffered);
            socket.off("draw_rejected", onDrawRejected);
            socket.off("game_ended", onGameEnded);
            socket.off("tab_superseded", notifySuperseded);
            socket.off("socket_error", onSocketError);
            socket.off("opponent_disconnected", onOpponentDisconnected);
            socket.off("opponent_reconnected", onOpponentReconnected);
        };
    }, [
        socket,
        gameId,
        isPvc,
        applyOpponentMove,
        confirmMove,
        syncClock,
        myUserId,
        opponentId,
        notifySuperseded,
    ]);

    useEffect(() => {
        if (!socket || !gameId || isPvc) return;
        const onPageHide = () => socket.emit("leave_game", { game_id: gameId });
        window.addEventListener("pagehide", onPageHide);
        return () => window.removeEventListener("pagehide", onPageHide);
    }, [socket, gameId, isPvc]);

    const legalMoves = selectedSquare ? getLegalMoves(selectedSquare) : [];
    const premoveTargets = premoveFrom
        ? getPremoveMoves(premoveFrom, playerSide, premoveQueue)
        : [];

    const commitMove = (from: string, to: string, promotion?: string) => {
        const result = makeMove(from, to, promotion);
        if (result && socket && gameId && !isPvc) {
            const payload = {
                game_id: gameId,
                from,
                to,
                promotion: result.promotion ?? null,
                fen: result.fen,
            };
            console.log("[socket] emitting make_move", payload, {
                connected: socket.connected,
            });
            socket.emit("move_made", payload);
        } else {
            console.log("[socket] make_move NOT emitted", {
                hasResult: !!result,
                hasSocket: !!socket,
                gameId,
                isPvc,
            });
        }
        return result;
    };

    useEffect(() => {
        if (turn !== playerSide || gameEnded || premoveQueue.length === 0)
            return;
        const [next, ...rest] = premoveQueue;
        setPremoveQueue(rest);
        const result = commitMove(next.from, next.to);
        if (!result) {
            setPremoveQueue([]);
            setFlashSquare(next.from);
            setTimeout(() => setFlashSquare(null), 500);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [turn, gameEnded, playerSide, premoveQueue]);

    const handleSquareClick = (square: string, viaDrag?: boolean) => {
        if (gameEnded || isReviewing || pendingPromotion) return;

        if (turn !== playerSide) {
            if (premoveFrom) {
                if (premoveTargets.includes(square)) {
                    setPremoveQueue((q) => [
                        ...q,
                        { from: premoveFrom, to: square },
                    ]);
                    setPremoveFrom(null);
                } else {
                    setPremoveFrom(
                        getPremovePieceColor(
                            square,
                            playerSide,
                            premoveQueue,
                        ) === playerSide
                            ? square
                            : null,
                    );
                }
                return;
            }
            if (
                getPremovePieceColor(square, playerSide, premoveQueue) ===
                playerSide
            )
                setPremoveFrom(square);
            return;
        }

        if (selectedSquare && legalMoves.includes(square)) {
            if (isPromotionMove(selectedSquare, square) && !viaDrag) {
                setTimeout(() =>
                    setPendingPromotion({ from: selectedSquare, to: square }),
                );
            } else {
                commitMove(selectedSquare, square);
            }
            setSelectedSquare(null);
            return;
        }

        const hasOwnPiece = getLegalMoves(square).length > 0;
        if (selectedSquare && !hasOwnPiece) {
            setFlashSquare(selectedSquare);
            setTimeout(() => setFlashSquare(null), 400);
        }
        setSelectedSquare(hasOwnPiece ? square : null);
    };

    const handleSquareRightClick = () => {
        setPremoveQueue([]);
        setPremoveFrom(null);
    };

    const handlePromotionSelect = (piece: string) => {
        if (!pendingPromotion) return;
        commitMove(pendingPromotion.from, pendingPromotion.to, piece);
        setPendingPromotion(null);
    };

    const handlePromotionCancel = () => setPendingPromotion(null);

    const handleResignConfirm = () => {
        if (isPvc) {
            setGameEnded({
                game_id: gameId ?? "pvc",
                winner_id: "computer",
                reason: "resign",
                settlement: null,
            });
        } else {
            socket?.emit("resign_game", { game_id: gameId });
        }
        setResignOpen(false);
        if (blocker.state === "blocked") blocker.proceed();
    };

    const handleKeepPlaying = () => {
        setResignOpen(false);
        if (blocker.state === "blocked") blocker.reset();
    };

    const handleDrawOffer = () => {
        socket?.emit("offer_draw", { game_id: gameId });
    };

    const handleDrawAccept = () => {
        socket?.emit("accept_draw", { game_id: gameId });
        setDrawOffer(null);
    };

    const handleDrawDecline = () => {
        socket?.emit("reject_draw", { game_id: gameId });
        setDrawOffer(null);
        dispatch(
            showToast({ message: playToastDrawDeclined, severity: "info" }),
        );
    };

    if (tabLockStatus === "secondary") {
        return (
            <Box customClass="gr-secondary">
                <Text customClass="gr-heading">{playReasonGameOver}</Text>
                <Text customClass="gr-elo">
                    This game is open in another tab.
                </Text>
                <Button customClass="gr-link" onClick={takeOver}>
                    Play here instead
                </Button>
            </Box>
        );
    }

    const boardFen = isReviewing ? displayFen : fen;
    const checkSquare = !isReviewing && inCheck ? kingSquare() : null;
    const stalemateSquare = !isReviewing && isStalemate ? kingSquare() : null;

    const oppColor: "w" | "b" = playerSide === "w" ? "b" : "w";
    const captured = getCapturedPieces();
    const myCaptured = playerSide === "w" ? captured.byWhite : captured.byBlack;
    const oppCaptured =
        playerSide === "w" ? captured.byBlack : captured.byWhite;
    const myAdvantage =
        playerSide === "w" ? captured.whiteAdvantage : -captured.whiteAdvantage;

    const myClock = playerSide === "w" ? whiteTimer : blackTimer;
    const oppClock = playerSide === "w" ? blackTimer : whiteTimer;
    const myTurnActive = turn === playerSide;

    const isDrawResult = !!gameEnded && gameEnded.winner_id === null;
    const isWinner =
        !!gameEnded && !!myUserId && gameEnded.winner_id === myUserId;
    const resultHeader = !gameEnded
        ? ""
        : isDrawResult
          ? playGameOverHeaderDraw
          : isWinner
            ? playGameOverHeaderWin
            : playGameOverHeaderLose;
    const settlementUsd = gameEnded?.settlement
        ? isWinner
            ? gameEnded.settlement.winner.usd
            : gameEnded.settlement.loser.usd
        : 0;
    const reasonLabel = gameEnded?.reason
        ? (REASON_LABEL[gameEnded.reason] ?? playReasonGameOver)
        : "";

    return (
        <Box customClass="game-room">
            <Box
                customClass={classNames(
                    "gr-row",
                    "opp",
                    !myTurnActive && "active",
                )}
            >
                <Box customClass="gr-meta">
                    <Text customClass="gr-name" truncate>
                        {opponentName}
                    </Text>
                    <Text customClass="gr-elo">
                        {isPvc
                            ? playWagerBadgeDifficultyLabels[difficulty]
                            : `${opponentRating} elo`}
                    </Text>
                    <Box customClass="gr-captured">
                        {pairCapturedPieces(oppCaptured).map(
                            ({ type, stacked, stackEnd }, i) => (
                                <PieceIcon
                                    key={i}
                                    className={classNames(
                                        "gr-captured-icon",
                                        playerSide === "b" && "dark-piece",
                                        stacked && "stacked",
                                        stackEnd && "stack-end",
                                    )}
                                    code={capturedCode(type, playerSide)}
                                />
                            ),
                        )}
                        {myAdvantage < 0 && (
                            <Text component="span" customClass="gr-advantage">
                                +{-myAdvantage}
                            </Text>
                        )}
                    </Box>
                </Box>
                <Text customClass="gr-clock">
                    {clockReady ? (
                        oppClock
                    ) : (
                        <Skeleton
                            variant="rounded"
                            width="2.5rem"
                            height="1.5rem"
                        />
                    )}
                </Text>
            </Box>

            <Box customClass="gr-board-wrap">
                <ChessBoard
                    fen={boardFen}
                    selectedSquare={
                        myTurnActive ? selectedSquare : premoveFrom
                    }
                    legalMoves={myTurnActive ? legalMoves : premoveTargets}
                    premoveSquares={premoveQueue.flatMap((m) => [
                        m.from,
                        m.to,
                    ])}
                    premoveMode={!myTurnActive}
                    draggableColor={playerSide}
                    checkSquare={checkSquare}
                    stalemateSquare={stalemateSquare}
                    flashSquare={flashSquare}
                    onSquareClick={handleSquareClick}
                    onSquareRightClick={handleSquareRightClick}
                    lastMove={isReviewing ? null : lastMove}
                    flipped={playerSide === "b"}
                />
                {pendingPromotion && (
                    <Box
                        customClass="gr-promotion-overlay"
                        onClick={handlePromotionCancel}
                    >
                        <Box
                            customClass="gr-promotion-card"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Text customClass="gr-promotion-label">
                                {playPromotionTitle}
                            </Text>
                            <Box customClass="gr-promotion-options">
                                {PROMOTION_PIECES.map((piece) => (
                                    <Button
                                        key={piece}
                                        type="button"
                                        customClass="gr-promotion-btn"
                                        onClick={() =>
                                            handlePromotionSelect(piece)
                                        }
                                        aria-label={PROMOTION_LABEL[piece]}
                                    >
                                        <PieceIcon
                                            code={`${playerSide}${piece.toUpperCase()}`}
                                            className="gr-promotion-icon"
                                        />
                                    </Button>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                )}
            </Box>

            <Box
                customClass={classNames(
                    "gr-row",
                    "me",
                    myTurnActive && "active",
                )}
            >
                <Box customClass="gr-meta">
                    <Text customClass="gr-name" truncate>
                        {session?.username}(You)
                    </Text>
                    <Text customClass="gr-elo">
                        {isPvc
                            ? ""
                            : `${session?.ratings[myCategory] ?? leaderboardRankFallback} elo`}
                    </Text>
                    <Box customClass="gr-captured">
                        {pairCapturedPieces(myCaptured).map(
                            ({ type, stacked, stackEnd }, i) => (
                                <PieceIcon
                                    key={i}
                                    className={classNames(
                                        "gr-captured-icon",
                                        oppColor === "b" && "dark-piece",
                                        stacked && "stacked",
                                        stackEnd && "stack-end",
                                    )}
                                    code={capturedCode(type, oppColor)}
                                />
                            ),
                        )}
                        {myAdvantage > 0 && (
                            <Text component="span" customClass="gr-advantage">
                                +{myAdvantage}
                            </Text>
                        )}
                    </Box>
                </Box>
                <Text customClass="gr-clock">
                    {clockReady ? (
                        myClock
                    ) : (
                        <Skeleton
                            variant="rounded"
                            width="2.5rem"
                            height="1.5rem"
                        />
                    )}
                </Text>
            </Box>

            {drawOffer && (
                <Box customClass="gr-draw-banner">
                    <Text component="span">{playDrawOfferBannerText}</Text>
                    <Button customClass="gr-link" onClick={handleDrawAccept}>
                        {playDrawOfferBannerAcceptButton}
                    </Button>
                    <Button
                        customClass="gr-link danger"
                        onClick={handleDrawDecline}
                    >
                        {playDrawOfferBannerDeclineButton}
                    </Button>
                </Box>
            )}

            <Box customClass="gr-review-controls">
                <Button
                    customClass="gr-review-btn"
                    onClick={goBack}
                    disabled={fenHistory.length <= 1}
                    aria-label="Previous move"
                >
                    <ChevronLeft size={16} strokeWidth={2} />
                </Button>
                <Text customClass="gr-review-label">
                    {isReviewing ? playMoveHistoryReviewing : ""}
                </Text>
                <Button
                    customClass="gr-review-btn"
                    onClick={goForward}
                    disabled={!isReviewing}
                    aria-label="Next move"
                >
                    <ChevronRight size={16} strokeWidth={2} />
                </Button>
            </Box>

            <Box customClass="gr-moves">
                {moveHistory.map((m, i) => {
                    const effectiveIndex = viewIndex ?? fenHistory.length - 1;
                    const isWhiteActive = effectiveIndex === i * 2 + 1;
                    const isBlackActive = effectiveIndex === i * 2 + 2;
                    return (
                        <Text
                            key={m.n}
                            component="span"
                            customClass="gr-move-pair"
                        >
                            <Text component="span" customClass="gr-move-n">
                                {m.n}.
                            </Text>
                            {isWhiteActive ? (
                                <Text
                                    component="span"
                                    customClass="gr-move-current"
                                >
                                    {m.w}
                                </Text>
                            ) : (
                                m.w
                            )}
                            {m.b ? (
                                isBlackActive ? (
                                    <Text
                                        component="span"
                                        customClass="gr-move-current"
                                    >
                                        {" "}
                                        {m.b}
                                    </Text>
                                ) : (
                                    ` ${m.b}`
                                )
                            ) : (
                                ""
                            )}
                        </Text>
                    );
                })}
            </Box>

            <Box customClass="gr-foot">
                <Button
                    customClass="gr-action-btn danger"
                    onClick={() => setResignOpen(true)}
                >
                    {playActionButtonsResign}
                </Button>
                {!isPvc && (
                    <Button
                        customClass="gr-action-btn"
                        onClick={handleDrawOffer}
                    >
                        {playActionButtonsDraw}
                    </Button>
                )}
            </Box>

            <Modal
                open={resignOpen || (blocker.state === "blocked" && !gameEnded)}
                onClose={handleKeepPlaying}
            >
                <Text customClass="gr-heading">{playResignDialogTitle}</Text>
                <Text customClass="gr-elo">
                    {isPvc
                        ? playResignDialogPvcDescription
                        : playResignDialogPvpDescription(stakeAmount)}
                </Text>
                <Box customClass="gr-resign-actions">
                    <Button customClass="gr-link" onClick={handleKeepPlaying}>
                        {playResignDialogKeepPlayingButton}
                    </Button>
                    <Button
                        customClass="gr-link danger"
                        onClick={handleResignConfirm}
                    >
                        {playResignDialogResignButton}
                    </Button>
                </Box>
            </Modal>

            {gameEnded && (
                <Box customClass="gr-overlay">
                    <Text customClass="gr-overlay-badge">{reasonLabel}</Text>
                    <Text customClass="gr-overlay-title">{resultHeader}</Text>
                    {gameEnded.settlement && (
                        <Box customClass="gr-settlement">
                            <Box customClass="gr-settlement-item">
                                <Text
                                    customClass={classNames(
                                        "gr-settlement-val",
                                        isWinner && "win",
                                        !isWinner && !isDrawResult && "loss",
                                    )}
                                >
                                    {formateAmount(settlementUsd)}
                                </Text>
                                <Text customClass="gr-settlement-lbl">
                                    {playGameOverSettlementLabel}
                                </Text>
                            </Box>
                            {typeof gameEnded.your_elo_gain === "number" && (
                                <Box customClass="gr-settlement-item">
                                    <Text customClass="gr-settlement-val">
                                        {gameEnded.your_elo_gain >= 0
                                            ? `+${gameEnded.your_elo_gain}`
                                            : gameEnded.your_elo_gain}
                                    </Text>
                                    <Text customClass="gr-settlement-lbl">
                                        Elo
                                    </Text>
                                </Box>
                            )}
                        </Box>
                    )}
                    <Box customClass="gr-overlay-actions">
                        <Button
                            customClass="gr-overlay-btn secondary"
                            onClick={() => navigate("/play", { replace: true })}
                        >
                            {playGameOverNewGameButton}
                        </Button>
                        {!isPvc && !canAffordRematch && (
                            <Text customClass="pool-insufficient-label">
                                {matchmakingPoolCardInsufficientBalance}
                            </Text>
                        )}
                        {!isPvc && canAffordRematch && (
                            <Button
                                customClass="gr-overlay-btn primary"
                                sx={{ display: "none" }}
                                onClick={offerRematch}
                                disabled={rematchStatus === "offered"}
                            >
                                {rematchStatus === "offered"
                                    ? playGameOverWaitingForOpponent(
                                          rematchSecs,
                                      )
                                    : rematchStatus === "opponent-offered"
                                      ? playGameOverAcceptRematchButton
                                      : playGameOverRematchButton}
                            </Button>
                        )}
                    </Box>
                </Box>
            )}
        </Box>
    );
}
