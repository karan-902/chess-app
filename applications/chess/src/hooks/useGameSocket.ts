import { useCallback, useEffect, useState } from "react";
import { useGameContext } from "@gopvp/common/src/contexts/GameContext";
import { showToastMessage } from "@gopvp/common/src/util/injectStore";
import { useCountdown } from "@gopvp/chess/src/hooks/useCountdown";
import {
    useChessDispatch,
    useChessSelector,
} from "@gopvp/chess/src/redux/chessHooks";
import { loadMatchState } from "@gopvp/chess/src/redux/match/thunk";
import {
    callAPIInterface,
    showAckErrorToast,
    showApiErrorToast,
} from "@gopvp/common/src/util/api";
import { drawOfferDeclinedText } from "@gopvp/chess/src/constants/messages";
import type {
    IDrawOfferEvent,
    IMatchResultResponse,
    ISocketAckError,
} from "@gopvp/common/src/types/response";
import type { IMoveEvent, IMoveResponse } from "@gopvp/chess/src/types/response";
import type { IMoveBody } from "@gopvp/chess/src/types/payload";
import type { PieceColor } from "@gopvp/chess/src/types/index";

const MATCH_END_EVENTS = [
    "game:resign",
    "game:rejoin:declined",
    "game:disconnect",
    "game:abort",
];

const toDeadlineAt = (deadlineMs?: number) =>
    deadlineMs === undefined ? null : Date.now() + deadlineMs;

interface IProps {
    isPvc: boolean;
    applyServerFen: (fen: string) => boolean;
    restoreGame: (
        moves: Array<{ from: string; to: string; promotion: string | null }>,
    ) => void;
    syncClock: (whiteRemainingMs: number, blackRemainingMs: number) => void;
    setGameEnded: (ended: IMatchResultResponse) => void;
}

export function useGameSocket({
    isPvc,
    applyServerFen,
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
    const [firstMoveDeadlineAt, setFirstMoveDeadlineAt] = useState<
        number | null
    >(null);
    const firstMoveSeconds = useCountdown(firstMoveDeadlineAt);

    const endMatch = useCallback(async () => {
        setFirstMoveDeadlineAt(null);
        try {
            setGameEnded(
                await callAPIInterface<IMatchResultResponse>(
                    "GET",
                    `/matches/match-result/${matchId}`,
                ),
            );
        } catch (err) {
            showApiErrorToast(err);
        }
    }, [matchId, setGameEnded]);

    const resync = useCallback(async () => {
        if (!matchId) return;
        if (!(await dispatch(loadMatchState({ matchId, userId })).unwrap()))
            endMatch();
    }, [matchId, userId, dispatch, endMatch]);

    useEffect(() => {
        if (isPvc || !matchState) return;
        const { move_history, players } = matchState;
        const remainingTime = (color: PieceColor) =>
            players.find((player) => player.color === color)?.remaining_time ??
            0;
        const opponent = players.find((player) => player.user_id !== userId);
        restoreGame(move_history);
        syncClock(remainingTime("w"), remainingTime("b"));
        setClockReady(true);
        setDrawOffer(
            opponent?.draw_offer ? { offererId: opponent.user_id } : null,
        );
        setFirstMoveDeadlineAt(
            toDeadlineAt(matchState.first_move_deadline_ms),
        );
    }, [isPvc, matchState, userId, restoreGame, syncClock]);

    useEffect(() => {
        if (!socket || isPvc) return;

        const onMove = (data: IMoveEvent) => {
            if (!applyServerFen(data.fen)) resync();
            syncClock(data.remainingTime.white, data.remainingTime.black);
            setFirstMoveDeadlineAt(toDeadlineAt(data.firstMoveDeadlineMs));
            if (
                data.isCheckmate ||
                data.isStaleMate ||
                data.isDraw ||
                data.isTimeout
            )
                endMatch();
        };
        const onDrawDecline = () =>
            showToastMessage({
                toastMessage: drawOfferDeclinedText,
                toastVariant: "info",
            });
        const onOpponentOffline = () => setIsOpponentOffline(true);
        const onOpponentOnline = () => setIsOpponentOffline(false);

        socket.on("connect", resync);
        socket.on("game:move", onMove);
        socket.on("game:draw:offer", setDrawOffer);
        socket.on("game:draw:decline", onDrawDecline);
        socket.on("game:opponent:offline", onOpponentOffline);
        socket.on("game:opponent:online", onOpponentOnline);
        MATCH_END_EVENTS.forEach((event) => socket.on(event, endMatch));

        return () => {
            socket.off("connect", resync);
            socket.off("game:move", onMove);
            socket.off("game:draw:offer", setDrawOffer);
            socket.off("game:draw:decline", onDrawDecline);
            socket.off("game:opponent:offline", onOpponentOffline);
            socket.off("game:opponent:online", onOpponentOnline);
            MATCH_END_EVENTS.forEach((event) => socket.off(event, endMatch));
        };
    }, [socket, isPvc, applyServerFen, syncClock, resync, endMatch, dispatch]);

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
        if (
            data.is_checkmate ||
            data.is_stalemate ||
            data.is_draw ||
            data.is_timeout
        )
            endMatch();
    };

    const sendMove = (from: string, to: string, promotion?: string) => {
        const body: IMoveBody = { from, to, promotion };
        setDrawOffer(null);
        setFirstMoveDeadlineAt(null);
        socket?.emit("game:move", body, handleMoveAck);
    };

    const resign = () =>
        socket?.emit("game:resign", (err: ISocketAckError | null) =>
            err ? showAckErrorToast(err) : endMatch(),
        );

    const offerDraw = () => socket?.emit("game:draw:offer", showAckErrorToast);

    const acceptDraw = () => {
        setDrawOffer(null);
        socket?.emit("game:draw:accept", handleMoveAck);
    };

    const declineDraw = () => {
        setDrawOffer(null);
        socket?.emit("game:draw:decline", showAckErrorToast);
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
