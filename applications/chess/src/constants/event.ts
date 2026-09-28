import { SOCKET_EVENTS } from "@gopvp/common/src/constants/event";

export const GAME_EVENTS = {
 MOVE: "game:move",
 DRAW_OFFER: "game:draw:offer",
 DRAW_ACCEPT: "game:draw:accept",
 DRAW_DECLINE: "game:draw:decline",
 RESIGN: "game:resign",
 ABORT: "game:abort",
 DISCONNECT: "game:disconnect",
 OPPONENT_OFFLINE: "game:opponent:offline",
 OPPONENT_ONLINE: "game:opponent:online",
} as const;

export const MATCH_END_EVENTS = [
 GAME_EVENTS.RESIGN,
 SOCKET_EVENTS.GAME_REJOIN_DECLINED,
 GAME_EVENTS.DISCONNECT,
 GAME_EVENTS.ABORT,
];
