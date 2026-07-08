// ── General app types ─────────────────────────────────────────────────────────

export type View = 'play' | 'matchmaking' | 'wallet' | 'leaderboard'
export type Board = (string | null)[][]

export type PoolCategory = 'all' | 'bullet' | 'blitz' | 'rapid' | 'classical'

export interface Pool {
    id: number
    stake: string
    stake_amount: number
    prize: string
    players: number
    time: string
    active: number
    usd: string
    category: Exclude<PoolCategory, 'all'>
}

export interface IMatchFound {
    game_id: string
    stake_amount: number
    your_color: "white" | "black"
    opponent: {
        id: string
        user_name: string
        elo_rating: number
    }
}

export interface Leader {
    rank: number
    name: string
    rating: number
    earnings: string
    streak: number
    flag: string
    isYou?: boolean
}

export interface Transaction {
    id: number
    type: 'win' | 'loss' | 'deposit' | 'withdraw'
    desc: string
    amount: string
    usd: string
    time: string
}

export interface EngineLine {
    move: string
    score: string
    continuation: string
}

export interface MoveRecord {
    n: number
    w: string
    b: string
}
