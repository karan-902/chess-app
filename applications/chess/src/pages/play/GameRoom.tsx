import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useBlocker, Navigate } from "react-router-dom";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import ChessBoard from "@gopvp/chess/src/components/board/Board";
import PlayerRow from "@gopvp/chess/src/pages/play/PlayerRow";
import PromotionOverlay from "@gopvp/chess/src/pages/play/PromotionOverlay";
import ReviewControls from "@gopvp/chess/src/pages/play/ReviewControls";
import GameOverOverlay from "@gopvp/chess/src/pages/play/GameOverOverlay";
import { useChessGame } from "@gopvp/chess/src/hooks/useChessGame";
import { useBoardReview } from "@gopvp/chess/src/hooks/useBoardReview";
import { useGameClock } from "@gopvp/chess/src/hooks/useGameClock";
import { useTabLock } from "@gopvp/chess/src/hooks/useTabLock";
import { useStockfish } from "@gopvp/chess/src/hooks/useStockfish";
import { useComputerOpponent } from "@gopvp/chess/src/hooks/useComputerOpponent";
import { useGameRoomSetup } from "@gopvp/chess/src/hooks/useGameRoomSetup";
import { useGameSocket } from "@gopvp/chess/src/hooks/useGameSocket";
import { usePvcGameEnd } from "@gopvp/chess/src/hooks/usePvcGameEnd";
import { oppositeSide } from "@gopvp/chess/src/utils";
import { markGameFinished, clearPvcSnapshot } from "@gopvp/chess/src/utils/storage";
import { DIFFICULTY_CONFIG } from "@gopvp/chess/src/constants/index";
import { GAME_END_REASON_LABELS } from "@gopvp/chess/src/constants/config";
import { MATCH_RESULT_OUTCOMES } from "@gopvp/common/src/constants/config";
import { useGameContext } from "@gopvp/common/src/contexts/GameContext";
import type { IMatchResultResponse } from "@gopvp/common/src/types/response";
import type { IGameRoomProps } from "@gopvp/chess/src/types/component";
import {
 resignText,
 drawText,
 opponentOfferedDrawText,
 acceptText,
 declineText,
 victoryText,
 drawUpperText,
 defeatText,
 gameOverText,
} from "@gopvp/chess/src/constants/messages";
import Button from "@gopvp/common/src/components/Button/Button";
import ResignModal from "@gopvp/chess/src/components/common/ResignModal";

function pickBySide<T>(side: "w" | "b", whiteVal: T, blackVal: T): T {
 return side === "w" ? whiteVal : blackVal;
}

