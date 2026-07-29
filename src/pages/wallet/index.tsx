import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import Button from "../../components/base/Button/Button";
import StatCard from "@/components/base/StatCard/StatCard";
import BalanceCard from "./BalanceCard";
import TransactionList from "./TransactionList";
import { useWallet } from "@/hooks/useWallet";
import { useWalletActionModal } from "@/context/WalletActionModalContext";
import { formateAmount } from "@/utils/formate";
import {
    walletEyebrow,
    walletTitle,
    walletSubtitle,
    walletActionCardDepositTab,
    walletActionCardWithdrawTab,
    walletEmptyTitle,
    walletEmptyDesc,
    walletStatsDeposited,
    walletStatsWithdrawn,
    walletStatsNetPayouts,
} from "@/components/messages";

export default function Wallet() {
    const walletActionModal = useWalletActionModal();

    const {
        usdValue,
        withdrawableUsd,
        balanceLoading,
        stats,
        transactions,
        transactionsLoading,
        loadingMore,
        hasMore,
        loadMoreTransactions,
    } = useWallet();

    const isEmpty =
        !balanceLoading &&
        !transactionsLoading &&
        usdValue === 0 &&
        transactions.length === 0;

    return (
        <Box customClass="wallet-view">
            <Box customClass="lobby-heading">
                <Text as="p" customClass="lobby-eyebrow">
                    {walletEyebrow}
                </Text>
                <Text as="h1" customClass="lobby-heading-title">
                    {walletTitle}
                </Text>
                <Text as="p" customClass="lobby-heading-sub">
                    {walletSubtitle}
                </Text>
            </Box>

            {isEmpty ? (
                <>
                    <Box customClass="wallet-empty-hero">
                        <Box customClass="wallet-empty-icon">♛</Box>
                        <Text as="p" customClass="wallet-empty-title">
                            {walletEmptyTitle}
                        </Text>
                        <Text as="p" customClass="wallet-empty-desc">
                            {walletEmptyDesc}
                        </Text>
                    </Box>
                    <Box customClass="lobby-section wallet-empty-actions">
                        <Box customClass="wallet-action-buttons">
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={walletActionModal.openDeposit}
                            >
                                {walletActionCardDepositTab}
                            </Button>
                        </Box>
                    </Box>
                </>
            ) : (
                <Box customClass="wallet-dashboard-grid">
                    <Box customClass="lobby-section wallet-balance-col">
                        <BalanceCard
                            usdValue={usdValue}
                            withdrawableUsd={withdrawableUsd}
                            loading={balanceLoading}
                        />
                        <Box customClass="wallet-action-buttons">
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={walletActionModal.openDeposit}
                            >
                                {walletActionCardDepositTab}
                            </Button>
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={walletActionModal.openWithdraw}
                            >
                                {walletActionCardWithdrawTab}
                            </Button>
                        </Box>
                        <Box customClass="wallet-summary-stats">
                            <StatCard
                                label={walletStatsDeposited}
                                value={`+${formateAmount(stats.deposited, "USD")}`}
                                valueColor="positive"
                            />
                            <StatCard
                                label={walletStatsWithdrawn}
                                value={`-${formateAmount(Math.abs(stats.withdrawn), "USD")}`}
                                valueColor="negative"
                            />
                            <StatCard
                                label={walletStatsNetPayouts}
                                value={`${stats.netPayouts >= 0 ? "+" : "-"}${formateAmount(Math.abs(stats.netPayouts), "USD")}`}
                                valueColor={
                                    stats.netPayouts >= 0
                                        ? "positive"
                                        : "negative"
                                }
                            />
                        </Box>
                    </Box>

                    <TransactionList
                        transactions={transactions}
                        loading={transactionsLoading}
                        loadingMore={loadingMore}
                        hasMore={hasMore}
                        onLoadMore={loadMoreTransactions}
                    />
                </Box>
            )}
        </Box>
    );
}
