import { useCallback, useEffect, useRef, useState } from "react";
import {
    useSearchParams,
    useNavigate,
    useBlocker,
    Navigate,
} from "react-router";
import { showToast } from "@/redux/common/common.slice";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import ChessBoard from "@/components/board/Board";
import PlayerRow from "./PlayerRow";
import PromotionOverlay from "./PromotionOverlay";
import ReviewControls from "./ReviewControls";
import GameOverOverlay from "./GameOverOverlay";
import { useChessGame } from "@/hooks/useChessGame";
import { useBoardReview } from "@/hooks/useBoardReview";
import { useGameClock } from "@/hooks/useGameClock";
import { useTabLock } from "@/hooks/useTabLock";
import { useRematch } from "@/hooks/useRematch";
import { useStockfish } from "@/hooks/useStockfish";
import { useComputerOpponent } from "@/hooks/useComputerOpponent";
import { useGameRoomSetup } from "@/hooks/useGameRoomSetup";
import { useGameSocket } from "@/hooks/useGameSocket";
import { usePvcGameEnd } from "@/hooks/usePvcGameEnd";
import { useSocket } from "@/context/SocketContext";
import { useWalletBalance } from "@/hooks/useWallet";
import { useReduxSelector, useReduxDispatch } from "@/redux/hooks";
import { oppositeSide, shortenUsername } from "@/utils";
import { markGameFinished, clearPvcSnapshot } from "@/utils/storage";
import { DIFFICULTY_CONFIG } from "@/constants/index";
import { GAME_END_REASON_LABELS } from "@/constants/config";
import type { IdrawOfferedResponse, IgameEndedResponse } from "@/types/types";
import {
    playWagerBadgeDifficultyLabels,
    playActionButtonsResign,
    playActionButtonsDraw,
    playDrawOfferBannerText,
    playDrawOfferBannerAcceptButton,
    playDrawOfferBannerDeclineButton,
    playToastDrawDeclined,
    playGameOverHeaderWin,
    playGameOverHeaderDraw,
    playGameOverHeaderLose,
    playReasonGameOver,
    leaderboardRankFallback,
} from "@/constants/messages";
import Button from "@/components/base/Button/Button";
import ResignModal from "@/components/common/ResignModal";

function pickBySide<T>(side: "w" | "b", whiteVal: T, blackVal: T): T {
    return side === "w" ? whiteVal : blackVal;
}

