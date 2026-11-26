export type SignupMethod = "EMAIL" | "GOOGLE";
export type SessionState = "ACTIVE" | "INACTIVE" | "EXPIRED";
export type TwoFactorType = "NEW_DEVICE" | "VERIFY_EMAIL" | "RESET_PASSWORD";

export type TransactionType = "CREDIT" | "DEBIT";
export type TransactionCode =
 | "DEPOSIT"
 | "WITHDRAW"
 | "BET"
 | "WON"
 | "REFUND"
 | "WITHDRAW_REVERSAL"
 | "PROMO"
 | "ADJUSTMENT";

export type MatchResult = "WON" | "BET" | "DRAW" | "CANCEL";
export type MatchOutcome = "win" | "loss" | "draw" | "match_cancelled";

export type GamePage = "PLAY" | "MATCHES" | "LEADERBOARD" | "RULES";

export type LeaderboardScope = "daily" | "weekly" | "monthly" | "all";
export type LeaderboardSort = "earnings" | "wins";
