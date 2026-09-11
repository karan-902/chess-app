import { useCallback, useEffect, useRef, useState } from "react";
import { callAPIInterface } from "@/utils";
import { useSocket } from "@/context/SocketContext";
import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import { setWalletBalance, setWalletLoading } from "@/redux/wallet.slice";
import type {
 IWalletBalanceResponse,
 ITransactionResponse,
 ITransactionsResponse,
 ITransactionsFilterBody,
 IWithdrawBody,
 IWithdrawResponse,
 IInitiateDepositBody,
 IInitiateDepositResponse,
 TransactionType,
} from "@/types/utils";

const PAGE_SIZE = 20;

export const paymentRequest = (amountUsd: number) =>
 callAPIInterface<IInitiateDepositBody, IInitiateDepositResponse>(
  "POST",
  "/wallet/payment-request",
  { amount: amountUsd },
 );

export const withdrawRequest = (amountUsd: number, destination: string) =>
 callAPIInterface<IWithdrawBody, IWithdrawResponse>(
  "POST",
  "/wallet/withdraw",
  {
   amount: amountUsd,
   destination,
  },
 );

export function useWalletBalance() {
 const { socket } = useSocket();
 const dispatch = useReduxDispatch();
 const { balanceUsd, withdrawableUsd, loading } = useReduxSelector(
  (state) => state.wallet,
 );

 const refetch = useCallback(async () => {
  try {
   const res = await callAPIInterface<undefined, IWalletBalanceResponse | null>(
    "GET",
    "/wallet/balance",
   );
   if (res) dispatch(setWalletBalance(res));
   else dispatch(setWalletLoading(false));
  } catch {
   dispatch(setWalletLoading(false));
  }
 }, [dispatch]);

 useEffect(() => {
  refetch();
 }, [refetch]);

 useEffect(() => {
  if (!socket) return;
  socket.on("wallet_updated", refetch);
  return () => {
   socket.off("wallet_updated", refetch);
  };
 }, [socket, refetch]);

 return {
  usdValue: balanceUsd,
  withdrawableUsd,
  loading,
  refetch,
 };
}

export function useWallet() {
 const { socket } = useSocket();
 const {
  usdValue,
  withdrawableUsd,
  loading: balanceLoading,
  refetch: loadBalance,
 } = useWalletBalance();

 const [transactions, setTransactions] = useState<ITransactionResponse[]>([]);
 const [transactionsLoading, setTransactionsLoading] = useState(true);
 const [loadingMore, setLoadingMore] = useState(false);
 const [typeFilter, setTypeFilter] = useState<TransactionType[]>([]);
 const [dateFilter, setDateFilter] = useState<{
  from?: number;
  to?: number;
 }>({});

 const hasMoreRef = useRef(true);
 const pageIdRef = useRef<string | null>(null);
 const isFetchingRef = useRef(false);
 const activeFilterRef = useRef<ITransactionsFilterBody | null>(null);

 const loadTransactions = useCallback(
  async (isFirstLoad: boolean) => {
   if (!isFirstLoad && (isFetchingRef.current || !hasMoreRef.current)) return;

   const requestFilter: ITransactionsFilterBody = {
    types: typeFilter,
    from: dateFilter.from,
    to: dateFilter.to,
   };
   activeFilterRef.current = requestFilter;
   isFetchingRef.current = true;
   isFirstLoad ? setTransactionsLoading(true) : setLoadingMore(true);

   const cursor =
    !isFirstLoad && pageIdRef.current
     ? `&ending_before=${encodeURIComponent(pageIdRef.current)}`
     : "";

   try {
    const res = await callAPIInterface<undefined, ITransactionsResponse | null>(
     "GET",
     `/wallet/transactions?limit=${PAGE_SIZE}${cursor}`,
    );
    if (activeFilterRef.current !== requestFilter) return;
    const data = res?.data ?? [];
    setTransactions((prev) => (isFirstLoad ? data : [...prev, ...data]));
    hasMoreRef.current = res?.has_more ?? false;
    pageIdRef.current = res?.page_id ?? null;
   } catch {
   } finally {
    isFetchingRef.current = false;
    if (activeFilterRef.current === requestFilter) {
     isFirstLoad ? setTransactionsLoading(false) : setLoadingMore(false);
    }
   }
  },
  [typeFilter, dateFilter],
 );

 useEffect(() => {
  loadTransactions(true);
 }, [loadTransactions]);

 useEffect(() => {
  if (!socket) return;
  const refreshTransactions = () => loadTransactions(true);
  socket.on("wallet_updated", refreshTransactions);
  return () => {
   socket.off("wallet_updated", refreshTransactions);
  };
 }, [socket, loadTransactions]);

 const loadMoreTransactions = useCallback(
  () => loadTransactions(false),
  [loadTransactions],
 );

 return {
  usdValue,
  withdrawableUsd,
  balanceLoading,
  transactions,
  transactionsLoading,
  loadingMore,
  hasMore: hasMoreRef.current,
  loadMoreTransactions,
  typeFilter,
  setTypeFilter,
  dateFilter,
  setDateFilter,
  refetchBalance: loadBalance,
 };
}
