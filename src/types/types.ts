// ── General app types ─────────────────────────────────────────────────────────

export type Currency = "BTC" | "USDT" | "USDC";
export type View = "play" | "matchmaking" | "wallet" | "leaderboard";
export type Board = (string | null)[][];
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
}

export interface IPoolStats {
    liquidity: number;
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
    }[];
}

// ── Socket: Client → Server ───────────────────────────────────────────────────

export interface IjoinQueueBody {
    stake_amount: number;
    currency: Currency;
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
    };
}

export interface IqueueLeftResponse {
    message: string;
}
export interface IqueueErrorResponse {
    message: string;
}

export interface IgameEndedResponse {
    game_id: string;
    winner_id: string | null;
    reason?: "checkmate" | "resign" | "draw" | "opponent_disconnected" | "inactivity" | string;
}

export interface IopponentMoveResponse {
    from:                      string;
    to:                        string;
    promotion:                 string | null;
    fen:                       string;
    inactivity_timeout_seconds?: number;
}

export interface IdrawOfferedResponse {
    game_id:    string;
    offered_by: string;
}

export interface IinactivityTimeoutResponse {
    game_id:  string;
    loser_id: string;
    reason:   "inactivity";
}

export interface IMatchFound extends ImatchFoundResponse {}

// ── Other ─────────────────────────────────────────────────────────────────────

export interface Leader {
    rank: number;
    name: string;
    rating: number;
    earnings: string;
    streak: number;
    flag: string;
    isYou?: boolean;
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
