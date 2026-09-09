import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

const g = globalThis as typeof globalThis & { __ks_socket?: Socket | null };

export function connectSocket(accessToken: string): Socket {
    if (g.__ks_socket) return g.__ks_socket;

    g.__ks_socket = io(
        (import.meta.env.VITE_SOCKET_URL ?? "http://localhost:6060").trim(),
        {
            auth: { token: accessToken },
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionDelay: 2000,
            reconnectionDelayMax: 5000,

            reconnectionAttempts: Infinity,
        },
    );

    return g.__ks_socket;
}

export function disconnectSocket() {
    if (g.__ks_socket) {
        g.__ks_socket.disconnect();
        g.__ks_socket = null;
    }
}

export function getSocket(): Socket | null {
    return g.__ks_socket ?? null;
}
