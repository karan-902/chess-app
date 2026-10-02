import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useBlocker } from "react-router-dom";
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
import { playSound } from "@gopvp/chess/src/lib/sounds";
import {
 CLOCK_LOW_TIME_MS,
 PREMOVE_QUEUE_SOUND_VOLUME,
 PREMOVE_FIRE_VIBRATE_MS,
} from "@gopvp/chess/src/constants/limit";
import {
 markGameFinished,
 clearPvcSnapshot,
 clearMatchMoves,
} from "@gopvp/chess/src/utils/storage";
import { useChessDispatch } from "@gopvp/chess/src/redux/chessHooks";
import { clearPvcGame } from "@gopvp/chess/src/redux/pvc/slice";
import { DIFFICULTY_CONFIG } from "@gopvp/chess/src/config/engine";
import { MATCH_RESULT_OUTCOMES } from "@gopvp/common/src/constants/mapper";
import { useGameContext } from "@gopvp/common/src/contexts/GameContext";
import type { IMatchResultResponse } from "@gopvp/common/src/types/response";
import type { IGameRoomProps } from "@gopvp/chess/src/types/component";
import {
 resignText,
 drawText,
 opponentOfferedDrawText,
 acceptText,
 declineText,
 waitingForOpponentText,
} from "@gopvp/chess/src/constants/message";
import Button from "@gopvp/common/src/components/Button/Button";
import { icons } from "@gopvp/common/src/components/images";
import ResignSheet from "@gopvp/chess/src/components/common/ResignSheet";

function pickBySide<T>(side: "w" | "b", whiteVal: T, blackVal: T): T {
 return side === "w" ? whiteVal : blackVal;
}

