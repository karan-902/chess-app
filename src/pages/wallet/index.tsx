import { useEffect, useState } from "react";
import dayjs from "dayjs";
import classNames from "classnames";
import { Virtuoso } from "react-virtuoso";
import { Filter } from "lucide-react";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import IconButton from "@/components/base/IconButton/IconButton";
import Label from "@/components/base/Label/Label";
import Input from "@/components/base/Input/Input";
import Drawer from "@/components/base/Drawer/Drawer";
import Skeleton from "@/components/base/Skeleton/Skeleton";
import { useWallet } from "@/hooks/useWallet";
import { useWalletActionModal } from "@/context/WalletActionModalContext";
import { formateAmount, formateTime } from "@/utils/formate";
import {
    TRANSACTION_TYPE_ICONS,
    TRANSACTION_TYPE_LABELS,
} from "@/constants/config";
import type { ITransactionResponse, TransactionType } from "@/types/utils";
import {
    walletPageBalanceLabel,
    walletPageWithdrawableLabel,
    walletPageTransactionsTitle,
    walletPageEmptyTitle,
    walletPageEmptyDesc,
    walletFilterTitle,
    walletFilterTypeLabel,
    walletFilterFromLabel,
    walletFilterToLabel,
    walletFilterApplyButton,
    walletFilterResetButton,
    appbarDepositButton,
    withdrawModalTitle,
} from "@/constants/messages";

const TX_FILTER_TYPES = Object.keys(
    TRANSACTION_TYPE_LABELS,
) as TransactionType[];

function dayLabel(ms: number): string {
    const date = dayjs(ms);
    const today = dayjs();

    if (date.isSame(today, "day")) return "Today";
    if (date.isSame(today.subtract(1, "day"), "day")) return "Yesterday";
    return date.format("D MMM YYYY");
}

type DateFilter = { from?: number; to?: number };

function TransactionFilterDrawer({
    open,
    onClose,
    typeFilter,
    setTypeFilter,
    dateFilter,
    setDateFilter,
}: {
    open: boolean;
    onClose: () => void;
    typeFilter: TransactionType[];
    setTypeFilter: (types: TransactionType[]) => void;
    dateFilter: DateFilter;
    setDateFilter: (filter: DateFilter) => void;
}) {
    const [draftTypes, setDraftTypes] = useState(typeFilter);
    const [draftFrom, setDraftFrom] = useState("");
    const [draftTo, setDraftTo] = useState("");

    useEffect(() => {
        if (!open) return;
        setDraftTypes(typeFilter);
        setDraftFrom(
            dateFilter.from ? dayjs(dateFilter.from).format("YYYY-MM-DD") : "",
        );
        setDraftTo(
            dateFilter.to ? dayjs(dateFilter.to).format("YYYY-MM-DD") : "",
        );
    }, [open, typeFilter, dateFilter]);

    const toggleType = (type: TransactionType) =>
        setDraftTypes((prev) =>
            prev.includes(type)
                ? prev.filter((t) => t !== type)
                : [...prev, type],
        );

    const handleApply = () => {
        setTypeFilter(draftTypes);
        setDateFilter({
            from: draftFrom
                ? dayjs(draftFrom).startOf("day").valueOf()
                : undefined,
            to: draftTo
                ? dayjs(draftTo).endOf("day").valueOf()
                : draftFrom
                  ? dayjs(draftFrom).endOf("day").valueOf()
                  : undefined,
        });
        onClose();
    };

    const handleReset = () => {
        setTypeFilter([]);
        setDateFilter({});
        onClose();
    };

    return (
        <Drawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            customClass="tx-filter-sheet"
        >
            <Box customClass="tx-filter-sheet-content">
                <Text customClass="deposit-heading">{walletFilterTitle}</Text>

                <Box customClass="auth-field">
                    <Label>{walletFilterTypeLabel}</Label>
                    <Box customClass="tx-filter-chip-grid">
                        {TX_FILTER_TYPES.map((type) => {
                            const TypeIcon = TRANSACTION_TYPE_ICONS[type];
                            return (
                                <Button
                                    key={type}
                                    customClass={classNames(
                                        "tx-filter-chip",
                                        draftTypes.includes(type) && "active",
                                    )}
                                    onClick={() => toggleType(type)}
                                >
                                    <TypeIcon size={13} strokeWidth={2.25} />
                                    {TRANSACTION_TYPE_LABELS[type]}
                                </Button>
                            );
                        })}
                    </Box>
                </Box>

                <Box customClass="tx-filter-date-row">
                    <Box customClass="auth-field">
                        <Label htmlFor="tx-filter-from">
                            {walletFilterFromLabel}
                        </Label>
                        <Input
                            id="tx-filter-from"
                            type="date"
                            fullWidth
                            value={draftFrom}
                            onChange={(e) => setDraftFrom(e.target.value)}
                        />
                    </Box>
                    <Box customClass="auth-field">
                        <Label htmlFor="tx-filter-to">
                            {walletFilterToLabel}
                        </Label>
                        <Input
                            id="tx-filter-to"
                            type="date"
                            fullWidth
                            value={draftTo}
                            onChange={(e) => setDraftTo(e.target.value)}
                            inputProps={{ min: draftFrom || undefined }}
                        />
                    </Box>
                </Box>

                <Button
                    fullWidth
                    customClass="deposit-generate-btn"
                    onClick={handleApply}
                >
                    {walletFilterApplyButton}
                </Button>
                <Button
                    fullWidth
                    customClass="tx-filter-reset-btn"
                    onClick={handleReset}
                >
                    {walletFilterResetButton}
                </Button>
            </Box>
        </Drawer>
    );
}

const TX_SKELETON_ITEMS = 12;

