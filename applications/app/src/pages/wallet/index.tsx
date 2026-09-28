import { useMemo } from "react";
import dayjs from "dayjs";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
import VirtualList from "@gopvp/common/src/components/VirtualList/VirtualList";
import EmptyState from "@gopvp/app/src/components/common/EmptyState";
import TxItemSkeleton from "@gopvp/app/src/components/common/TxItemSkeleton";
import { useWallet } from "@gopvp/app/src/hooks/useWallet";
import { useWalletModal } from "@gopvp/app/src/context/WalletModalContext";
import { speedLogo } from "@gopvp/common/src/components/images";
import { formatAmount, formatTime } from "@gopvp/common/src/util/format";
import { TRANSACTION_TYPE_ICONS } from "@gopvp/app/src/constants/icon";
import { TRANSACTION_TYPE_DESCRIPTIONS } from "@gopvp/app/src/constants/label";
import { DEBIT_TRANSACTION_TYPES } from "@gopvp/app/src/constants/mapper";
import type { ITransactionResponse } from "@gopvp/common/src/types/response";
import {
 totalBalanceText,
 withdrawBalanceText,
 transactionsText,
 noTransactionsYetText,
 transactionsEmptyText,
 depositText,
 withdrawText,
 poweredByText,
 todayText,
 yesterdayText,
 speedText,
} from "@gopvp/app/src/constants/message";
import { TRANSACTIONS_SKELETON_ROWS } from "@gopvp/app/src/constants/limit";
import { renderSkeletons } from "@gopvp/app/src/utils/skeleton";

function dayLabel(ms: number): string {
 const date = dayjs(ms);
 const today = dayjs();

 if (date.isSame(today, "day")) return todayText;
 if (date.isSame(today.subtract(1, "day"), "day")) return yesterdayText;
 return date.format("D MMM YYYY").toUpperCase();
}

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

function txRow(tx: ITransactionResponse, groupEdgeClass: string) {
 const TxIcon = TRANSACTION_TYPE_ICONS[tx.transaction_type];
 const isDebit = DEBIT_TRANSACTION_TYPES.has(tx.transaction_type);
 return (
  <Box
   customClass={classNames("wallet-tx-item", isDebit && "neg", groupEdgeClass)}
  >
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

function timelineRow(entry: TWalletTimelineEntry, groupEdgeClass: string) {
 if (entry.kind === "header") {
  return (
   <Text component="h4" customClass="wallet-tx-group-label">
    {entry.label}
   </Text>
  );
 }
 return txRow(entry.tx, groupEdgeClass);
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
 } = useWallet();
 const { openDeposit, openWithdraw } = useWalletModal();
 const timelineEntries = useMemo(
  () => buildTimelineEntries(transactions),
  [transactions],
 );

 return (
  <Box customClass="wallet-page">
   <Box customClass="wallet-split">
    <Box customClass="wallet-split-block accent">
     <Text customClass="wallet-split-lbl">{totalBalanceText}</Text>
     <Text customClass="wallet-split-val">
      {balanceLoading ? (
       <Skeleton customClass="text" width={80} />
      ) : (
       formatAmount(usdValue)
      )}
     </Text>
    </Box>
    <Box customClass="wallet-split-block">
     <Text customClass="wallet-split-lbl">{withdrawBalanceText}</Text>
     <Text customClass="wallet-split-val">
      {balanceLoading ? (
       <Skeleton customClass="text" width={80} />
      ) : (
       formatAmount(withdrawableUsd)
      )}
     </Text>
    </Box>
   </Box>

   <Box customClass="wallet-btn-row">
    {balanceLoading ? (
     <>
      <Skeleton
       customClass="wallet-btn-skeleton"
       variant="rectangular"
       height="2.6rem"
      />
      <Skeleton
       customClass="wallet-btn-skeleton"
       variant="rectangular"
       height="2.6rem"
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
       {depositText}
      </Button>
      <Button
       type="button"
       variant="outlined"
       customClass="wallet-withdraw-btn"
       onClick={openWithdraw}
      >
       {withdrawText}
      </Button>
     </>
    )}
   </Box>

   <Box customClass="powered-by-badge">
    <Text component="span">{poweredByText}</Text>
    <img src={speedLogo} alt={speedText} className="powered-by-logo" />
   </Box>

   <Box customClass="wallet-tx-title-row">
    <Text component="h3" customClass="wallet-tx-title">
     {transactionsText}
    </Text>
   </Box>

   {transactionsLoading ? (
    <Box customClass="wallet-timeline">
     {renderSkeletons(TRANSACTIONS_SKELETON_ROWS, TxItemSkeleton)}
    </Box>
   ) : transactions.length === 0 ? (
    <EmptyState
     title={noTransactionsYetText}
     description={transactionsEmptyText}
    />
   ) : (
    <Box customClass="wallet-timeline">
     <VirtualList<TWalletTimelineEntry>
      data={timelineEntries}
      computeItemKey={(_, entry) => entry.id}
      itemContent={(index, entry) =>
       timelineRow(
        entry,
        classNames(
         timelineEntries[index - 1]?.kind !== "tx" && "group-start",
         timelineEntries[index + 1]?.kind !== "tx" && "group-end",
        ),
       )
      }
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