export default function GameRoom({ mode }: IGameRoomProps) {
 const navigate = useNavigate();
 const { playPath } = useGameContext();

 const {
  isPvc,
  difficulty,
  gameId,
  startingMs,
  playerSide,
  computerSide,
  myName,
  myScoreLabel,
  opponentName,
  opponentScoreLabel,
  betAmount,
  wasAlreadyFinished,
 } = useGameRoomSetup(mode);

 if (wasAlreadyFinished) {
  return <Navigate to={playPath} replace />;
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
  applyServerFen,
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
 const [gameEnded, setGameEnded] = useState<IMatchResultResponse | null>(
  null,
 );
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

 const {
  whiteTimer,
  blackTimer,
  whiteTimeMs,
  blackTimeMs,
  timedOut,
  syncClock,
 } = useGameClock(startingMs, !!gameEnded, turn);

 useTabLock(gameId, mode);

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
  moveLog,
  whiteTimeMs,
  blackTimeMs,
  gameEnded,
  restoreGame,
  syncClock,
  setGameEnded,
 });

 const {
  clockReady,
  drawOffer,
  isOpponentOffline,
  firstMoveSeconds,
  sendMove,
  resign,
  offerDraw,
  acceptDraw,
  declineDraw,
 } = useGameSocket({
  isPvc,
  applyServerFen,
  restoreGame,
  syncClock,
  setGameEnded,
 });

 const legalMoves = selectedSquare ? getLegalMoves(selectedSquare) : [];
 const premoveTargets = premoveFrom
  ? getPremoveMoves(premoveFrom, playerSide, premoveQueue)
  : [];

 const commitMove = (from: string, to: string, promotion?: string) => {
  const result = makeMove(from, to, promotion);
  if (result && !isPvc) sendMove(from, to, result.promotion);
  return result;
 };

 useEffect(() => {
  if (turn !== playerSide || gameEnded || premoveQueue.length === 0) return;
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
     setPremoveQueue((q) => [...q, { from: premoveFrom, to: square }]);
     setPremoveFrom(null);
    } else {
     setPremoveFrom(
      getPremovePieceColor(square, playerSide, premoveQueue) === playerSide
       ? square
       : null,
     );
    }
    return;
   }
   if (getPremovePieceColor(square, playerSide, premoveQueue) === playerSide) {
    setPremoveFrom(square);
   } else if (premoveQueue.length > 0) {
    setPremoveQueue([]);
   }
   return;
  }

  if (selectedSquare && legalMoves.includes(square)) {
   if (isPromotionMove(selectedSquare, square) && !viaDrag) {
    setTimeout(() => setPendingPromotion({ from: selectedSquare, to: square }));
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
   endPvcGame("loss", "RESIGN");
  } else {
   resign();
  }
  setResignOpen(false);
  if (blocker.state === "blocked") blocker.proceed();
 };

 const handleKeepPlaying = () => {
  setResignOpen(false);
  if (blocker.state === "blocked") blocker.reset();
 };

 const boardFen = isReviewing ? displayFen : fen;
 const checkSquare = !isReviewing && inCheck ? kingSquare() : null;
 const stalemateSquare = !isReviewing && isStalemate ? kingSquare() : null;

 const oppColor = oppositeSide(playerSide);
 const captured = getCapturedPieces();
 const myCaptured = pickBySide(playerSide, captured.byWhite, captured.byBlack);
 const oppCaptured = pickBySide(oppColor, captured.byWhite, captured.byBlack);
 const myAdvantage =
  playerSide === "w" ? captured.whiteAdvantage : -captured.whiteAdvantage;

 const myClock = pickBySide(playerSide, whiteTimer, blackTimer);
 const oppClock = pickBySide(oppColor, whiteTimer, blackTimer);
 const myTurnActive = turn === playerSide;

 const outcome = gameEnded ? MATCH_RESULT_OUTCOMES[gameEnded.result] : null;
 const isDrawResult = outcome === "draw";
 const isWinner = outcome === "win";
 const resultHeader = !gameEnded
  ? ""
  : isDrawResult
    ? drawUpperText
    : isWinner
      ? victoryText
      : defeatText;
 const reasonLabel = gameEnded?.end_reason
  ? (GAME_END_REASON_LABELS[gameEnded.end_reason] ?? gameOverText)
  : "";

 return (
  <Box customClass="game-room">
   <PlayerRow
    variant="opponent"
    active={!myTurnActive}
    name={opponentName}
    scoreLabel={opponentScoreLabel}
    capturedPieces={oppCaptured}
    pieceColor={playerSide}
    advantage={myAdvantage < 0 ? -myAdvantage : null}
    clock={oppClock}
    clockReady={clockReady}
    isReconnecting={isOpponentOffline}
    firstMoveSeconds={myTurnActive ? null : firstMoveSeconds}
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
   <ReviewControls
    moveHistory={moveHistory}
    fenHistory={fenHistory}
    viewIndex={viewIndex}
    onJump={jumpTo}
    isReviewing={isReviewing}
    goBack={goBack}
    goForward={goForward}
   />
   <PlayerRow
    variant="self"
    active={myTurnActive}
    name={myName}
    scoreLabel={myScoreLabel}
    capturedPieces={myCaptured}
    pieceColor={oppColor}
    advantage={myAdvantage > 0 ? myAdvantage : null}
    clock={myClock}
    clockReady={clockReady}
    firstMoveSeconds={myTurnActive ? firstMoveSeconds : null}
   />

   {drawOffer && (
    <Box customClass="gr-draw-banner">
     <Text component="span">{opponentOfferedDrawText}</Text>
     <Button customClass="gr-link" onClick={acceptDraw}>
      {acceptText}
     </Button>
     <Button customClass="gr-link danger" onClick={declineDraw}>
      {declineText}
     </Button>
    </Box>
   )}

   <Box customClass="gr-foot">
    <Button
     customClass="gr-action-btn danger"
     onClick={() => setResignOpen(true)}
    >
     {resignText}
    </Button>
    {!isPvc && (
     <Button customClass="gr-action-btn" onClick={offerDraw}>
      {drawText}
     </Button>
    )}
   </Box>

   <ResignModal
    open={resignOpen || (blocker.state === "blocked" && !gameEnded)}
    isPvc={isPvc}
    betAmount={betAmount}
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
     onNewGame={() => navigate(playPath, { replace: true })}
    />
   )}
  </Box>
 );
}
