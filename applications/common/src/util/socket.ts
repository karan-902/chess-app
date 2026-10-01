import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { isDev, socketUrl } from "@gopvp/common/src/constants/env";
import type {
 IGameNotFoundResponse,
 ISocketAckError,
} from "@gopvp/common/src/types/response";
import { SOCKET_EVENTS } from "@gopvp/common/src/constants/event";

const g = globalThis as typeof globalThis & { socket?: Socket | null };

function logSocket(...args: unknown[]) {
 // eslint-disable-next-line no-console
 console.log(...args);
}

export function connectSocket(accessToken: string): Socket {
 if (g.socket) return g.socket;

 const socket = io(socketUrl, {
  auth: { token: accessToken },
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionDelay: 2000,
  reconnectionDelayMax: 5000,

  reconnectionAttempts: Infinity,
 });

 if (isDev) {
  const emit = socket.emit.bind(socket);
  socket.emit = ((event: string, ...args: unknown[]) => {
   const ack = args[args.length - 1];
   if (typeof ack === "function") {
    args[args.length - 1] = (...response: unknown[]) => {
     logSocket("[socket ack]", event, ...response);
     ack(...response);
    };
   }
   logSocket(
    "[socket →]",
    event,
    ...args.filter((arg) => typeof arg !== "function"),
   );
   return emit(event, ...args);
  }) as Socket["emit"];
  socket.onAny((event: string, ...args: unknown[]) =>
   logSocket("[socket ←]", event, ...args),
  );
 }

 g.socket = socket;
 return socket;
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

export function requestGameState<TGameState extends { match_id: string }>(
 matchId: string,
) {
 return new Promise<TGameState | null>((resolve) => {
  const socket = getSocket();
  if (!socket) return resolve(null);
  socket.emit(
   SOCKET_EVENTS.GAME_STATE,
   (err: ISocketAckError | null, data: TGameState | IGameNotFoundResponse) =>
    resolve(err || "error" in data || data.match_id !== matchId ? null : data),
  );
 });
}
