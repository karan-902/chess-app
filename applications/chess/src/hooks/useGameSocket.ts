import { useCallback, useEffect, useState } from "react";
import { useGameContext } from "@gopvp/common/src/contexts/GameContext";
import {
 showToastMessage,
 showBackdropLoader,
 hideBackdropLoader,
} from "@gopvp/common/src/util/injectStore";
import { useCountdown } from "@gopvp/common/src/hooks/useCountdown";
import {
 useChessDispatch,
 useChessSelector,
} from "@gopvp/chess/src/redux/chessHooks";
import { loadMatchState } from "@gopvp/chess/src/redux/match/thunk";
import { startMatch } from "@gopvp/chess/src/redux/match/slice";
import {
 callAPIInterface,
 showAckErrorToast,
 showApiErrorToast,
} from "@gopvp/common/src/util/api";
import { drawOfferDeclinedText } from "@gopvp/chess/src/constants/message";
import type {
 IDrawOfferEvent,
 IMatchResultResponse,
 ISocketAckError,
} from "@gopvp/common/src/types/response";
import type {
 IGameStartEvent,
 IMoveEvent,
 IMovePlayed,
 IMoveResponse,
} from "@gopvp/chess/src/types/response";
import type { IMoveBody } from "@gopvp/chess/src/types/payload";
import type { PieceColor } from "@gopvp/chess/src/types/index";
import type { IPvcSnapshot } from "@gopvp/chess/src/types/component";
import {
 loadMatchMoves,
 saveMatchMoves,
} from "@gopvp/chess/src/utils/storage";
import { ENDPOINTS } from "@gopvp/common/src/constants/endpoint";
import { SOCKET_EVENTS } from "@gopvp/common/src/constants/event";
import { GAME_EVENTS } from "@gopvp/chess/src/constants/event";
import { MATCH_END_FALLBACK_MS } from "@gopvp/chess/src/constants/limit";

const toDeadlineAt = (deadlineMs?: number) =>
 deadlineMs === undefined ? null : Date.now() + deadlineMs;

interface IProps {
 isPvc: boolean;
 isGameOver: boolean;
 timedOut: PieceColor | null;
 moveLog: IPvcSnapshot["moves"];
 applyServerFen: (fen: string, played?: IMovePlayed) => boolean;
 loadFen: (fen: string) => void;
 restoreGame: (moves: IPvcSnapshot["moves"]) => void;
 syncClock: (whiteRemainingMs: number, blackRemainingMs: number) => void;
 setGameEnded: (ended: IMatchResultResponse) => void;
}

