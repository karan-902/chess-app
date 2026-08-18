import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { getSocket } from "@/lib/socket";
import { useSocket } from "@/context/SocketContext";
import { useReduxDispatch } from "@/redux/hooks";
import { showToast } from "@/redux/common/common.slice";
import { secondsToTimeControl } from "@/types/components";
import type {
    IRoomCreatedResponse,
    IRoomMatchedResponse,
    IRoomErrorResponse,
    IRoomExpiredResponse,
} from "@/types/types";

export type RoomStatus = "idle" | "creating" | "waiting" | "joining" | "found";

export function useRoomMatch() {
    const [status, setStatus] = useState<RoomStatus>("idle");
    const [roomCode, setRoomCode] = useState<string | null>(null);
    const [expiresInSeconds, setExpiresInSeconds] = useState(0);
    const codeRef = useRef<string | null>(null);
    const navigate = useNavigate();
    const { socket: ctxSocket } = useSocket();
    const dispatch = useReduxDispatch();

    const resetStatus = () => {
        setStatus("idle");
        setRoomCode(null);
        codeRef.current = null;
    };

    const createRoom = (
        stakeAmount: number,
        timeSeconds: number,
        isRated: boolean = false,
    ) => {
        const socket = getSocket();
        if (!socket) return;
        setStatus("creating");
        socket.emit("create_room", {
            stake_amount: stakeAmount,
            time_seconds: timeSeconds,
            is_rated: isRated,
        });
    };

    const joinRoom = (code: string) => {
        const socket = getSocket();
        if (!socket) return;
        setStatus("joining");
        socket.emit("join_room", { code });
    };

    const cancelRoom = () => {
        const socket = getSocket();
        if (socket && codeRef.current) {
            socket.emit("cancel_room", { code: codeRef.current });
        }
        resetStatus();
    };

    useEffect(() => {
        const socket = ctxSocket ?? getSocket();
        if (!socket) return;

        const onRoomCreated = (data: IRoomCreatedResponse) => {
            setStatus("waiting");
            setRoomCode(data.code);
            codeRef.current = data.code;
            setExpiresInSeconds(data.expires_in_seconds);
        };

        const onRoomMatched = (data: IRoomMatchedResponse) => {
            setStatus("found");
            navigate(
                `/play?mode=pvp&time=${secondsToTimeControl(data.time_seconds)}` +
                    `&game_id=${data.game_id}&color=${data.your_color}` +
                    `&opponent=${encodeURIComponent(data.opponent.username)}` +
                    `&opp_rating=${data.opponent.elo_rating}&opp_id=${data.opponent.id}` +
                    `&opp_avatar_seed=${encodeURIComponent(data.opponent.avatar_seed ?? "")}` +
                    `&stake_amount=${data.stake_amount}`,
                { replace: true },
            );
        };

        const onRoomError = ({ message }: IRoomErrorResponse) => {
            dispatch(showToast({ message, severity: "error" }));
            resetStatus();
        };

        const onRoomExpired = ({ message }: IRoomExpiredResponse) => {
            if (message) dispatch(showToast({ message, severity: "info" }));
            resetStatus();
        };

        socket.on("room_created", onRoomCreated);
        socket.on("room_matched", onRoomMatched);
        socket.on("room_error", onRoomError);
        socket.on("room_expired", onRoomExpired);

        return () => {
            socket.off("room_created", onRoomCreated);
            socket.off("room_matched", onRoomMatched);
            socket.off("room_error", onRoomError);
            socket.off("room_expired", onRoomExpired);
        };
    }, [navigate, ctxSocket, dispatch]);

    useEffect(() => {
        if (status !== "waiting") return;
        const interval = setInterval(() => {
            setExpiresInSeconds((s) => Math.max(0, s - 1));
        }, 1000);
        return () => clearInterval(interval);
    }, [status]);

    return {
        status,
        roomCode,
        expiresInSeconds,
        createRoom,
        joinRoom,
        cancelRoom,
        resetStatus,
    };
}
