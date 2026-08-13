import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { getSocket } from "@/lib/socket";
import { useReduxDispatch } from "@/redux/hooks";
import { showToast } from "@/redux/toast.slice";

const DEFAULT_INACTIVITY_MS =
    Number(import.meta.env.VITE_INACTIVITY_TIMEOUT_MS) || 180_000;

export function useInactivityTimeout(
    paused: boolean,
    turn: "w" | "b",
    fenHistoryLength: number,
    playerSide: "w" | "b" = "w",
    inactivitySeconds?: number,
) {
    const inactivityMs = inactivitySeconds
        ? inactivitySeconds * 1000
        : DEFAULT_INACTIVITY_MS;
    const [inactiveOut, setInactiveOut] = useState(false);
    const [secsLeft, setSecsLeft] = useState<number | null>(null);
    const lastMoveAtRef = useRef(Date.now());
    const navigate = useNavigate();
    const dispatch = useReduxDispatch();

    useEffect(() => {
        lastMoveAtRef.current = Date.now();
        setSecsLeft(null);
    }, [fenHistoryLength]);

    useEffect(() => {
        if (paused || turn !== playerSide) {
            setSecsLeft(null);
            return;
        }
        let active = true;
        const id = setInterval(() => {
            if (!active) return;
            const remaining =
                inactivityMs - (Date.now() - lastMoveAtRef.current);
            if (remaining <= 0) {
                active = false;
                clearInterval(id);
                setInactiveOut(true);
                setSecsLeft(null);
                return;
            }
            setSecsLeft(Math.ceil(remaining / 1000));
        }, 1000);
        return () => {
            active = false;
            clearInterval(id);
        };
    }, [turn, paused, playerSide, inactivityMs]);

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;
        const onPlayerOffline = ({ message }: { message: string }) => {
            dispatch(showToast({ message, severity: "error" }));
            navigate("/play", { replace: true });
        };
        socket.on("player_offline", onPlayerOffline);
        return () => {
            socket.off("player_offline", onPlayerOffline);
        };
    }, [navigate]);

    const reset = () => {
        setInactiveOut(false);
        setSecsLeft(null);
        lastMoveAtRef.current = Date.now();
    };

    return { inactiveOut, secsLeft, reset };
}
