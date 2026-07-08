import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { getSocket } from "@/lib/socket";

const INACTIVITY_MS = Number(import.meta.env.VITE_INACTIVITY_TIMEOUT_MS) || 180_000;

export function useInactivityTimeout(paused: boolean, turn: "w" | "b", fenHistoryLength: number, playerSide: "w" | "b" = "w") {
    const [inactiveOut, setInactiveOut] = useState(false);
    const [secsLeft, setSecsLeft] = useState<number | null>(null);
    const lastMoveAtRef = useRef(Date.now());
    const navigate = useNavigate();

    // Reset clock on every move (human or computer)
    useEffect(() => {
        lastMoveAtRef.current = Date.now();
        setSecsLeft(null);
    }, [fenHistoryLength]);

    // Countdown — only ticks on the human player's turn
    useEffect(() => {
        if (paused || turn !== playerSide) { setSecsLeft(null); return; }
        let active = true;
        const id = setInterval(() => {
            if (!active) return;
            const remaining = INACTIVITY_MS - (Date.now() - lastMoveAtRef.current);
            if (remaining <= 0) {
                active = false;
                clearInterval(id);
                setInactiveOut(true);
                setSecsLeft(null);
                return;
            }
            setSecsLeft(Math.ceil(remaining / 1000));
        }, 1000);
        return () => { active = false; clearInterval(id); };
    }, [turn, paused, playerSide]);

    // Server-side notification when a player is removed for inactivity
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;
        const onPlayerOffline = ({ reason }: { reason: string }) => {
            toast.error("You were removed", {
                description: reason === "inactivity_timeout"
                    ? "No move for 3 minutes. The game has ended."
                    : "You were disconnected from the game.",
                duration: 5000,
            });
            navigate("/lobby", { replace: true });
        };
        socket.on("player_offline", onPlayerOffline);
        return () => { socket.off("player_offline", onPlayerOffline); };
    }, [navigate]);

    const reset = () => {
        setInactiveOut(false);
        setSecsLeft(null);
        lastMoveAtRef.current = Date.now();
    };

    return { inactiveOut, secsLeft, reset };
}
