import { Difficulty } from "@/types/components";
import { Swords, Trophy, Wallet, Home, ClipboardList, MessageCircle } from "lucide-react";

export const PATH_TITLE: Record<string, string> = {
    "/lobby":        "Lobby",
    "/play":         "Live Game",
    "/matchmaking":  "Find Match",
    "/chat":         "Messages",
    "/history":      "Game History",
    "/wallet":       "Wallet",
    "/leaderboard":  "Leaderboard",
};

// Desktop sidebar — all 6 destinations
export const NAV_ITEMS = [
    { id: "lobby",       path: "/lobby",       icon: Home,          label: "Lobby"   },
    { id: "matchmaking", path: "/matchmaking", icon: Swords,        label: "Match"   },
    { id: "history",     path: "/history",     icon: ClipboardList, label: "History" },
    { id: "chat",        path: "/chat",        icon: MessageCircle, label: "Chat"    },
    { id: "wallet",      path: "/wallet",      icon: Wallet,        label: "Wallet"  },
    { id: "leaderboard", path: "/leaderboard", icon: Trophy,        label: "Ranks"   },
];

// Mobile bottom nav — 5 core items; Chat lives in the AppBar on mobile
export const BOTTOM_NAV_ITEMS = NAV_ITEMS.filter(i => i.id !== "chat");

export const DEPTH_MAP: Record<Difficulty, number> = {
    easy: 1,
    medium: 6,
    hard: 14,
};
