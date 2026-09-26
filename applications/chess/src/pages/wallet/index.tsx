import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import classNames from "classnames";
import { Filter } from "lucide-react";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import CustomIconButton from "@/components/base/IconButton/IconButton";
import CustomLabel from "@/components/base/Label/Label";
import Input from "@/components/base/Input/Input";
import Skeleton from "@/components/base/Skeleton/Skeleton";
import VirtualList from "@/components/common/VirtualList";
import EmptyState from "@/components/common/EmptyState";
import TxItemSkeleton from "@/components/common/TxItemSkeleton";
import { useWallet } from "@/hooks/useWallet";
import { useWalletActionModal } from "@/context/WalletActionModalContext";
import { speedLogo } from "@/components/images";
import { formatAmount, formatTime } from "@/utils/format";
import {
 TRANSACTION_TYPE_ICONS,
 TRANSACTION_TYPE_DESCRIPTIONS,
 DEBIT_TRANSACTION_TYPES,
} from "@/constants/config";
import type { ITransactionResponse } from "@/types/utils";
import type { ITransactionFilterDrawerProps } from "@/types/components";
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
 appBarDepositButton,
 withdrawModalTitle,
 walletPoweredByLabel,
} from "@/constants/messages";
import CustomModal from "@/components/base/Modal/Modal";

function dayLabel(ms: number): string {
 const date = dayjs(ms);
 const today = dayjs();

 if (date.isSame(today, "day")) return "Today";
 if (date.isSame(today.subtract(1, "day"), "day")) return "Yesterday";
 return date.format("D MMM YYYY").toUpperCase();
}

