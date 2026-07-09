import {
    createContext,
    useContext,
    useEffect,
    useState,
    useRef,
    type ReactNode,
} from "react";
import { toast } from "sonner";
import type { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { useReduxSelector } from "@/store/hooks";
import { generateToken } from "@/utils";
import sessionService from "@/store/sessionService";
import { router } from "@/routes/router";

interface IUserCounts {
    active: number;
    inactive: number;
    total: number;
}

interface ISocketContext {
    userCounts: IUserCounts;
    myStatus: "active" | "inactive";
    socket: Socket | null;
}

const DEFAULT_COUNTS: IUserCounts = { active: 0, inactive: 0, total: 0 };

const SocketContext = createContext<ISocketContext>({
    userCounts: DEFAULT_COUNTS,
    myStatus: "inactive",
    socket: null,
});

export function SocketProvider({ children }: { children: ReactNode }) {
    const session = useReduxSelector((state) => state.auth.session);
    const isLoggedIn = useReduxSelector((state) => state.auth.isLoggedIn);
    const [userCounts, setUserCounts] = useState<IUserCounts>(DEFAULT_COUNTS);
    const [myStatus, setMyStatus] = useState<"active" | "inactive">("inactive");
    const [socket, setSocket] = useState<Socket | null>(null);
    const activityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!isLoggedIn || !session?.access_token) {
            disconnectSocket();
            setSocket(null);
            setUserCounts(DEFAULT_COUNTS);
            setMyStatus("inactive");
            return;
        }

        const sock = connectSocket(session.access_token);
        setSocket(sock);

        const onUserCounts = (counts: IUserCounts) => {
            setUserCounts(counts);
        };

        const onConnectError = async (err: any) => {
            if (err.data?.type === "token_expired") {
                try {
                    const access_token =
                        await generateToken("socket_reconnect");
                    sock.auth = { token: access_token };
                    sock.connect();
                } catch {
                    console.warn(
                        "[Socket] token refresh failed — session expired",
                    );
                }
            } else {
                console.warn("[Socket] connect error:", err.message);
            }
        };

        const onSessionTerminated = async () => {
            toast.error("Session terminated", {
                description: "You've been signed out. Please log in again.",
                duration: 5000,
            });
            disconnectSocket();
            await sessionService.deleteSession();
            router.navigate("/login", { replace: true });
        };

        sock.on("user_counts", onUserCounts);

        sock.on("connect_error", onConnectError);
        sock.on("session_terminated", onSessionTerminated);

        const emitActivity = () => {
            if (activityTimerRef.current) return;
            sock.emit("activity");
            activityTimerRef.current = setTimeout(() => {
                activityTimerRef.current = null;
            }, 1000);
        };

        document.addEventListener("mousemove", emitActivity);
        document.addEventListener("keypress", emitActivity);
        document.addEventListener("click", emitActivity);

        return () => {
            sock.off("user_counts", onUserCounts);

            sock.off("connect_error", onConnectError);
            sock.off("session_terminated", onSessionTerminated);
            document.removeEventListener("mousemove", emitActivity);
            document.removeEventListener("keypress", emitActivity);
            document.removeEventListener("click", emitActivity);
            if (activityTimerRef.current) {
                clearTimeout(activityTimerRef.current);
                activityTimerRef.current = null;
            }
        };
    }, [isLoggedIn, session?.access_token]);

    return (
        <SocketContext.Provider value={{ userCounts, myStatus, socket }}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    return useContext(SocketContext);
}
