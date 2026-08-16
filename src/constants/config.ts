import { Difficulty } from "@/types/components";
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
    STAKE: Swords,
    SETTLEMENT: Trophy,
    DRAW_REFUND: Handshake,
    STAKE_REFUND: Undo2,
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
    DEPOSIT: "Deposits",
    WITHDRAW: "Withdrawals",
    WITHDRAW_REFUND: "Withdraw Refunds",
    STAKE: "Stakes",
    SETTLEMENT: "Winnings",
    DRAW_REFUND: "Draw Refunds",
    STAKE_REFUND: "Stake Refunds",
};

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

export const PATH_TITLE: Record<string, string> = {
    "/play": "Play",
    "/matchmaking": "Find Match",
    "/history": "Matches",
    "/wallet": "Wallet",
    "/leaderboard": "Leaderboard",
    "/friends": "Friends",
};

export const NAV_ITEMS = [
    { id: "play", path: "/play", label: "Play" },
    { id: "my-matches", path: "/history", label: "Matches" },
    { id: "leaderboard", path: "/leaderboard", label: "Leaderboard" },
    { id: "rules", path: "/rules", label: "Rules" },
];

export const DEPTH_MAP: Record<Difficulty, number> = {
    easy: 1,
    medium: 6,
    hard: 14,
};

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
