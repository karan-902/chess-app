import { useEffect } from "react";
import type { Socket } from "socket.io-client";
import type { AppDispatch } from "@/redux/store";
import { showToast } from "@/redux/common/common.slice";
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
} from "@/types/types";
import {
    playToastDrawDeclined,
    playToastOpponentDisconnectedTitle,
    playToastOpponentDisconnectedDesc,
    playToastOpponentReconnected,
} from "@/constants/messages";

interface IProps {
    socket: Socket | null;
    gameId: string | undefined;
    isPvc: boolean;
    dispatch: AppDispatch;
    graceSecondsRemaining: number | null;
    applyOpponentMove: (
        from: string,
        to: string,
        promotion: string | null,
        serverFen: string,
    ) => void;
    confirmMove: (serverFen: string) => void;
    restoreGame: (
        moves: Array<{ from: string; to: string; promotion: string | null }>,
    ) => void;
    syncClock: (whiteRemainingMs: number, blackRemainingMs: number) => void;
    notifySuperseded: () => void;
    setClockReady: (ready: boolean) => void;
    setDrawOffer: (offer: IdrawOfferedResponse | null) => void;
    setGameEnded: (ended: IgameEndedResponse) => void;
    setGraceSecondsRemaining: (
        update: number | null | ((s: number | null) => number | null),
    ) => void;
    setOpponentDisconnected: (disconnected: boolean) => void;
}

export function useGameSocket({
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
}: IProps) {
    const hasGrace = graceSecondsRemaining !== null;
    useEffect(() => {
        if (!hasGrace) return;
        const id = setInterval(() => {
            setGraceSecondsRemaining((s) =>
                s === null ? null : Math.max(0, s - 1),
            );
        }, 1000);
        return () => clearInterval(id);
    }, [hasGrace, setGraceSecondsRemaining]);

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
            if (data.draw_offered_by) {
                setDrawOffer({
                    game_id: data.game_id,
                    offered_by: data.draw_offered_by,
                });
            }
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
            if (data.game_id !== gameId) return;
            setGameEnded(data);
            setGraceSecondsRemaining(null);
        };
        const onSocketError = (data: ISocketErrorResponse) => {
            dispatch(showToast({ message: data.message, severity: "error" }));
        };
        const onOpponentDisconnected = (
            data: IopponentDisconnectedResponse,
        ) => {
            if (data.game_id !== gameId) return;
            setOpponentDisconnected(true);
            setGraceSecondsRemaining(data.grace_period_seconds);
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
            setGraceSecondsRemaining(null);
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
        restoreGame,
        syncClock,
        dispatch,
        notifySuperseded,
        setClockReady,
        setDrawOffer,
        setGameEnded,
        setGraceSecondsRemaining,
        setOpponentDisconnected,
    ]);

    useEffect(() => {
        if (!socket || !gameId || isPvc) return;
        const onPageHide = () => socket.emit("leave_game", { game_id: gameId });
        window.addEventListener("pagehide", onPageHide);
        return () => window.removeEventListener("pagehide", onPageHide);
    }, [socket, gameId, isPvc]);
}
