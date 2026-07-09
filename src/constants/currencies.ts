import { Bitcoin, DollarSign, type LucideIcon } from "lucide-react";
import type { Pool, Transaction } from "@/types/types";

export type Currency = "BTC" | "USDT" | "USDC";

export interface ICurrencyMeta {
    id:          Currency;
    name:        string;
    decimals:    number;
    networks:    { id: string; label: string }[];
    color:       string;
    placeholder: string;
    icon:        LucideIcon;
}

export const CURRENCY_META: Record<Currency, ICurrencyMeta> = {
    BTC: {
        id: "BTC",
        name: "Bitcoin",
        decimals: 8,
        networks: [
            { id: "lightning", label: "⚡ Lightning" },
            { id: "onchain",   label: "⛓ On-chain"  },
        ],
        color: "#F7931A",
        placeholder: "0.00000000",
        icon: Bitcoin,
    },
    USDT: {
        id: "USDT",
        name: "Tether",
        decimals: 2,
        networks: [
            { id: "erc20", label: "ETH · ERC-20" },
            { id: "trc20", label: "TRX · TRC-20" },
        ],
        color: "#26A17B",
        placeholder: "0.00",
        icon: DollarSign,
    },
    USDC: {
        id: "USDC",
        name: "USD Coin",
        decimals: 2,
        networks: [
            { id: "erc20",  label: "ETH · ERC-20" },
            { id: "solana", label: "◎ Solana"      },
        ],
        color: "#2775CA",
        placeholder: "0.00",
        icon: DollarSign,
    },
};

export const CURRENCIES: Currency[] = ["BTC", "USDT", "USDC"];

// ── Category labels ───────────────────────────────────────────────────────────

import type { GameCategory } from "@/types/types";

export const CATEGORY_META: Record<GameCategory, { emoji: string; label: string }> = {
    bullet:    { emoji: "⚡", label: "BULLET"    },
    blitz:     { emoji: "🔥", label: "BLITZ"     },
    rapid:     { emoji: "⏱",  label: "RAPID"     },
    classical: { emoji: "🏛",  label: "CLASSICAL" },
};

// ── Time control formatter ────────────────────────────────────────────────────

export function formatTimeControl(time: string): string {
    const [minStr, incStr] = time.split("+");
    const min = parseInt(minStr, 10);
    const inc = parseInt(incStr ?? "0", 10);
    const base = min >= 60 ? `${min / 60}h` : `${min} min`;
    return inc > 0 ? `${base}  +${inc} sec/move` : base;
}