function TransactionFilterDrawer({
 open,
 onClose,
 typeFilter,
 setTypeFilter,
 dateFilter,
 setDateFilter,
}: ITransactionFilterDrawerProps) {
 const [draftTypes, setDraftTypes] = useState(typeFilter);
 const [draftFrom, setDraftFrom] = useState("");
 const [draftTo, setDraftTo] = useState("");

 useEffect(() => {
  if (!open) return;
  setDraftTypes(typeFilter);
  setDraftFrom(
   dateFilter.from ? dayjs(dateFilter.from).format("YYYY-MM-DD") : "",
  );
  setDraftTo(dateFilter.to ? dayjs(dateFilter.to).format("YYYY-MM-DD") : "");
 }, [open, typeFilter, dateFilter]);

 const handleApply = () => {
  setTypeFilter(draftTypes);
  setDateFilter({
   from: draftFrom ? dayjs(draftFrom).startOf("day").valueOf() : undefined,
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
  <CustomModal open={open} onClose={onClose} customClass="tx-filter-sheet">
   <Box customClass="tx-filter-sheet-content">
    <Text customClass="modal-heading value-heading">{walletFilterTitle}</Text>

    <Box customClass="form-field">
     <CustomLabel>{walletFilterTypeLabel}</CustomLabel>
    </Box>

    <Box customClass="tx-filter-date-row">
     <Input
      id="tx-filter-from"
      type="date"
      label={walletFilterFromLabel}
      fullWidth
      value={draftFrom}
      onChange={(e) => setDraftFrom(e.target.value)}
     />
     <Input
      id="tx-filter-to"
      type="date"
      label={walletFilterToLabel}
      fullWidth
      value={draftTo}
      onChange={(e) => setDraftTo(e.target.value)}
      slotProps={{ input: { min: draftFrom || undefined } }}
     />
    </Box>

    <Button fullWidth customClass="modal-submit-btn" onClick={handleApply}>
     {walletFilterApplyButton}
    </Button>
    <Button fullWidth customClass="tx-filter-reset-btn" onClick={handleReset}>
     {walletFilterResetButton}
    </Button>
   </Box>
  </CustomModal>
 );
}

const TX_SKELETON_ITEMS = 12;

type TWalletTimelineEntry =
 | { kind: "header"; id: string; label: string }
 | { kind: "tx"; id: string; tx: ITransactionResponse };

function buildTimelineEntries(
 transactions: ITransactionResponse[],
): TWalletTimelineEntry[] {
 const entries: TWalletTimelineEntry[] = [];
 let lastLabel: string | undefined;
 for (const tx of transactions) {
  const label = dayLabel(tx.created);
  if (label !== lastLabel) {
   entries.push({ kind: "header", id: `header-${label}`, label });
   lastLabel = label;
  }
  entries.push({ kind: "tx", id: tx.id, tx });
 }
 return entries;
}

function txRow(tx: ITransactionResponse) {
 const TxIcon = TRANSACTION_TYPE_ICONS[tx.transaction_type];
 const isDebit = DEBIT_TRANSACTION_TYPES.has(tx.transaction_type);
 return (
  <Box customClass={classNames("wallet-tx-item", isDebit && "neg")}>
   <Box customClass="wallet-tx-row">
    <Box customClass="wallet-tx-info">
     <Box customClass="wallet-tx-icon">
      <TxIcon sx={{ fontSize: 24 }} />
     </Box>
     <Box customClass="wallet-tx-text">
      <Text customClass="row-title">
       {TRANSACTION_TYPE_DESCRIPTIONS[tx.transaction_type]}
      </Text>
      <Text customClass="meta-text">{formatTime(tx.created)}</Text>
     </Box>
    </Box>
    <Text
     component="span"
     customClass={classNames("amount-value", isDebit ? "neg" : "pos")}
    >
     {isDebit ? "-" : "+"}
     {formatAmount(Math.abs(tx.amount))}
    </Text>
   </Box>
  </Box>
 );
}

function timelineRow(entry: TWalletTimelineEntry) {
 if (entry.kind === "header") {
  return (
   <Text component="h4" customClass="wallet-tx-group-label">
    {entry.label}
   </Text>
  );
 }
 return txRow(entry.tx);
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
 const timelineEntries = useMemo(
  () => buildTimelineEntries(transactions),
  [transactions],
 );
 const hasActiveFilter =
  typeFilter.length > 0 ||
  dateFilter.from !== undefined ||
  dateFilter.to !== undefined;

 return (
  <Box customClass="wallet-page">
   <Box customClass="wallet-split">
    <Box customClass="wallet-split-block accent">
     <Text customClass="wallet-split-lbl">{walletPageBalanceLabel}</Text>
     {balanceLoading ? (
      <Skeleton customClass="text" width={80} height={24} />
     ) : (
      <Text customClass="wallet-split-val">{formatAmount(usdValue)}</Text>
     )}
    </Box>
    <Box customClass="wallet-split-block">
     <Text customClass="wallet-split-lbl">{walletPageWithdrawableLabel}</Text>
     {balanceLoading ? (
      <Skeleton customClass="text" width={80} height={24} />
     ) : (
      <Text customClass="wallet-split-val">
       {formatAmount(withdrawableUsd)}
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
       {appBarDepositButton}
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

   <Box customClass="powered-by-badge">
    <Text component="span">{walletPoweredByLabel}</Text>
    <img src={speedLogo} alt="Speed" className="powered-by-logo" />
   </Box>

   <Box customClass="wallet-tx-title-row">
    <Text component="h3" customClass="wallet-tx-title">
     {walletPageTransactionsTitle}
    </Text>
    <CustomIconButton
     customClass={classNames(
      "wallet-tx-filter-trigger",
      hasActiveFilter && "active",
     )}
     onClick={() => setFilterOpen(true)}
     aria-label={walletFilterTitle}
    >
     <Filter size={16} strokeWidth={2} />
    </CustomIconButton>
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
    <EmptyState
     title={walletPageEmptyTitle}
     description={walletPageEmptyDesc}
    />
   ) : (
    <Box customClass="wallet-timeline">
     <VirtualList<TWalletTimelineEntry>
      data={timelineEntries}
      computeItemKey={(_, entry) => entry.id}
      itemContent={(_, entry) => timelineRow(entry)}
      endReached={loadMoreTransactions}
      components={{
       Footer: () => (loadingMore ? <TxItemSkeleton /> : null),
      }}
     />
    </Box>
   )}
  </Box>
 );
}
