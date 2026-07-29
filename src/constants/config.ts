import { Difficulty } from "@/types/components";
import {
    Swords,
    Trophy,
    Wallet,
    Home,
    ClipboardList,
    DollarSign,
} from "lucide-react";
import type { Currency, GameCategory, Pool, EngineLine } from "@/types/types";

export const CATEGORY_META: Record<
    GameCategory,
    { emoji: string; label: string }
> = {
    bullet: { emoji: "⚡", label: "BULLET" },
    blitz: { emoji: "🔥", label: "BLITZ" },
    rapid: { emoji: "⏱", label: "RAPID" },
    classical: { emoji: "🏛", label: "CLASSICAL" },
};

export const CURRENCY_META = {
    USD: { icon: DollarSign, color: "#f7931a" },
} as const;

export const QUEUE_TIMEOUT_SECONDS: Record<GameCategory, number> = {
    bullet: 30,
    blitz: 45,
    rapid: 60,
    classical: 90,
};

export const STAKE_CURRENCY: Currency = "USD";

// Placeholder engine suggestion shown in EnginePanel — not live Stockfish output.
export const ENGINE_LINES: EngineLine[] = [
    { move: "Nc4", score: "+0.4", continuation: "Nc4 Qd7 f4 f6 Nf3" },
    { move: "Qd2", score: "+0.1", continuation: "Qd2 Nf6 Nc3 d5 e5" },
    { move: "f4", score: "-0.2", continuation: "f4 f6 Nf3 Ne7 d5" },
];

// Shown only if the initial pools fetch fails.
export const POOLS_FALLBACK: Pool[] = [
    { id: "bullet-1-USD", category: "bullet", currency: "USD", stake: 5, prize: 9, time: "1+0", timeSeconds: 60, players: 634, active: 201, hot: true },
    { id: "blitz-5-USD", category: "blitz", currency: "USD", stake: 10, prize: 18, time: "3+2", timeSeconds: 180, players: 418, active: 134, hot: true },
    { id: "blitz-25-USD", category: "blitz", currency: "USD", stake: 25, prize: 45, time: "5+0", timeSeconds: 300, players: 256, active: 78, hot: false },
    { id: "rapid-100-USD", category: "rapid", currency: "USD", stake: 50, prize: 90, time: "10+0", timeSeconds: 600, players: 112, active: 33, hot: false },
    { id: "rapid-250-USD", category: "rapid", currency: "USD", stake: 100, prize: 180, time: "15+10", timeSeconds: 900, players: 55, active: 15, hot: false },
    { id: "classical-1000-USD", category: "classical", currency: "USD", stake: 500, prize: 900, time: "30+0", timeSeconds: 1800, players: 14, active: 4, hot: false },
];

export const PATH_TITLE: Record<string, string> = {
    "/lobby": "Lobby",
    "/play": "Live Game",
    "/matchmaking": "Find Match",
    "/history": "Game History",
    "/wallet": "Wallet",
    "/leaderboard": "Leaderboard",
};

export const NAV_ITEMS = [
    { id: "lobby", path: "/lobby", icon: Home, label: "Lobby" },
    {
        id: "matchmaking",
        path: "/matchmaking",
        icon: Swords,
        label: "Match",
    },
    {
        id: "history",
        path: "/history",
        icon: ClipboardList,
        label: "History",
    },
    {
        id: "wallet",
        path: "/wallet",
        icon: Wallet,
        label: "Wallet",
    },
    {
        id: "leaderboard",
        path: "/leaderboard",
        icon: Trophy,
        label: "Ranks",
    },
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
