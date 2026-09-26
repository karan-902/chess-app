export type GameCategory = "BULLET" | "BLITZ" | "RAPID" | "CLASSICAL";

export type IPoolResponse = {
 id: string;
 bet: number;
 prize: number;
 time: number;
};

export interface ISocketAckError {
 event: string;
 errors: { message: string; type: string }[];
}

export interface IMatchPlayer {
 id: string;
 username: string;
}

export type IPoolJoinAck =
 | { status: "WAITING" }
 | {
    status: "MATCHED";
    match_type: "POOL";
    match_id: string;
    players: IMatchPlayer[];
    first_move_deadline_ms: number;
   };

export interface IPoolMatchedEvent {
 matchId: string;
 firstMoveDeadlineMs: number;
}

export interface ImatchFoundResponse {
 message: string;
 game_id: string;
 stake_amount: number;
 time_seconds: number;
 your_color: "white" | "black";
 opponent: {
  id: string;
  username: string;
  elo_rating: number;
  avatar_seed: string | null;
 };
}

export interface IRematchOfferedResponse {
 game_id: string;
 offered_by: string;
 offered_by_username: string;
 stake_amount: number;
}

export interface IRematchExpiredResponse {
 game_id: string;
 message?: string;
}

export interface IRematchFoundResponse {
 game_id: string;
 from_game_id: string;
 your_color: "white" | "black";
 opponent: {
  id: string;
  username: string;
  elo_rating: number;
  avatar_seed: string | null;
 };
 stake_amount: number;
 time_seconds: number;
}

export interface IRoomCreatedResponse {
 code: string;
 stake_amount: number;
 time_seconds: number;
 is_rated: boolean;
 expires_in_seconds: number;
}

export interface IRoomMatchedResponse {
 game_id: string;
 room_code: string;
 your_color: "white" | "black";
 opponent: {
  id: string;
  username: string;
  elo_rating: number;
  avatar_seed: string | null;
 };
 stake_amount: number;
 is_rated: boolean;
 time_seconds: number;
}

export interface IRoomErrorResponse {
 message: string;
}

export interface IRoomExpiredResponse {
 code: string;
 message?: string;
}

export interface IActiveGameFoundResponse {
 game_id: string;
 your_color: "white" | "black";
 opponent: {
  id: string;
  username: string;
  elo_rating: number;
  avatar_seed: string | null;
 };
 stake_amount: number;
 time_seconds: number;
}

export interface ISettlementSide {
 usd: number;
}

export interface IGameSettlement {
 winner: ISettlementSide;
 loser: ISettlementSide;
}

export interface IgameEndedResponse {
 game_id: string;
 winner_id: string | null;
 reason?: "checkmate" | "resign" | "draw" | "opponent_disconnected" | string;
 settlement: IGameSettlement | null;
 your_elo_gain?: number;
 your_streak?: number;
}

export interface IopponentMoveResponse {
 from: string;
 to: string;
 promotion: string | null;
 fen: string;
}

export interface IMoveConfirmedResponse {
 from: string;
 to: string;
 promotion: string | null;
 fen: string;
}

export interface IgameRestoreResponse {
 game_id: string;
 status: string;
 time_seconds: number;
 current_fen: string;
 turn_user_id: string;
 white_remaining_ms: number;
 black_remaining_ms: number;
 draw_offered_by: string | null;
 moves: Array<{
  from: string;
  to: string;
  promotion: string | null;
  fen: string;
  player_id: string;
  move_number: number;
 }>;
}

export interface IClockUpdateResponse {
 white_remaining_ms: number;
 black_remaining_ms: number;
}

export interface IdrawOfferedResponse {
 game_id: string;
 offered_by: string;
}

export interface IdrawRejectedResponse {
 game_id: string;
}

export interface ISocketErrorResponse {
 message: string;
}

export interface IopponentDisconnectedResponse {
 game_id: string;
 grace_period_seconds: number;
}

export interface IopponentReconnectedResponse {
 game_id: string;
}

export type LeaderboardScope = "daily" | "weekly" | "monthly" | "all";

export type LeaderboardSort = "earnings" | "wins";

export interface ILeaderboardPlayer {
 id: string;
 username: string;
 win_amount?: number;
 wins?: number;
}

export interface ILeaderboardRequestBody {
 game: string;
 scope: LeaderboardScope;
 sort: LeaderboardSort;
 ending_before?: string;
}

export interface ILeaderboardPlayerStatsResponse {
 username: string;
 score: number;
 current_streak: number;
 best_streak: number;
 gross_income: number;
 wins: number;
}

export interface ILeaderboardResponse {
 has_more: boolean;
 object: "list";
 data: ILeaderboardPlayer[] | null;
 page_id: string;
}

export interface ITransactionCompletedEvent {
 type: "DEPOSIT" | "WITHDRAW";
 amount: number;
}

export type MatchResult = "WIN" | "BET" | "DRAW" | "MATCH_CANCELLED";

export type MatchEndReason =
 | "CHECKMATE"
 | "TIMEOUT"
 | "RESIGN"
 | "DRAW"
 | "DISCONNECT"
 | "DECLINED"
 | "ABORT";

export interface IMatchGame {
 name: string;
 slug: string;
 icon: string;
}

export interface IOwnMatchItem {
 id: string;
 game: IMatchGame;
 result: MatchResult;
 amount: number;
 opponent: string;
 end_reason: MatchEndReason;
 time: number;
 bet: number;
 created: number;
}

export interface IWorldMatchItem {
 id: string;
 game: IMatchGame;
 winner: string;
 loser: string;
 amount: number;
 created: number;
}

export type IGameHistoryItem = IOwnMatchItem | IWorldMatchItem;

export interface IGameHistoryResponse {
 has_more: boolean;
 object: "list";
 page_id: string | null;
 data: IGameHistoryItem[] | null;
}

export interface MoveRecord {
 n: number;
 w: string;
 b: string;
}
