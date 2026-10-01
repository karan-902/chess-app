import type { PieceColor } from "@gopvp/chess/src/types/index";

export type IRemainingTime = {
 white: number;
 black: number;
};

export type IMovePlayed = {
 from?: string;
 to?: string;
 promotion?: string | null;
};

export type IMoveResponse =
 | { error: "invalid_move" }
 | (IMovePlayed & {
    error?: undefined;
    fen: string;
    is_checkmate: boolean;
    is_stalemate: boolean;
    is_draw: boolean;
    is_timeout: boolean;
    turn_user_id: string;
    remaining_time: IRemainingTime;
    first_move_deadline_ms?: number;
   });

export type IMoveEvent = IMovePlayed & {
 fen: string;
 isCheckmate: boolean;
 isDraw: boolean;
 isStaleMate: boolean;
 isTimeout: boolean;
 turnUserId: string;
 remainingTime: IRemainingTime;
 firstMoveDeadlineMs?: number;
};

export type IGameStatePlayer = {
 user_id: string;
 username: string;
 score: number;
 color: PieceColor;
 remaining_time: number;
 draw_offer: boolean;
};

export type IGameStateResponse = {
 match_id: string;
 fen: string;
 status: string;
 game_slug: string;
 bet: number;
 prize: number;
 time: number;
 players: IGameStatePlayer[];
 is_started: boolean;
 first_move_deadline_ms?: number;
};

export type IGameStartEvent = {
 matchId: string;
 firstMoveDeadlineMs: number;
};
