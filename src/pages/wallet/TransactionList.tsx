import { useMemo, useState } from "react";
import clsx from "clsx";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import Button from "../../components/base/Button/Button";
import TransactionItem from "./TransactionItem";
import TransactionItemSkeleton from "./TransactionItemSkeleton";
import {
    walletTransactionsSectionTitle,
    walletTransactionsEmptyText,
    walletTransactionsLoadMore,
    walletFilterTitle,
    walletSortTitle,
    walletFilterAll,
    walletFilterPayouts,
    walletFilterStakes,
    walletFilterDeposits,
    walletFilterWithdrawals,
    walletSortNewest,
    walletSortAmount,
    walletTxFilterEmpty,
} from "@/components/messages";
import type { ITransactionResponse, TransactionType } from "@/types/utils";

const SKELETON_ROW_COUNT = 4;

type FilterValue = "all" | "payout" | "stake" | "deposit" | "withdraw";
type SortValue = "newest" | "amount";

const FILTER_TYPES: Record<Exclude<FilterValue, "all">, TransactionType[]> = {
    payout: ["PAYOUT", "DRAW_REFUND"],
    stake: ["STAKE_ESCROW", "ESCROW_REFUND"],
    deposit: ["DEPOSIT"],
    withdraw: ["WITHDRAW", "WITHDRAW_REFUND"],
};

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
    { value: "all", label: walletFilterAll },
    { value: "payout", label: walletFilterPayouts },
    { value: "stake", label: walletFilterStakes },
    { value: "deposit", label: walletFilterDeposits },
    { value: "withdraw", label: walletFilterWithdrawals },
];

const SORT_OPTIONS: { value: SortValue; label: string }[] = [
    { value: "newest", label: walletSortNewest },
    { value: "amount", label: walletSortAmount },
];

interface ITransactionListProps {
    transactions: ITransactionResponse[];
    loading: boolean;
    loadingMore: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
}

function TransactionList({
    transactions,
    loading,
    loadingMore,
    hasMore,
    onLoadMore,
}: ITransactionListProps) {
    const [filter, setFilter] = useState<FilterValue>("all");
    const [sort, setSort] = useState<SortValue>("newest");
    const [openMenu, setOpenMenu] = useState<"filter" | "sort" | null>(null);

    const visibleTransactions = useMemo(() => {
        const filtered =
            filter === "all"
                ? transactions
                : transactions.filter((tx) =>
                      FILTER_TYPES[filter].includes(tx.type),
                  );
        if (sort === "amount") {
            return [...filtered].sort(
                (a, b) => Math.abs(b.amount_usd) - Math.abs(a.amount_usd),
            );
        }
        return filtered;
    }, [transactions, filter, sort]);

    return (
        <Box customClass="lobby-section">
            <Box customClass="tx-header">
                <Text customClass="section-title">
                    {walletTransactionsSectionTitle}
                </Text>
                <Box customClass="tx-tools">
                    <Box customClass="tx-tool-wrap">
                        <Button
                            variant="outline"
                            size="sm"
                            customClass={clsx(
                                "tx-tool-btn",
                                filter !== "all" && "active-state",
                            )}
                            title={walletFilterTitle}
                            onClick={() =>
                                setOpenMenu((m) => (m === "filter" ? null : "filter"))
                            }
                        >
                            <SlidersHorizontal size={13} />
                        </Button>
                        {openMenu === "filter" && (
                            <Box customClass="tx-tool-menu">
                                {FILTER_OPTIONS.map((option) => (
                                    <Button
                                        key={option.value}
                                        variant="ghost"
                                        customClass={clsx(
                                            "tx-tool-menu-item",
                                            filter === option.value && "selected",
                                        )}
                                        onClick={() => {
                                            setFilter(option.value);
                                            setOpenMenu(null);
                                        }}
                                    >
                                        {option.label}
                                    </Button>
                                ))}
                            </Box>
                        )}
                    </Box>
                    <Box customClass="tx-tool-wrap">
                        <Button
                            variant="outline"
                            size="sm"
                            customClass={clsx(
                                "tx-tool-btn",
                                sort !== "newest" && "active-state",
                            )}
                            title={walletSortTitle}
                            onClick={() =>
                                setOpenMenu((m) => (m === "sort" ? null : "sort"))
                            }
                        >
                            <ArrowUpDown size={13} />
                        </Button>
                        {openMenu === "sort" && (
                            <Box customClass="tx-tool-menu">
                                {SORT_OPTIONS.map((option) => (
                                    <Button
                                        key={option.value}
                                        variant="ghost"
                                        customClass={clsx(
                                            "tx-tool-menu-item",
                                            sort === option.value && "selected",
                                        )}
                                        onClick={() => {
                                            setSort(option.value);
                                            setOpenMenu(null);
                                        }}
                                    >
                                        {option.label}
                                    </Button>
                                ))}
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
            <Box customClass="tx-list">
                {loading ? (
                    Array.from({ length: SKELETON_ROW_COUNT }, (_, i) => (
                        <TransactionItemSkeleton key={i} />
                    ))
                ) : transactions.length === 0 ? (
                    <Text customClass="tx-empty">{walletTransactionsEmptyText}</Text>
                ) : visibleTransactions.length === 0 ? (
                    <Text customClass="tx-empty">{walletTxFilterEmpty}</Text>
                ) : (
                    <>
                        {visibleTransactions.map((tx) => (
                            <TransactionItem key={tx.id} tx={tx} />
                        ))}
                        {hasMore && filter === "all" && (
                            <Button
                                variant="ghost"
                                size="sm"
                                fullWidth
                                isLoading={loadingMore}
                                onClick={onLoadMore}
                                customClass="tx-load-more"
                            >
                                {walletTransactionsLoadMore}
                            </Button>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
}

export default TransactionList;
