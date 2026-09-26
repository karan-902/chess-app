import type { PieceColor } from "@gopvp/chess/src/types/index";

/** gameplay */
export type IRemainingTime = {
 white: number;
 black: number;
};

export type IMoveResponse =
 | { error: "not_found" | "not_your_turn" | "invalid_move" }
 | {
    error?: undefined;
    fen: string;
    is_checkmate: boolean;
    is_stalemate: boolean;
    is_draw: boolean;
    is_timeout: boolean;
    turn_user_id: string;
    remaining_time: IRemainingTime;
    first_move_deadline_ms?: number;
   };

export type IMoveEvent = {
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

export type IGameStateMove = {
 user_id: string;
 from: string;
 to: string;
 promotion: string | null;
 move_count: number;
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
 move_history: IGameStateMove[];
 first_move_deadline_ms?: number;
};
