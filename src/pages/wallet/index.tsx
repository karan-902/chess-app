import { useState } from "react";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import StatCard from "../../components/base/StatCard/StatCard";
import BalanceCard from "./BalanceCard";
import ActionCard from "./ActionCard";
import TransactionList from "./TransactionList";

export default function Wallet() {
    const [tab, setTab] = useState<"deposit" | "withdraw">("deposit");
    const [network, setNetwork] = useState<"lightning" | "onchain">(
        "lightning",
    );

    return (
        <Box customClass="wallet-view">
            <Box customClass="lobby-heading">
                <Text as="h1" customClass="lobby-heading-title">Wallet</Text>
                <Text as="p" customClass="lobby-heading-sub">Manage your funds and track performance</Text>
            </Box>
            <BalanceCard />
            <Box customClass="wallet-stats-grid">
                <StatCard
                    label="USDC Value"
                    value="$1,240"
                    valueColor="accent"
                />
                <StatCard
                    label="All-time P&L"
                    value="+2.3 ETH"
                    valueColor="accent"
                />
                <StatCard label="Total Wins" value="47" valueColor="accent" />
                <StatCard label="Win Rate" value="68%" valueColor="accent" />
            </Box>
            <Box customClass="wallet-main">
                <ActionCard
                    tab={tab}
                    network={network}
                    onTabChange={setTab}
                    onNetworkChange={setNetwork}
                />
                <TransactionList />
            </Box>
        </Box>
    );
}
