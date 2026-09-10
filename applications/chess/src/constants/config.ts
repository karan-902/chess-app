import {
 Rocket,
 Zap,
 Timer,
 Crown,
 ArrowDownToLine,
 ArrowUpFromLine,
 Undo2,
 Swords,
 Trophy,
 Handshake,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { GameCategory } from "@/types/types";
import type { TransactionType } from "@/types/utils";
import {
 playReasonCheckmate,
 playReasonResignation,
 playReasonDraw,
 playReasonStalemate,
 playReasonTimeout,
 playReasonInactivity,
} from "@/constants/messages";

export const CATEGORY_META: Record<
 GameCategory,
 { icon: LucideIcon; label: string }
> = {
 BULLET: { icon: Rocket, label: "BULLET" },
 BLITZ: { icon: Zap, label: "BLITZ" },
 RAPID: { icon: Timer, label: "RAPID" },
 CLASSICAL: { icon: Crown, label: "CLASSICAL" },
};

export const TRANSACTION_TYPE_ICONS: Record<TransactionType, LucideIcon> = {
 DEPOSIT: ArrowDownToLine,
 WITHDRAW: ArrowUpFromLine,
 WITHDRAW_REFUND: Undo2,
 BET: Swords,
 SETTLEMENT: Trophy,
 DRAW_REFUND: Handshake,
 BET_REFUND: Undo2,
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
 DEPOSIT: "Deposits",
 WITHDRAW: "Withdrawals",
 WITHDRAW_REFUND: "Withdraw Refunds",
 BET: "Bets",
 SETTLEMENT: "Winnings",
 DRAW_REFUND: "Draw Refunds",
 BET_REFUND: "Bet Refunds",
};

export const TRANSACTION_TYPE_DESCRIPTIONS: Record<TransactionType, string> = {
 DEPOSIT: "Received",
 WITHDRAW: "Sent",
 WITHDRAW_REFUND: "Refund",
 BET: "Bet",
 SETTLEMENT: "Won",
 DRAW_REFUND: "Refund",
 BET_REFUND: "Refund",
};

export const PLATFORM_PAYOUT_MULTIPLIER = 0.88;

export const GAME_END_REASON_LABELS: Record<string, string> = {
 checkmate: playReasonCheckmate,
 resign: playReasonResignation,
 draw: playReasonDraw,
 stalemate: playReasonStalemate,
 timeout: playReasonTimeout,
 opponent_disconnected: playReasonInactivity,
};

export const QUEUE_TIMEOUT_SECONDS: Record<GameCategory, number> = {
 BULLET: 30,
 BLITZ: 45,
 RAPID: 60,
 CLASSICAL: 90,
};

export const NAV_ITEMS = [
 { id: "play", path: "/play", label: "Play" },
 { id: "my-matches", path: "/matches", label: "Matches" },
 { id: "leaderboard", path: "/leaderboard", label: "Leaderboard" },
 { id: "rules", path: "/rules", label: "Rules" },
];

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
