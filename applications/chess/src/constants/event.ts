export const GAME_EVENTS = {
 READY: "game_ready",
 START: "game_start",
 MOVE: "game_move",
 DRAW_OFFER: "game_draw_offer",
 DRAW_ACCEPT: "game_draw_accept",
 DRAW_DECLINE: "game_draw_decline",
 RESIGN: "game_resign",
 DISCONNECT: "game_disconnect",
 OPPONENT_OFFLINE: "game_opponent_offline",
 OPPONENT_ONLINE: "game_opponent_online",
} as const;
