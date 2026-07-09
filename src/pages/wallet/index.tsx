import { useState } from "react";
import clsx from "clsx";
import { useCurrency } from "@/context/CurrencyContext";
import { CURRENCIES, CURRENCY_META } from "@/constants/currencies";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import StatCard from "../../components/base/StatCard/StatCard";
import BalanceCard from "./BalanceCard";
import ActionCard from "./ActionCard";
import TransactionList from "./TransactionList";

export default function Wallet() {
    const [tab, setTab] = useState<"deposit" | "withdraw">("deposit");
    const { currency, setCurrency } = useCurrency();

    return (
        <Box customClass="wallet-view">
            <Box customClass="lobby-heading">
                <Text as="h1" customClass="lobby-heading-title">Wallet</Text>
                <Text as="p" customClass="lobby-heading-sub">Manage your funds and track performance</Text>
            </Box>

            {/* Currency picker */}
            <Box customClass="currency-picker">
                {CURRENCIES.map((c) => {
                    const meta = CURRENCY_META[c];
                    return (
                        <button
                            key={c}
                            className={clsx("currency-pill", currency === c && "active")}
                            style={{ "--currency-color": meta.color } as React.CSSProperties}
                            onClick={() => setCurrency(c)}
                        >
                            <span className="currency-pill-dot" />
                            <span className="currency-pill-id">{c}</span>
                            <span className="currency-pill-name">{meta.name}</span>
                        </button>
                    );
                })}
            </Box>

            <BalanceCard />
            <Box customClass="wallet-stats-grid">
                <StatCard label="USD Value"    value={CURRENCY_META[currency].id === "BTC" ? "≈ $3,492" : `$${currency === "USDT" ? "1,240" : "845"}`} valueColor="accent" />
                <StatCard label="All-time P&L" value={currency === "BTC" ? "+0.012 BTC" : `+${currency === "USDT" ? "320" : "210"} ${currency}`} valueColor="accent" />
                <StatCard label="Total Wins"   value="47" valueColor="accent" />
                <StatCard label="Win Rate"     value="68%" valueColor="accent" />
            </Box>
            <Box customClass="wallet-main">
                <ActionCard tab={tab} onTabChange={setTab} />
                <TransactionList />
            </Box>
        </Box>
    );
}
