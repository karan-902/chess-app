export type SignupMethod = "EMAIL" | "GOOGLE";
export type SessionState = "ACTIVE" | "INACTIVE" | "EXPIRED";

export type TransactionType =
 | "DEPOSIT"
 | "WITHDRAW"
 | "WITHDRAW_REFUND"
 | "BET"
 | "WIN"
 | "DRAW"
 | "MATCH_CANCELLED";

export type MatchResult = "WIN" | "BET" | "DRAW" | "MATCH_CANCELLED";
export type MatchOutcome = "win" | "loss" | "draw" | "match_cancelled";

export type LeaderboardScope = "daily" | "weekly" | "monthly" | "all";
export type LeaderboardSort = "earnings" | "wins";
