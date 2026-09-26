import { Rocket, Zap, Timer, Crown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import CallReceived from "@mui/icons-material/CallReceived";
import CallMade from "@mui/icons-material/CallMade";
import Handshake from "@mui/icons-material/Handshake";
import type { SvgIconComponent } from "@mui/icons-material";
import type {
 GameCategory,
 LeaderboardScope,
 LeaderboardSort,
} from "@/types/types";
import type { TransactionType } from "@/types/utils";
import {
 playReasonCheckmate,
 playReasonResignation,
 playReasonDraw,
 playReasonStalemate,
 playReasonTimeout,
 playReasonInactivity,
 leaderboardScopeDailyLabel,
 leaderboardScopeWeeklyLabel,
 leaderboardScopeMonthlyLabel,
 leaderboardScopeAllLabel,
 leaderboardSortEarningsLabel,
 leaderboardSortWinsLabel,
} from "@/constants/messages";

export const LEADERBOARD_SCOPES: LeaderboardScope[] = [
 "daily",
 "weekly",
 "monthly",
 "all",
];

export const LEADERBOARD_SCOPE_LABELS: Record<LeaderboardScope, string> = {
 daily: leaderboardScopeDailyLabel,
 weekly: leaderboardScopeWeeklyLabel,
 monthly: leaderboardScopeMonthlyLabel,
 all: leaderboardScopeAllLabel,
};

export const LEADERBOARD_SORTS: LeaderboardSort[] = ["earnings", "wins"];

export const LEADERBOARD_SORT_LABELS: Record<LeaderboardSort, string> = {
 earnings: leaderboardSortEarningsLabel,
 wins: leaderboardSortWinsLabel,
};

export const CATEGORY_META: Record<
 GameCategory,
 { icon: LucideIcon; label: string }
> = {
 BULLET: { icon: Rocket, label: "BULLET" },
 BLITZ: { icon: Zap, label: "BLITZ" },
 RAPID: { icon: Timer, label: "RAPID" },
 CLASSICAL: { icon: Crown, label: "CLASSICAL" },
};

export const TRANSACTION_TYPE_ICONS: Record<TransactionType, SvgIconComponent> =
 {
  DEPOSIT: CallReceived,
  WITHDRAW: CallMade,
  WITHDRAW_REFUND: CallReceived,
  BET: CallMade,
  WIN: CallReceived,
  DRAW: Handshake,
  MATCH_CANCELLED: CallReceived,
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

export const DEBIT_TRANSACTION_TYPES = new Set<TransactionType>([
 "WITHDRAW",
 "BET",
]);

export const GAME_END_REASON_LABELS: Record<string, string> = {
 checkmate: playReasonCheckmate,
 resign: playReasonResignation,
 draw: playReasonDraw,
 stalemate: playReasonStalemate,
 timeout: playReasonTimeout,
 opponent_disconnected: playReasonInactivity,
};

export const POOL_TIMEOUT_SECONDS = 60;

export const GAMES = {
 chess: { label: "Chess" },
} as const;

export type GameSlug = keyof typeof GAMES;

export const GAME_PAGES = {
 PLAY: "play",
 MATCHES: "matches",
 LEADERBOARD: "leaderboard",
 RULES: "rules",
} as const;

export const GAME_PAGE_TITLES: Record<string, string> = {
 [GAME_PAGES.PLAY]: "Play",
 [GAME_PAGES.MATCHES]: "Matches",
 [GAME_PAGES.LEADERBOARD]: "Leaderboard",
 [GAME_PAGES.RULES]: "Rules",
};

export const NAV_ITEMS = [
 { id: "play", page: "PLAY", label: "Play" },
 { id: "my-matches", page: "MATCHES", label: "Matches" },
 { id: "leaderboard", page: "LEADERBOARD", label: "Leaderboard" },
 { id: "rules", page: "RULES", label: "Rules" },
] as const;

export const COUNTRIES = [
 "Afghanistan",
 "Albania",
 "Algeria",
 "Argentina",
 "Australia",
 "Austria",
 "Bangladesh",
 "Belgium",
 "Brazil",
 "Canada",
 "Chile",
 "China",
 "Colombia",
 "Croatia",
 "Czech Republic",
 "Denmark",
 "Egypt",
 "Ethiopia",
 "Finland",
 "France",
 "Germany",
 "Ghana",
 "Greece",
 "Hungary",
 "India",
 "Indonesia",
 "Iran",
 "Iraq",
 "Ireland",
 "Israel",
 "Italy",
 "Japan",
 "Jordan",
 "Kenya",
 "Malaysia",
 "Mexico",
 "Morocco",
 "Netherlands",
 "New Zealand",
 "Nigeria",
 "Norway",
 "Pakistan",
 "Peru",
 "Philippines",
 "Poland",
 "Portugal",
 "Romania",
 "Russia",
 "Saudi Arabia",
 "Serbia",
 "Singapore",
 "South Africa",
 "South Korea",
 "Spain",
 "Sri Lanka",
 "Sweden",
 "Switzerland",
 "Thailand",
 "Turkey",
 "Ukraine",
 "United Arab Emirates",
 "United Kingdom",
 "United States",
 "Venezuela",
 "Vietnam",
];

export const COUNTRY_OPTIONS = COUNTRIES.map((country) => ({
 value: country,
 label: country,
}));
