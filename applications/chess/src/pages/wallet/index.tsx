import { useEffect, useState } from "react";
import dayjs from "dayjs";
import classNames from "classnames";
import { Filter } from "lucide-react";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import IconButton from "@/components/base/IconButton/IconButton";
import Label from "@/components/base/Label/Label";
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
 TRANSACTION_TYPE_LABELS,
} from "@/constants/config";
import type { ITransactionResponse, TransactionType } from "@/types/utils";
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
 appbarDepositButton,
 withdrawModalTitle,
 walletPoweredByLabel,
} from "@/constants/messages";
import Modal from "@/components/base/Modal/Modal";

const TX_FILTER_TYPES = Object.keys(
 TRANSACTION_TYPE_LABELS,
) as TransactionType[];

function dayLabel(ms: number): string {
 const date = dayjs(ms);
 const today = dayjs();

 if (date.isSame(today, "day")) return "Today";
 if (date.isSame(today.subtract(1, "day"), "day")) return "Yesterday";
 return date.format("DD/MM/YYYY");
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

 const toggleType = (type: TransactionType) =>
  setDraftTypes((prev) =>
   prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
  );

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
  <Modal open={open} onClose={onClose} customClass="tx-filter-sheet">
   <Box customClass="tx-filter-sheet-content">
    <Text customClass="deposit-heading value-heading">{walletFilterTitle}</Text>

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
      <Label htmlFor="tx-filter-from">{walletFilterFromLabel}</Label>
      <Input
       id="tx-filter-from"
       type="date"
       fullWidth
       value={draftFrom}
       onChange={(e) => setDraftFrom(e.target.value)}
      />
     </Box>
     <Box customClass="auth-field">
      <Label htmlFor="tx-filter-to">{walletFilterToLabel}</Label>
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

    <Button fullWidth customClass="deposit-generate-btn" onClick={handleApply}>
     {walletFilterApplyButton}
    </Button>
    <Button fullWidth customClass="tx-filter-reset-btn" onClick={handleReset}>
     {walletFilterResetButton}
    </Button>
   </Box>
  </Modal>
 );
}

const TX_SKELETON_ITEMS = 12;

function txRow(tx: ITransactionResponse) {
 const TxIcon = TRANSACTION_TYPE_ICONS[tx.transaction_type];
 return (
  <Box customClass={classNames("wallet-tx-item", tx.amount < 0 && "neg")}>
   <Box customClass="wallet-tx-row">
    <Box customClass="wallet-tx-info">
     <Box customClass="wallet-tx-icon">
      <TxIcon size={16} strokeWidth={2} />
     </Box>
     <Box customClass="wallet-tx-text">
      <Text customClass="meta-text">
       {dayLabel(tx.created)} - {formatTime(tx.created)}
      </Text>
     </Box>
    </Box>
    <Text
     component="span"
     customClass={classNames("amount-value", tx.amount >= 0 ? "pos" : "neg")}
    >
     {tx.amount >= 0 ? "+" : "-"}
     {formatAmount(Math.abs(tx.amount))}
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

   <Box customClass="powered-by-badge">
    <Text component="span">{walletPoweredByLabel}</Text>
    <img src={speedLogo} alt="Speed" className="powered-by-logo" />
   </Box>

   <Box customClass="wallet-tx-title-row">
    <Text component="h3" customClass="wallet-tx-title">
     {walletPageTransactionsTitle}
    </Text>
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
    <EmptyState
     title={walletPageEmptyTitle}
     description={walletPageEmptyDesc}
    />
   ) : (
    <Box customClass="wallet-timeline">
     <VirtualList<ITransactionResponse>
      data={transactions}
      computeItemKey={(_, tx) => tx.id}
      itemContent={(_, tx) => txRow(tx)}
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
