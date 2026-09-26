import {
 Rocket,
 Zap,
 Timer,
 Crown,
 CallReceivedIcon,
 CallMadeIcon,
 HandshakeIcon,
} from "@gopvp/common/src/components/images";
import type { LucideIcon, SvgIconComponent } from "@gopvp/common/src/components/images";
import type { GameCategory, MatchOutcome } from "@gopvp/chess/src/types/index";
import type {
 LeaderboardScope,
 LeaderboardSort,
 MatchResult,
 TransactionType,
} from "@gopvp/common/src/types/index";
import {
 checkmateText,
 resignText,
 drawText,
 stalemateText,
 timeoutText,
 inactivityText,
 dailyText,
 weeklyText,
 monthlyText,
 allTimeText,
 topEarnersText,
 mostWinsText,
} from "@gopvp/chess/src/constants/messages";

export const LEADERBOARD_SCOPES: LeaderboardScope[] = [
 "daily",
 "weekly",
 "monthly",
 "all",
];

export const LEADERBOARD_SCOPE_LABELS: Record<LeaderboardScope, string> = {
 daily: dailyText,
 weekly: weeklyText,
 monthly: monthlyText,
 all: allTimeText,
};

export const LEADERBOARD_SORTS: LeaderboardSort[] = ["earnings", "wins"];

export const LEADERBOARD_SORT_LABELS: Record<LeaderboardSort, string> = {
 earnings: topEarnersText,
 wins: mostWinsText,
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
  DEPOSIT: CallReceivedIcon,
  WITHDRAW: CallMadeIcon,
  WITHDRAW_REFUND: CallReceivedIcon,
  BET: CallMadeIcon,
  WIN: CallReceivedIcon,
  DRAW: HandshakeIcon,
  MATCH_CANCELLED: CallReceivedIcon,
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
 CHECKMATE: checkmateText,
 RESIGN: resignText,
 DRAW: drawText,
 STALEMATE: stalemateText,
 TIMEOUT: timeoutText,
 DISCONNECT: inactivityText,
};

export const MATCH_RESULT_OUTCOMES: Record<MatchResult, MatchOutcome> = {
 WIN: "win",
 BET: "loss",
 DRAW: "draw",
 MATCH_CANCELLED: "draw",
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

export const NAV_ITEMS = (["PLAY", "MATCHES", "LEADERBOARD", "RULES"] as const).map(
 (page) => ({ page, label: GAME_PAGE_TITLES[GAME_PAGES[page]] }),
);

const COUNTRIES = [
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
