import { Difficulty } from "@/types/components";
import {
    DollarSign,
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
import type { Currency, GameCategory, Pool, EngineLine } from "@/types/types";
import type { TransactionType } from "@/types/utils";

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

export const CURRENCY_META = {
    USD: { icon: DollarSign, color: "#f7931a" },
} as const;

export const QUEUE_TIMEOUT_SECONDS: Record<GameCategory, number> = {
    BULLET: 30,
    BLITZ: 45,
    RAPID: 60,
    CLASSICAL: 90,
};

export const STAKE_CURRENCY: Currency = "USD";

export const ENGINE_LINES: EngineLine[] = [
    { move: "Nc4", score: "+0.4", continuation: "Nc4 Qd7 f4 f6 Nf3" },
    { move: "Qd2", score: "+0.1", continuation: "Qd2 Nf6 Nc3 d5 e5" },
    { move: "f4", score: "-0.2", continuation: "f4 f6 Nf3 Ne7 d5" },
];

export const POOLS_FALLBACK: Pool[] = [
    {
        id: "bullet-1-USD",
        category: "BULLET",
        currency: "USD",
        stake: 5,
        prize: 9,
        time: "1+0",
        timeSeconds: 60,
        players: 634,
        active: 201,
        hot: true,
    },
    {
        id: "blitz-5-USD",
        category: "BLITZ",
        currency: "USD",
        stake: 10,
        prize: 18,
        time: "3+2",
        timeSeconds: 180,
        players: 418,
        active: 134,
        hot: true,
    },
    {
        id: "blitz-25-USD",
        category: "RAPID",
        currency: "USD",
        stake: 25,
        prize: 45,
        time: "5+0",
        timeSeconds: 300,
        players: 256,
        active: 78,
        hot: false,
    },
    {
        id: "rapid-100-USD",
        category: "CLASSICAL",
        currency: "USD",
        stake: 50,
        prize: 90,
        time: "10+0",
        timeSeconds: 600,
        players: 112,
        active: 33,
        hot: false,
    },
    {
        id: "rapid-250-USD",
        category: "RAPID",
        currency: "USD",
        stake: 100,
        prize: 180,
        time: "15+10",
        timeSeconds: 900,
        players: 55,
        active: 15,
        hot: false,
    },
    {
        id: "classical-1000-USD",
        category: "CLASSICAL",
        currency: "USD",
        stake: 500,
        prize: 900,
        time: "30+0",
        timeSeconds: 1800,
        players: 14,
        active: 4,
        hot: false,
    },
];

export const PATH_TITLE: Record<string, string> = {
    "/play": "Play",
    "/matchmaking": "Find Match",
    "/history": "Game History",
    "/wallet": "Wallet",
    "/leaderboard": "Leaderboard",
    "/friends": "Friends",
};

export const NAV_ITEMS = [
    { id: "play", path: "/play", label: "Play" },
    { id: "my-matches", path: "/history", label: "Game History" },
    { id: "leaderboards", path: "/leaderboard", label: "Leaderboards" },
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