function TxItemSkeleton() {
    return (
        <Box customClass="wallet-tx-item loading">
            <Box customClass="wallet-tx-row">
                <Box customClass="wallet-tx-info">
                    <Skeleton customClass="circle" width={32} height={32} />
                    <Box customClass="wallet-tx-text">
                        <Skeleton customClass="text" width={110} height={14} />
                        <Skeleton customClass="text" width={60} height={11} />
                    </Box>
                </Box>
                <Skeleton customClass="text" width={48} height={16} />
            </Box>
        </Box>
    );
}

function txRow(tx: ITransactionResponse) {
    const TxIcon = TRANSACTION_TYPE_ICONS[tx.type];
    return (
        <Box
            customClass={classNames(
                "wallet-tx-item",
                tx.amount_usd < 0 && "neg",
            )}
        >
            <Box customClass="wallet-tx-row">
                <Box customClass="wallet-tx-info">
                    <Box customClass="wallet-tx-icon">
                        <TxIcon size={16} strokeWidth={2} />
                    </Box>
                    <Box customClass="wallet-tx-text">
                        <Text customClass="wallet-tx-desc">
                            {tx.description}
                        </Text>
                        <Text customClass="wallet-tx-time">
                            {dayLabel(tx.created)} - {formateTime(tx.created)}
                        </Text>
                    </Box>
                </Box>
                <Text
                    component="span"
                    customClass={classNames(
                        "wallet-tx-amt",
                        tx.amount_usd >= 0 ? "pos" : "neg",
                    )}
                >
                    {tx.amount_usd >= 0 ? "+" : "-"}
                    {formateAmount(Math.abs(tx.amount_usd))}
                </Text>
            </Box>
        </Box>
    );
}

export default function Wallet() {
    const {
        usdValue,
        withdrawableUsd,
        balanceLoading,
        transactions,
        transactionsLoading,
        loadingMore,
        loadMoreTransactions,
        typeFilter,
        setTypeFilter,
        dateFilter,
        setDateFilter,
    } = useWallet();
    const { openDeposit, openWithdraw } = useWalletActionModal();
    const [filterOpen, setFilterOpen] = useState(false);
    const hasActiveFilter =
        typeFilter.length > 0 ||
        dateFilter.from !== undefined ||
        dateFilter.to !== undefined;

    return (
        <Box customClass="wallet-page">
            <Box customClass="wallet-split">
                <Box customClass="wallet-split-block accent">
                    <Text customClass="wallet-split-lbl">
                        {walletPageBalanceLabel}
                    </Text>
                    {balanceLoading ? (
                        <Skeleton customClass="text" width={80} height={24} />
                    ) : (
                        <Text customClass="wallet-split-val">
                            {formateAmount(usdValue)}
                        </Text>
                    )}
                </Box>
                <Box customClass="wallet-split-block">
                    <Text customClass="wallet-split-lbl">
                        {walletPageWithdrawableLabel}
                    </Text>
                    {balanceLoading ? (
                        <Skeleton customClass="text" width={80} height={24} />
                    ) : (
                        <Text customClass="wallet-split-val">
                            {formateAmount(withdrawableUsd)}
                        </Text>
                    )}
                </Box>
            </Box>

            <Box customClass="wallet-btn-row">
                {balanceLoading ? (
                    <>
                        <Skeleton
                            customClass="wallet-btn-skeleton"
                            variant="rectangular"
                            height="2.6rem"
                            style={{ flex: 1 }}
                        />
                        <Skeleton
                            customClass="wallet-btn-skeleton"
                            variant="rectangular"
                            height="2.6rem"
                            style={{ flex: 1 }}
                        />
                    </>
                ) : (
                    <>
                        <Button
                            type="button"
                            variant="outlined"
                            customClass="wallet-deposit-btn"
                            onClick={openDeposit}
                        >
                            {appbarDepositButton}
                        </Button>
                        <Button
                            type="button"
                            variant="outlined"
                            customClass="wallet-withdraw-btn"
                            onClick={openWithdraw}
                        >
                            {withdrawModalTitle}
                        </Button>
                    </>
                )}
            </Box>

            <Box customClass="wallet-tx-title-row">
                {transactionsLoading ? (
                    <Skeleton customClass="text" width={110} height={17} />
                ) : (
                    <Text component="h3" customClass="wallet-tx-title">
                        {walletPageTransactionsTitle}
                    </Text>
                )}
                <IconButton
                    customClass={classNames(
                        "wallet-tx-filter-trigger",
                        hasActiveFilter && "active",
                    )}
                    onClick={() => setFilterOpen(true)}
                    aria-label={walletFilterTitle}
                >
                    <Filter size={16} strokeWidth={2} />
                </IconButton>
            </Box>

            <TransactionFilterDrawer
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
            />

            {transactionsLoading ? (
                <Box customClass="wallet-timeline">
                    {Array.from({ length: TX_SKELETON_ITEMS }, (_, i) => (
                        <TxItemSkeleton key={i} />
                    ))}
                </Box>
            ) : transactions.length === 0 ? (
                <Box customClass="matches-empty">
                    <Text component="h3" customClass="matches-empty-title">
                        {walletPageEmptyTitle}
                    </Text>
                    <Text customClass="matches-empty-desc">
                        {walletPageEmptyDesc}
                    </Text>
                </Box>
            ) : (
                <Box customClass="wallet-timeline">
                    <Virtuoso
                        style={{ height: "100%" }}
                        data={transactions}
                        computeItemKey={(_, tx) => tx.id}
                        itemContent={(_, tx) => txRow(tx)}
                        endReached={loadMoreTransactions}
                        components={{
                            Footer: () =>
                                loadingMore ? <TxItemSkeleton /> : null,
                        }}
                    />
                </Box>
            )}
        </Box>
    );
}