export function useGameSocket({
 isPvc,
 isGameOver,
 timedOut,
 moveLog,
 applyServerFen,
 loadFen,
 restoreGame,
 syncClock,
 setGameEnded,
}: IProps) {
 const { socket, userId } = useGameContext();
 const dispatch = useChessDispatch();
 const matchState = useChessSelector((state) => state.match.state);
 const matchId = matchState?.match_id;
 const [clockReady, setClockReady] = useState(isPvc);
 const [drawOffer, setDrawOffer] = useState<IDrawOfferEvent | null>(null);
 const [isOpponentOffline, setIsOpponentOffline] = useState(false);
 const [firstMoveDeadlineAt, setFirstMoveDeadlineAt] = useState<number | null>(
  null,
 );
 const firstMoveSeconds = useCountdown(firstMoveDeadlineAt);

 const endMatch = useCallback(async () => {
  setFirstMoveDeadlineAt(null);
  showBackdropLoader();
  try {
   setGameEnded(
    await callAPIInterface<IMatchResultResponse>(
     "GET",
     `${ENDPOINTS.MATCH_RESULT}/${matchId}`,
    ),
   );
  } catch (err) {
   showApiErrorToast(err);
  } finally {
   hideBackdropLoader();
  }
 }, [matchId, setGameEnded]);

 const replaySavedMoves = useCallback(
  (id: string, fen: string) => {
   const savedMoves = loadMatchMoves(id);
   if (!savedMoves) return false;
   try {
    restoreGame(savedMoves);
   } catch {
    return false;
   }
   return applyServerFen(fen);
  },
  [restoreGame, applyServerFen],
 );

 const resync = useCallback(async () => {
  if (!matchId) return;
  if (!(await dispatch(loadMatchState({ matchId, userId })).unwrap()))
   endMatch();
 }, [matchId, userId, dispatch, endMatch]);

 useEffect(() => {
  if (isPvc || !matchState) return;
  const { match_id, fen, players } = matchState;
  const remainingTime = (color: PieceColor) =>
   players.find((player) => player.color === color)?.remaining_time ?? 0;
  const opponent = players.find((player) => player.user_id !== userId);
  if (!applyServerFen(fen) && !replaySavedMoves(match_id, fen)) loadFen(fen);
  syncClock(remainingTime("w"), remainingTime("b"));
  setClockReady(true);
  setDrawOffer(opponent?.draw_offer ? { offererId: opponent.user_id } : null);
  setFirstMoveDeadlineAt(toDeadlineAt(matchState.first_move_deadline_ms));
 }, [
  isPvc,
  matchState,
  userId,
  applyServerFen,
  replaySavedMoves,
  loadFen,
  syncClock,
 ]);

 useEffect(() => {
  if (isPvc || !matchId || moveLog.length === 0) return;
  saveMatchMoves(matchId, moveLog);
 }, [isPvc, matchId, moveLog]);

 useEffect(() => {
  if (!isPvc && (isGameOver || timedOut)) showBackdropLoader();
 }, [isPvc, isGameOver, timedOut]);

 useEffect(
  () => () => {
   hideBackdropLoader();
  },
  [],
 );

 useEffect(() => {
  if (!socket || isPvc || !matchId) return;
  socket.emit(GAME_EVENTS.READY, showAckErrorToast);
 }, [socket, isPvc, matchId]);

 useEffect(() => {
  if (!socket || isPvc) return;
  let endFallbackTimer: ReturnType<typeof setTimeout> | undefined;

  const onReconnect = () => {
   socket.emit(GAME_EVENTS.READY, showAckErrorToast);
   resync();
  };

  const onStart = (data: IGameStartEvent) => {
   if (data.matchId === matchId)
    dispatch(startMatch(data.firstMoveDeadlineMs));
  };

  const onOpponentForfeit = () => {
   showBackdropLoader();
   endFallbackTimer = setTimeout(endMatch, MATCH_END_FALLBACK_MS);
  };

  const onGameEnd = (data: IMatchResultResponse) => {
   if (data.id !== matchId) return;
   clearTimeout(endFallbackTimer);
   hideBackdropLoader();
   setFirstMoveDeadlineAt(null);
   setGameEnded(data);
  };

  const onMove = (data: IMoveEvent) => {
   if (data.isCheckmate || data.isDraw || data.isStaleMate || data.isTimeout)
    showBackdropLoader();
   else hideBackdropLoader();
   if (!applyServerFen(data.fen, data)) resync();
   syncClock(data.remainingTime.white, data.remainingTime.black);
   setFirstMoveDeadlineAt(toDeadlineAt(data.firstMoveDeadlineMs));
  };
  const onDrawDecline = () =>
   showToastMessage({
    toastMessage: drawOfferDeclinedText,
    toastVariant: "info",
   });
  const onOpponentOffline = () => setIsOpponentOffline(true);
  const onOpponentOnline = () => setIsOpponentOffline(false);

  socket.on(SOCKET_EVENTS.CONNECT, onReconnect);
  socket.on(GAME_EVENTS.START, onStart);
  socket.on(GAME_EVENTS.END, onGameEnd);
  socket.on(GAME_EVENTS.MOVE, onMove);
  socket.on(GAME_EVENTS.DRAW_OFFER, setDrawOffer);
  socket.on(GAME_EVENTS.DRAW_DECLINE, onDrawDecline);
  socket.on(GAME_EVENTS.OPPONENT_OFFLINE, onOpponentOffline);
  socket.on(GAME_EVENTS.OPPONENT_ONLINE, onOpponentOnline);
  socket.on(GAME_EVENTS.RESIGN, onOpponentForfeit);
  socket.on(GAME_EVENTS.DISCONNECT, onOpponentForfeit);
  socket.on(SOCKET_EVENTS.GAME_REJOIN_DECLINED, onOpponentForfeit);

  return () => {
   clearTimeout(endFallbackTimer);
   socket.off(SOCKET_EVENTS.CONNECT, onReconnect);
   socket.off(GAME_EVENTS.START, onStart);
   socket.off(GAME_EVENTS.END, onGameEnd);
   socket.off(GAME_EVENTS.MOVE, onMove);
   socket.off(GAME_EVENTS.DRAW_OFFER, setDrawOffer);
   socket.off(GAME_EVENTS.DRAW_DECLINE, onDrawDecline);
   socket.off(GAME_EVENTS.OPPONENT_OFFLINE, onOpponentOffline);
   socket.off(GAME_EVENTS.OPPONENT_ONLINE, onOpponentOnline);
   socket.off(GAME_EVENTS.RESIGN, onOpponentForfeit);
   socket.off(GAME_EVENTS.DISCONNECT, onOpponentForfeit);
   socket.off(SOCKET_EVENTS.GAME_REJOIN_DECLINED, onOpponentForfeit);
  };
 }, [
  socket,
  isPvc,
  matchId,
  applyServerFen,
  syncClock,
  resync,
  endMatch,
  setGameEnded,
  dispatch,
 ]);

 const handleMoveAck = (err: ISocketAckError | null, data: IMoveResponse) => {
  if (err) {
   showAckErrorToast(err);
   resync();
   return;
  }
  if (data.error || !applyServerFen(data.fen)) {
   resync();
   return;
  }
  syncClock(data.remaining_time.white, data.remaining_time.black);
  setFirstMoveDeadlineAt(toDeadlineAt(data.first_move_deadline_ms));
 };

 const sendMove = (from: string, to: string, promotion?: string) => {
  const body: IMoveBody = { from, to, promotion };
  setDrawOffer(null);
  setFirstMoveDeadlineAt(null);
  socket?.emit(GAME_EVENTS.MOVE, body, handleMoveAck);
 };

 const resign = () => {
  showBackdropLoader();
  socket?.emit(GAME_EVENTS.RESIGN, (err: ISocketAckError | null) => {
   if (!err) return;
   hideBackdropLoader();
   showAckErrorToast(err);
  });
 };

 const offerDraw = () =>
  socket?.emit(GAME_EVENTS.DRAW_OFFER, showAckErrorToast);

 const acceptDraw = () => {
  setDrawOffer(null);
  showBackdropLoader();
  socket?.emit(
   GAME_EVENTS.DRAW_ACCEPT,
   (err: ISocketAckError | null, data: IMoveResponse) => {
    if (err || data.error) hideBackdropLoader();
    handleMoveAck(err, data);
   },
  );
 };

 const declineDraw = () => {
  setDrawOffer(null);
  socket?.emit(GAME_EVENTS.DRAW_DECLINE, showAckErrorToast);
 };

 return {
  clockReady,
  drawOffer,
  isOpponentOffline,
  firstMoveSeconds,
  sendMove,
  resign,
  offerDraw,
  acceptDraw,
  declineDraw,
 };
}
