export type View = "play" | "matchmaking" | "wallet" | "leaderboard";
export type TBoard = (string | null)[][];
export type PoolCategory = "all" | "BULLET" | "BLITZ" | "RAPID" | "CLASSICAL";
export type GameCategory = Exclude<PoolCategory, "all">;

export interface Pool {
    id: string;
    category: GameCategory;
    stake: number;
    prize: number;
    time: string;
    timeSeconds: number;
    players: number;
    active: number;
    hot: boolean;
}

export interface IPoolStats {
    games: number;
    players: number;
}

export interface IPoolsResponse {
    stats: IPoolStats;
    pools: {
        id: string;
        stake: number;
        prize: number;
        time: string;
        time_seconds: number;
        players: number;
        active: number;
        hot: boolean;
    }[];
}

export interface IjoinQueueBody {
    stake_amount: number;
    pool_type: PoolCategory;
}

export interface IqueueJoinedResponse {
    message: string;
    stake_amount: number;
    your_elo: number;
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

export interface IqueueLeftResponse {
    message: string;
}
export interface IqueueErrorResponse {
    message: string;
}
export interface IQueueTimeoutResponse {
    message: string;
}

export interface IChallengeReceivedResponse {
    challenger_id: string;
    challenger_username: string;
    stake_amount: number;
}

export interface IChallengeDeclinedResponse {
    friend_id: string;
    message?: string;
}

export interface IChallengeExpiredResponse {
    friend_id?: string;
    challenger_id?: string;
}

export interface IChallengeCancelledResponse {
    challenger_id: string;
}

export interface IChallengeErrorResponse {
    message: string;
}

export interface IChallengeMatchFoundResponse {
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
    reason?:
        | "checkmate"
        | "resign"
        | "draw"
        | "opponent_disconnected"
        | string;
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

export interface IMatchFound extends ImatchFoundResponse {}

export interface ILeaderboardPlayer {
    rank: number;
    id: string;
    username: string;
    country: string;
    elo_rating: number;
    avatar_seed: string | null;
    earnings: number;
}

export interface ILeaderboardResponse {
    players: ILeaderboardPlayer[];
}

export interface IActivityFeedEvent {
    winner_id: string;
    winner_username: string;
    prize_usd: number;
    winner_streak: number;
}

export interface ITransactionCompletedEvent {
    type: "DEPOSIT" | "WITHDRAW";
    amount_usd: number;
}

export interface IGameHistoryOpponent {
    id: string;
    username: string;
    elo_rating: number;
}

export interface IGameHistoryItem {
    game_id: string;
    player: { id: string; username: string };
    opponent: IGameHistoryOpponent;
    result: "win" | "loss" | "draw";
    end_reason: string;
    elo_change: number;
    stake_amount: number;
    settlement_usd: number;
    time_seconds: number;
    played_at: number;
}

export interface IGameHistoryResponse {
    has_more: boolean;
    object: "list";
    page_id: string | null;
    data: IGameHistoryItem[];
}

export interface IGameHistoryStatsResponse {
    win_rate: number;
    games: number;
    current_streak: number;
    best_streak: number;
}

export interface Transaction {
    id: number;
    type: "win" | "loss" | "deposit" | "withdraw";
    desc: string;
    amount: string;
    usd: string;
    time: string;
}

export interface EngineLine {
    move: string;
    score: string;
    continuation: string;
}

export interface MoveRecord {
    n: number;
    w: string;
    b: string;
}
