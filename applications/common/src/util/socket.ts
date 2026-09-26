import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { socketUrl } from "@gopvp/common/src/constants/env";

const g = globalThis as typeof globalThis & { socket?: Socket | null };

export function connectSocket(accessToken: string): Socket {
 if (g.socket) return g.socket;

 g.socket = io(socketUrl, {
  auth: { token: accessToken },
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionDelay: 2000,
  reconnectionDelayMax: 5000,

  reconnectionAttempts: Infinity,
 });

 return g.socket;
}

export function disconnectSocket() {
 if (g.socket) {
  g.socket.disconnect();
  g.socket = null;
 }
}

export function getSocket(): Socket | null {
 return g.socket ?? null;
}
