import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { getSocket } from "@/lib/socket";
import { useSocket } from "@/context/SocketContext";
import { useReduxDispatch } from "@/redux/hooks";
import { showToast } from "@/redux/toast.slice";
import { secondsToTimeControl } from "@/types/components";
import type {
    IRematchOfferedResponse,
    IRematchExpiredResponse,
    IRematchFoundResponse,
} from "@/types/types";

export type RematchStatus = "idle" | "offered" | "opponent-offered" | "found";

const OFFER_WINDOW_SECONDS = 30;

export function useRematch(gameId: string | undefined) {
    const [status, setStatus] = useState<RematchStatus>("idle");
    const [secondsLeft, setSecondsLeft] = useState(OFFER_WINDOW_SECONDS);
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const statusRef = useRef<RematchStatus>("idle");
    const navigate = useNavigate();
    const { socket: ctxSocket } = useSocket();
    const dispatch = useReduxDispatch();

    useEffect(() => {
        statusRef.current = status;
    }, [status]);

    const stopCountdown = () => {
        if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
        }
    };

    const offerRematch = () => {
        const socket = getSocket();
        if (!socket || !gameId) return;
        socket.emit("offer_rematch", { game_id: gameId });
        setStatus("offered");
        setSecondsLeft(OFFER_WINDOW_SECONDS);
        stopCountdown();
        countdownRef.current = setInterval(() => {
            setSecondsLeft((s) => Math.max(0, s - 1));
        }, 1000);
    };

    useEffect(() => {
        const socket = ctxSocket ?? getSocket();
        if (!socket || !gameId) return;

        const onRematchOffered = (data: IRematchOfferedResponse) => {
            if (data.game_id !== gameId) return;

            setStatus((prev) => (prev === "offered" ? prev : "opponent-offered"));
        };

        const onRematchExpired = (data: IRematchExpiredResponse) => {
            if (data.game_id !== gameId) return;
            stopCountdown();
            setStatus("idle");
            if (data.message)
                dispatch(
                    showToast({ message: data.message, severity: "error" }),
                );
        };

        const onRematchFound = (data: IRematchFoundResponse) => {

            if (data.from_game_id !== gameId) return;
            stopCountdown();
            setStatus("found");
            navigate(
                `/play?mode=pvp&time=${secondsToTimeControl(data.time_seconds)}` +
                    `&game_id=${data.game_id}&color=${data.your_color}` +
                    `&opponent=${encodeURIComponent(data.opponent.username)}` +
                    `&opp_rating=${data.opponent.elo_rating}&opp_id=${data.opponent.id}` +
                    `&opp_avatar_seed=${encodeURIComponent(data.opponent.avatar_seed ?? "")}` +
                    `&initial_timeout=${data.inactivity_timeout_seconds}` +
                    `&stake_amount=${data.stake_amount}`,
                { replace: true },
            );
        };

        socket.on("rematch_offered", onRematchOffered);
        socket.on("rematch_expired", onRematchExpired);
        socket.on("rematch_found", onRematchFound);

        return () => {
            socket.off("rematch_offered", onRematchOffered);
            socket.off("rematch_expired", onRematchExpired);
            socket.off("rematch_found", onRematchFound);

            if (statusRef.current === "offered" && gameId) {
                socket.emit("cancel_rematch_offer", { game_id: gameId });
            }
            stopCountdown();
        };
    }, [gameId, navigate, ctxSocket]);

    return { status, secondsLeft, offerRematch };
}