export function formatClock(seconds: number): string {
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

// ── Amount formatter ──────────────────────────────────────────────────────────

export function formatAmount(amount: number, currency: Currency): string {
    if (currency === "BTC") {
        // show meaningful BTC precision (up to 8 decimals, strip trailing zeros)
        return `${parseFloat(amount.toFixed(8))} BTC`;
    }
    return `${amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2)} ${currency}`;
}

// ── Per-currency mock pool data (fallback when API is unavailable) ─────────────

export const POOLS_BY_CURRENCY: Record<Currency, Pool[]> = {
    BTC: [
        { id: "bullet-1-BTC",      category: "bullet",    currency: "BTC", stake: 0.00001, prize: 0.000018, time: "1+0",   timeSeconds: 60,   players: 512, active: 178 },
        { id: "blitz-5-BTC",       category: "blitz",     currency: "BTC", stake: 0.00005, prize: 0.00009,  time: "3+2",   timeSeconds: 180,  players: 310, active: 89  },
        { id: "blitz-25-BTC",      category: "blitz",     currency: "BTC", stake: 0.0001,  prize: 0.00018,  time: "5+0",   timeSeconds: 300,  players: 198, active: 54  },
        { id: "rapid-100-BTC",     category: "rapid",     currency: "BTC", stake: 0.0005,  prize: 0.0009,   time: "10+0",  timeSeconds: 600,  players: 72,  active: 21  },
        { id: "rapid-250-BTC",     category: "rapid",     currency: "BTC", stake: 0.001,   prize: 0.0018,   time: "15+10", timeSeconds: 900,  players: 38,  active: 10  },
        { id: "classical-1000-BTC",category: "classical", currency: "BTC", stake: 0.005,   prize: 0.009,    time: "30+0",  timeSeconds: 1800, players: 12,  active: 3   },
    ],
    USDT: [
        { id: "bullet-1-USDT",      category: "bullet",    currency: "USDT", stake: 5,   prize: 9,   time: "1+0",   timeSeconds: 60,   players: 634, active: 201 },
        { id: "blitz-5-USDT",       category: "blitz",     currency: "USDT", stake: 10,  prize: 18,  time: "3+2",   timeSeconds: 180,  players: 418, active: 134 },
        { id: "blitz-25-USDT",      category: "blitz",     currency: "USDT", stake: 25,  prize: 45,  time: "5+0",   timeSeconds: 300,  players: 256, active: 78  },
        { id: "rapid-100-USDT",     category: "rapid",     currency: "USDT", stake: 50,  prize: 90,  time: "10+0",  timeSeconds: 600,  players: 112, active: 33  },
        { id: "rapid-250-USDT",     category: "rapid",     currency: "USDT", stake: 100, prize: 180, time: "15+10", timeSeconds: 900,  players: 55,  active: 15  },
        { id: "classical-1000-USDT",category: "classical", currency: "USDT", stake: 500, prize: 900, time: "30+0",  timeSeconds: 1800, players: 14,  active: 4   },
    ],
    USDC: [
        { id: "bullet-1-USDC",      category: "bullet",    currency: "USDC", stake: 5,   prize: 9,   time: "1+0",   timeSeconds: 60,   players: 589, active: 187 },
        { id: "blitz-5-USDC",       category: "blitz",     currency: "USDC", stake: 10,  prize: 18,  time: "3+2",   timeSeconds: 180,  players: 372, active: 112 },
        { id: "blitz-25-USDC",      category: "blitz",     currency: "USDC", stake: 25,  prize: 45,  time: "5+0",   timeSeconds: 300,  players: 221, active: 65  },
        { id: "rapid-100-USDC",     category: "rapid",     currency: "USDC", stake: 50,  prize: 90,  time: "10+0",  timeSeconds: 600,  players: 97,  active: 28  },
        { id: "rapid-250-USDC",     category: "rapid",     currency: "USDC", stake: 100, prize: 180, time: "15+10", timeSeconds: 900,  players: 46,  active: 12  },
        { id: "classical-1000-USDC",category: "classical", currency: "USDC", stake: 500, prize: 900, time: "30+0",  timeSeconds: 1800, players: 11,  active: 3   },
    ],
};

// ── Per-currency mock balances ─────────────────────────────────────────────────

export const BALANCE_BY_CURRENCY: Record<Currency, { amount: string; usd: string; profit: string }> = {
    BTC:  { amount: "0.05821",  usd: "≈ $3,492", profit: "+0.00082 BTC today ↑" },
    USDT: { amount: "1,240.00", usd: "≈ $1,240", profit: "+48.50 USDT today ↑"  },
    USDC: { amount: "845.00",   usd: "≈ $845",   profit: "+21.00 USDC today ↑"  },
};

// ── Per-currency mock transactions ────────────────────────────────────────────

export const TRANSACTIONS_BY_CURRENCY: Record<Currency, Transaction[]> = {
    BTC: [
        { id: 1, type: "win",      desc: "Won vs. Karpov_99",    amount: "+0.001 BTC",  usd: "+$60",    time: "2h ago" },
        { id: 2, type: "deposit",  desc: "Deposit · Lightning",  amount: "+0.01 BTC",   usd: "+$600",   time: "5h ago" },
        { id: 3, type: "loss",     desc: "Lost vs. DeepBlue_7",  amount: "-0.0005 BTC", usd: "-$30",    time: "8h ago" },
        { id: 4, type: "withdraw", desc: "Withdrawal to Wallet", amount: "-0.02 BTC",   usd: "-$1,200", time: "1d ago" },
        { id: 5, type: "win",      desc: "Won vs. Magnus_Fan",   amount: "+0.005 BTC",  usd: "+$300",   time: "2d ago" },
    ],
    USDT: [
        { id: 1, type: "win",      desc: "Won vs. Karpov_99",    amount: "+25 USDT",  usd: "+$25",  time: "2h ago" },
        { id: 2, type: "deposit",  desc: "Deposit · ERC-20",     amount: "+500 USDT", usd: "+$500", time: "5h ago" },
        { id: 3, type: "loss",     desc: "Lost vs. DeepBlue_7",  amount: "-10 USDT",  usd: "-$10",  time: "8h ago" },
        { id: 4, type: "withdraw", desc: "Withdrawal to Wallet", amount: "-200 USDT", usd: "-$200", time: "1d ago" },
        { id: 5, type: "win",      desc: "Won vs. Magnus_Fan",   amount: "+50 USDT",  usd: "+$50",  time: "2d ago" },
    ],
    USDC: [
        { id: 1, type: "win",      desc: "Won vs. Karpov_99",    amount: "+25 USDC",  usd: "+$25",  time: "2h ago" },
        { id: 2, type: "deposit",  desc: "Deposit · ERC-20",     amount: "+300 USDC", usd: "+$300", time: "5h ago" },
        { id: 3, type: "loss",     desc: "Lost vs. DeepBlue_7",  amount: "-10 USDC",  usd: "-$10",  time: "8h ago" },
        { id: 4, type: "withdraw", desc: "Withdrawal to Wallet", amount: "-100 USDC", usd: "-$100", time: "1d ago" },
        { id: 5, type: "win",      desc: "Won vs. Magnus_Fan",   amount: "+50 USDC",  usd: "+$50",  time: "2d ago" },
    ],
};
