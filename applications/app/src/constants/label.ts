import type {
 LeaderboardScope,
 LeaderboardSort,
 TransactionType,
} from "@gopvp/common/src/types/index";
import type { MatchesSubtab } from "@gopvp/common/src/types/component";
import { GAME_PAGES, ROUTES } from "@gopvp/app/src/constants/route";
import {
 dailyText,
 weeklyText,
 monthlyText,
 allTimeText,
 topEarnersText,
 mostWinsText,
 myResultsText,
 myStatsText,
 worldwideText,
} from "@gopvp/app/src/constants/message";

export const LEADERBOARD_SCOPE_LABELS: Record<LeaderboardScope, string> = {
 daily: dailyText,
 weekly: weeklyText,
 monthly: monthlyText,
 all: allTimeText,
};

export const LEADERBOARD_SORT_LABELS: Record<LeaderboardSort, string> = {
 earnings: topEarnersText,
 wins: mostWinsText,
};

export const TRANSACTION_TYPE_DESCRIPTIONS: Record<TransactionType, string> = {
 DEPOSIT: "Received",
 WITHDRAW: "Sent",
 WITHDRAW_REFUND: "Refund",
 BET: "Bet",
 WIN: "Won",
 DRAW: "Refund",
 MATCH_CANCELLED: "Refund",
};

export const GAME_PAGE_TITLES: Record<string, string> = {
 [GAME_PAGES.PLAY]: "Play",
 [GAME_PAGES.MATCHES]: "Matches",
 [GAME_PAGES.LEADERBOARD]: "Leaderboard",
 [GAME_PAGES.RULES]: "Rules",
};

export const PAGE_TITLES: Record<string, string> = {
 [ROUTES.LOGIN]: "Sign in",
 [ROUTES.REGISTER]: "Register",
 // [ROUTES.APPROVE_DEVICE]: "Approve device",
 [ROUTES.WALLET]: "Wallet",
 [ROUTES.PROFILE]: "Profile",
};

export const MATCHES_SUBTAB_LABELS: Record<MatchesSubtab, string> = {
 history: myResultsText,
 stats: myStatsText,
 global: worldwideText,
};
