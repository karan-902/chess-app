// ── General app types ─────────────────────────────────────────────────────────

export type Currency = "BTC" | "USD";
export type View = "play" | "matchmaking" | "wallet" | "leaderboard";
export type TBoard = (string | null)[][];
export type PoolCategory = "all" | "bullet" | "blitz" | "rapid" | "classical";
export type GameCategory = Exclude<PoolCategory, "all">;

// ── Pool ──────────────────────────────────────────────────────────────────────

export interface Pool {
    id: string; // e.g. "bullet-1-BTC"
    category: GameCategory; // derived on frontend from id prefix
    currency: Currency; // added from response wrapper
    stake: number; // e.g. 0.00001
    prize: number; // e.g. 0.000018
    time: string; // e.g. "3+2" (minutes+increment)
    timeSeconds: number; // e.g. 180
    players: number;
    active: number;
    hot: boolean; // true if players >= 3 or active >= 2
}

export interface IPoolStats {
    games: number;
    players: number;
}

// ── REST ──────────────────────────────────────────────────────────────────────

export interface IPoolsResponse {
    currency: Currency;
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

// ── Socket: Client → Server ───────────────────────────────────────────────────

export interface IjoinQueueBody {
    stake_amount: number;
    currency: Currency;
    pool_type: PoolCategory;
}

// ── Socket: Server → Client ───────────────────────────────────────────────────

export interface IqueueJoinedResponse {
    message: string;
    stake_amount: number;
    currency: Currency;
    your_elo: number;
}

export interface ImatchFoundResponse {
    message: string;
    game_id: string;
    stake_amount: number;
    currency: Currency;
    time_seconds: number;
    inactivity_timeout_seconds: number;
    your_color: "white" | "black";
    opponent: {
        id: string;
        username: string;
        elo_rating: number;
        avatar_seed: string | null;
    };
}

// ── Rematch ────────────────────────────────────────────────────────────────────

export interface IRematchOfferedResponse {
    game_id: string;
    offered_by: string;
    offered_by_username: string;
    stake_amount: number;
    currency: Currency;
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
    currency: Currency;
    time_seconds: number;
    inactivity_timeout_seconds: number;
}

// ── Reconnect to an ongoing game after a dropped/closed session ────────────────

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
    currency: Currency;
    time_seconds: number;
    inactivity_timeout_seconds: number;
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
        | "inactivity"
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
    inactivity_timeout_seconds?: number;
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

export interface IinactivityTimeoutResponse {
    game_id: string;
    loser_id: string;
    reason: "inactivity";
    settlement: IGameSettlement | null;
    your_elo_gain?: number;
}

export interface IMatchFound extends ImatchFoundResponse {}

// ── Leaderboard ───────────────────────────────────────────────────────────────

export interface ILeaderboardPlayer {
    rank: number;
    id: string;
    username: string;
    country: string;
    elo_rating: number;
    avatar_seed: string | null;
    earnings: number; // in the subscribed currency, 0 if none
}

export interface ILeaderboardResponse {
    currency: Currency;
    players: ILeaderboardPlayer[];
}

// ── Activity Feed ──────────────────────────────────────────────────────────────

export interface IActivityFeedEvent {
    winner_id: string;
    winner_username: string;
    prize_usd: number;
    winner_streak: number;
}

// ── Wallet ────────────────────────────────────────────────────────────────────

export interface ITransactionCompletedEvent {
    type: "DEPOSIT" | "WITHDRAW";
    amount_usd: number;
}

// ── Game History ──────────────────────────────────────────────────────────────

export interface IGameHistoryOpponent {
    id: string;
    username: string;
    elo_rating: number;
    avatar_seed: string | null;
}

export interface IGameHistoryItem {
    game_id: string;
    opponent: IGameHistoryOpponent;
    result: "win" | "loss" | "draw";
    end_reason: string;
    elo_change: number;
    stake_amount: number;
    currency: Currency;
    settlement_usd: number; // net (+profit/-stake) in USD at settlement time, 0 on draw
    time_seconds: number;
    played_at: number; // Unix ms timestamp
}

export interface IGameHistoryResponse {
    has_more: boolean;
    object: "list";
    page_id: string | null; // opaque cursor, pass as ending_before to get next page
    data: IGameHistoryItem[];
}

// GET /game/history/stats — all-time, not scoped to whatever page is loaded
export interface IGameHistoryStatsResponse {
    win_rate: number;
    games: number;
    net_pl_usd: number;
}

// ── Other ─────────────────────────────────────────────────────────────────────

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
