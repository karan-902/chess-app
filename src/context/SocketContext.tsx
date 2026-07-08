import {
    createContext,
    useContext,
    useEffect,
    useState,
    useRef,
    type ReactNode,
} from "react";
import { toast } from "sonner";
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
}

const DEFAULT_COUNTS: IUserCounts = { active: 0, inactive: 0, total: 0 };

const SocketContext = createContext<ISocketContext>({
    userCounts: DEFAULT_COUNTS,
    myStatus: "inactive",
});

const TOKEN_ERRORS = [
    "Invalid or expired token",
    "Session has expired",
    "Authentication required",
    "Session is not active",
];

export function SocketProvider({ children }: { children: ReactNode }) {
    const session = useReduxSelector((state) => state.auth.session);
    const isLoggedIn = useReduxSelector((state) => state.auth.isLoggedIn);
    const [userCounts, setUserCounts] = useState<IUserCounts>(DEFAULT_COUNTS);
    const [myStatus, setMyStatus] = useState<"active" | "inactive">("inactive");
    const activityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const refreshingRef = useRef(false);

    useEffect(() => {
        if (!isLoggedIn || !session?.access_token) {
            disconnectSocket();
            setUserCounts(DEFAULT_COUNTS);
            setMyStatus("inactive");
            return;
        }

        const socket = connectSocket(session.access_token);

        const onUserCounts = (counts: IUserCounts) => {
            setUserCounts(counts);
        };

        const onStatusChanged = ({ status }: { status: "active" | "inactive" }) => {
            setMyStatus(status);
        };

        const onConnectError = async (err: Error) => {
            if (TOKEN_ERRORS.includes(err.message) && !refreshingRef.current) {
                refreshingRef.current = true;
                try {
                    const access_token = await generateToken();
                    socket.auth = { token: access_token };
                    socket.connect();
                } catch {
                    console.warn(
                        "[Socket] token refresh failed — session expired",
                    );
                } finally {
                    refreshingRef.current = false;
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

        socket.on("user_counts", onUserCounts);
        socket.on("status_changed", onStatusChanged);
        socket.on("connect_error", onConnectError);
        socket.on("session_terminated", onSessionTerminated);

        const emitActivity = () => {
            if (activityTimerRef.current) return;
            socket.emit("activity");
            activityTimerRef.current = setTimeout(() => {
                activityTimerRef.current = null;
            }, 1000);
        };

        document.addEventListener("mousemove", emitActivity);
        document.addEventListener("keypress", emitActivity);
        document.addEventListener("click", emitActivity);

        return () => {
            socket.off("user_counts", onUserCounts);
            socket.off("status_changed", onStatusChanged);
            socket.off("connect_error", onConnectError);
            socket.off("session_terminated", onSessionTerminated);
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
        <SocketContext.Provider value={{ userCounts, myStatus }}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    return useContext(SocketContext);
}