export default function GameRoom({ mode }: IGameRoomProps) {
 const navigate = useNavigate();
 const dispatch = useChessDispatch();
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
  isStarted,
 } = useGameRoomSetup(mode);

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
  loadFen,
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
 const [gameEnded, setGameEnded] = useState<IMatchResultResponse | null>(null);
 const [resignOpen, setResignOpen] = useState(false);
 const [isBoardReady, setIsBoardReady] = useState(false);
 const markBoardReady = useCallback(() => setIsBoardReady(true), []);

 const bypassBlockRef = useRef(false);
 const isMountedRef = useRef(true);
 useEffect(() => {
  isMountedRef.current = true;
  return () => {
   isMountedRef.current = false;
  };
 }, []);
 const blocker = useBlocker(
  useCallback(() => {
   if (!isMountedRef.current) return false;
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
  if (!isPvc) {
   clearMatchMoves(gameId);
   return;
  }
  clearPvcSnapshot(gameId);
  return () => {
   dispatch(clearPvcGame());
  };
 }, [gameEnded, gameId, isPvc, dispatch]);

 useEffect(() => {
  setPremoveQueue([]);
  setPremoveFrom(null);
 }, [gameId]);

 useEffect(() => {
  if (turn === playerSide) setPremoveFrom(null);
 }, [turn, playerSide]);

 const {
  whiteTimer,
  blackTimer,
  whiteTimeMs,
  blackTimeMs,
  timedOut,
  syncClock,
 } = useGameClock(
  startingMs,
  !!gameEnded || !isStarted || (isPvc && !isBoardReady),
  turn,
 );

 useTabLock(gameId, mode);

 const { depth, strength, randomMoves } = DIFFICULTY_CONFIG[difficulty];
 const { bestMove } = useStockfish(
  fen,
  depth,
  isPvc && !randomMoves && turn === computerSide && !isGameOver,
  strength,
 );
 useComputerOpponent({
  mode,
  turn,
  computerSide,
  gameEnded: isGameOver,
  bestMove,
  randomMoves,
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
  isGameOver,
  timedOut,
  moveLog,
  applyServerFen,
  loadFen,
  restoreGame,
  syncClock,
  setGameEnded,
 });

 const legalMoves = selectedSquare ? getLegalMoves(selectedSquare) : [];
 const premoveTargets = useMemo(
  () =>
   premoveFrom ? getPremoveMoves(premoveFrom, playerSide, premoveQueue) : [],
  [premoveFrom, playerSide, premoveQueue, getPremoveMoves],
 );

 const commitMove = (from: string, to: string, promotion?: string) => {
  const result = makeMove(from, to, promotion);
  if (result && !isPvc) sendMove(from, to, result.promotion);
  return result;
 };
 const commitMoveRef = useRef(commitMove);

 useEffect(() => {
  commitMoveRef.current = commitMove;
 });

 useEffect(() => {
  if (turn !== playerSide || gameEnded || premoveQueue.length === 0) return;
  const timer = setTimeout(() => {
   const [next, ...rest] = premoveQueue;
   setPremoveQueue(rest);
   const result = commitMoveRef.current(next.from, next.to);
   if (result) {
    navigator.vibrate?.(PREMOVE_FIRE_VIBRATE_MS);
   } else {
    setPremoveQueue([]);
    setFlashSquare(next.from);
    setTimeout(() => setFlashSquare(null), 500);
   }
  });
  return () => clearTimeout(timer);
 }, [turn, gameEnded, playerSide, premoveQueue]);

 const handleSquareClick = (square: string) => {
  if (!isStarted || gameEnded || isReviewing || pendingPromotion) return;

  if (turn !== playerSide) {
   if (premoveFrom) {
    if (premoveTargets.includes(square)) {
     setPremoveQueue((q) => [...q, { from: premoveFrom, to: square }]);
     setPremoveFrom(null);
     playSound("move", PREMOVE_QUEUE_SOUND_VOLUME);
    } else {
     setPremoveFrom(
      getPremovePieceColor(square, premoveQueue) === playerSide ? square : null,
     );
    }
    return;
   }
   if (getPremovePieceColor(square, premoveQueue) === playerSide) {
    setPremoveFrom(square);
   }
   return;
  }

  if (selectedSquare && legalMoves.includes(square)) {
   if (isPromotionMove(selectedSquare, square)) {
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

 const clearPremoves = () => {
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
 const myTimeMs = pickBySide(playerSide, whiteTimeMs, blackTimeMs);
 const oppTimeMs = pickBySide(oppColor, whiteTimeMs, blackTimeMs);
 const myTurnActive = turn === playerSide;

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
    lowTime={clockReady && oppTimeMs < CLOCK_LOW_TIME_MS}
    isReconnecting={isOpponentOffline}
    firstMoveSeconds={myTurnActive ? null : firstMoveSeconds}
   />

   <Box customClass="gr-board-wrap">
    <ChessBoard
     fen={boardFen}
     selectedSquare={myTurnActive ? selectedSquare : premoveFrom}
     legalMoves={myTurnActive ? legalMoves : premoveTargets}
     premoveMoves={isReviewing ? [] : premoveQueue}
     premoveMode={!myTurnActive}
     draggableColor={playerSide}
     checkSquare={checkSquare}
     stalemateSquare={stalemateSquare}
     flashSquare={flashSquare}
     onSquareClick={handleSquareClick}
     onSquareRightClick={clearPremoves}
     lastMove={isReviewing ? null : lastMove}
     flipped={playerSide === "b"}
     onEntranceEnd={markBoardReady}
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
    lowTime={clockReady && myTimeMs < CLOCK_LOW_TIME_MS}
    hasPremoves={!isReviewing && premoveQueue.length > 0}
    onCancelPremoves={clearPremoves}
    firstMoveSeconds={myTurnActive ? firstMoveSeconds : null}
   />

   {!isStarted && (
    <Box customClass="gr-draw-banner">
     <Text component="span">{waitingForOpponentText}</Text>
    </Box>
   )}

   {drawOffer && (
    <Box customClass="gr-draw-banner gr-draw-offer">
     <Box customClass="gr-draw-offer-text">
      <icons.handshake />
      <Text component="span" customClass="row-title">
       {opponentOfferedDrawText}
      </Text>
     </Box>
     <Box customClass="gr-draw-offer-actions">
      <Button
       variant="outlined"
       customClass="gr-draw-btn common-play"
       onClick={declineDraw}
      >
       {declineText}
      </Button>
      <Button
       variant="contained"
       customClass="common-play"
       onClick={acceptDraw}
      >
       {acceptText}
      </Button>
     </Box>
    </Box>
   )}

   <Box customClass="gr-foot">
    <Button
     customClass="gr-resign-btn cancel-btn common-play"
     onClick={() => setResignOpen(true)}
    >
     {resignText}
    </Button>
    {!isPvc && (
     <Button
      variant="outlined"
      customClass="gr-draw-btn common-play"
      onClick={offerDraw}
     >
      {drawText}
     </Button>
    )}
   </Box>

   <ResignSheet
    open={resignOpen || (blocker.state === "blocked" && !gameEnded)}
    isPvc={isPvc}
    betAmount={betAmount}
    onKeepPlaying={handleKeepPlaying}
    onResign={handleResignConfirm}
   />

   {gameEnded && (
    <GameOverOverlay
     gameEnded={gameEnded}
     outcome={MATCH_RESULT_OUTCOMES[gameEnded.result]}
     isPvc={isPvc}
     opponentName={opponentName}
     onNewGame={() => navigate(playPath, { replace: true })}
    />
   )}
  </Box>
 );
}
