import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
let socket: Socket | null = null;

export function connectSocket(accessToken: string): Socket {
    if (socket) return socket;

    socket = io((import.meta.env.VITE_SOCKET_URL ?? "http://localhost:6060").trim(), {
        auth: { token: accessToken },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 2000,
        reconnectionAttempts: 5,
    });

    return socket;
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}

export function getSocket(): Socket | null {
    return socket;
}