export default function GameRoom() {
    const [params] = useSearchParams();
    const dispatch = useReduxDispatch();
    const session = useReduxSelector((state) => state.auth.session);
    const navigate = useNavigate();
    const { socket } = useSocket();
    const { usdValue } = useWalletBalance();
    const myUserId = useReduxSelector((state) => state.auth.session?.id);

    const {
        mode,
        isPvc,
        difficulty,
        gameId,
        timeControl,
        myCategory,
        playerSide,
        computerSide,
        opponentName,
        isRoomMatch,
        opponentRating,
        stakeAmount,
        canAffordRematch,
        wasAlreadyFinished,
        pvcColorRedirect,
    } = useGameRoomSetup(params, usdValue);

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

    const { viewIndex, isReviewing, displayFen, goBack, goForward, jumpTo } =
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
    const [graceSecondsRemaining, setGraceSecondsRemaining] = useState<
        number | null
    >(null);
    const [resignOpen, setResignOpen] = useState(false);
    const [drawOffer, setDrawOffer] = useState<IdrawOfferedResponse | null>(
        null,
    );

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
    } = useGameClock(timeControl, paused, turn);

    const { notifySuperseded } = useTabLock(gameId, mode);
    const {
        status: rematchStatus,
        secondsLeft: rematchSecs,
        offerRematch,
    } = useRematch(gameId);

    const { bestMove } = useStockfish(
        fen,
        DIFFICULTY_CONFIG[difficulty].depth,
        isPvc && turn === computerSide && !isGameOver,
        DIFFICULTY_CONFIG[difficulty].elo,
    );
    useComputerOpponent({
        mode,
        turn,
        computerSide,
        gameEnded: isGameOver,
        bestMove,
        makeMove,
        getRandomMove,
    });

    const { endPvcGame } = usePvcGameEnd({
        isPvc,
        gameId,
        turn,
        computerSide,
        playerSide,
        isGameOver,
        isCheckmate,
        isStalemate,
        timedOut,
        myUserId,
        moveLog,
        whiteTimeMs,
        blackTimeMs,
        gameEnded,
        restoreGame,
        syncClock,
        setGameEnded,
    });

    useGameSocket({
        socket,
        gameId,
        isPvc,
        dispatch,
        graceSecondsRemaining,
        applyOpponentMove,
        confirmMove,
        restoreGame,
        syncClock,
        notifySuperseded,
        setClockReady,
        setDrawOffer,
        setGameEnded,
        setGraceSecondsRemaining,
        setOpponentDisconnected,
    });

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
            console.log("[pvc] make_move emitted", {
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
        const timer = setTimeout(() => {
            const [next, ...rest] = premoveQueue;
            setPremoveQueue(rest);
            const result = commitMove(next.from, next.to);
            if (!result) {
                setPremoveQueue([]);
                setFlashSquare(next.from);
                setTimeout(() => setFlashSquare(null), 500);
            }
        }, 280);
        return () => clearTimeout(timer);
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
            ) {
                setPremoveFrom(square);
            } else if (premoveQueue.length > 0) {
                setPremoveQueue([]);
            }
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
            endPvcGame("computer", "resign");
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

    const boardFen = isReviewing ? displayFen : fen;
    const checkSquare = !isReviewing && inCheck ? kingSquare() : null;
    const stalemateSquare = !isReviewing && isStalemate ? kingSquare() : null;

    const oppColor = oppositeSide(playerSide);
    const captured = getCapturedPieces();
    const myCaptured = pickBySide(
        playerSide,
        captured.byWhite,
        captured.byBlack,
    );
    const oppCaptured = pickBySide(
        oppColor,
        captured.byWhite,
        captured.byBlack,
    );
    const myAdvantage =
        playerSide === "w" ? captured.whiteAdvantage : -captured.whiteAdvantage;

    const myClock = pickBySide(playerSide, whiteTimer, blackTimer);
    const oppClock = pickBySide(oppColor, whiteTimer, blackTimer);
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
    const settlementUsd =
        gameEnded?.settlement?.[isWinner ? "winner" : "loser"].usd ?? 0;
    const reasonLabel = gameEnded?.reason
        ? (GAME_END_REASON_LABELS[gameEnded.reason] ?? playReasonGameOver)
        : "";

    return (
        <Box customClass="game-room">
            <PlayerRow
                variant="opponent"
                active={!myTurnActive}
                name={opponentName}
                eloLabel={
                    isPvc
                        ? playWagerBadgeDifficultyLabels[difficulty]
                        : isRoomMatch
                          ? ""
                          : `${opponentRating} elo`
                }
                capturedPieces={oppCaptured}
                pieceColor={playerSide}
                advantage={myAdvantage < 0 ? -myAdvantage : null}
                clock={oppClock}
                clockReady={clockReady}
                graceSecondsRemaining={graceSecondsRemaining}
            />

            <Box customClass="gr-board-wrap">
                <ChessBoard
                    fen={boardFen}
                    selectedSquare={myTurnActive ? selectedSquare : premoveFrom}
                    legalMoves={myTurnActive ? legalMoves : premoveTargets}
                    premoveSquares={premoveQueue.flatMap((m) => [m.from, m.to])}
                    premoveMoves={isReviewing ? [] : premoveQueue}
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
                    <PromotionOverlay
                        playerSide={playerSide}
                        onSelect={handlePromotionSelect}
                        onCancel={handlePromotionCancel}
                    />
                )}
            </Box>

            <PlayerRow
                variant="self"
                active={myTurnActive}
                name={
                    session?.username
                        ? `${shortenUsername(session.username)}(You)`
                        : ""
                }
                eloLabel={
                    isPvc || isRoomMatch
                        ? ""
                        : `${session?.ratings[myCategory] ?? leaderboardRankFallback} elo`
                }
                capturedPieces={myCaptured}
                pieceColor={oppColor}
                advantage={myAdvantage > 0 ? myAdvantage : null}
                clock={myClock}
                clockReady={clockReady}
            />

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

            <ReviewControls
                moveHistory={moveHistory}
                fenHistory={fenHistory}
                viewIndex={viewIndex}
                onJump={jumpTo}
                isReviewing={isReviewing}
                goBack={goBack}
                goForward={goForward}
            />

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

            <ResignModal
                open={resignOpen || (blocker.state === "blocked" && !gameEnded)}
                isPvc={isPvc}
                stakeAmount={stakeAmount}
                onKeepPlaying={handleKeepPlaying}
                onResign={handleResignConfirm}
            />

            {gameEnded && (
                <GameOverOverlay
                    gameEnded={gameEnded}
                    reasonLabel={reasonLabel}
                    resultHeader={resultHeader}
                    isWinner={isWinner}
                    isDrawResult={isDrawResult}
                    settlementUsd={settlementUsd}
                    isPvc={isPvc}
                    canAffordRematch={canAffordRematch}
                    rematchStatus={rematchStatus}
                    rematchSecs={rematchSecs}
                    onNewGame={() => navigate("/play", { replace: true })}
                    onRematch={offerRematch}
                />
            )}
        </Box>
    );
}
