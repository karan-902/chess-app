import { useCallback, useEffect, useRef, useState } from "react";
import {
 callAPIInterface,
 showApiErrorToast,
} from "@gopvp/common/src/util/api";
import { useSocket } from "@gopvp/app/src/context/SocketContext";
import { useReduxDispatch, useReduxSelector } from "@gopvp/app/src/redux/hooks";
import { fetchWalletBalance } from "@gopvp/app/src/redux/wallet/thunk";
import type {
 IInitiateDepositBody,
 IWithdrawRequestBody,
} from "@gopvp/common/src/types/payload";
import type {
 IListResponse,
 IPaymentRequestResponse,
 ITransactionResponse,
 IWithdrawResponse,
} from "@gopvp/common/src/types/response";

const PAGE_SIZE = 20;

export const paymentRequest = (amountUsd: number) =>
 callAPIInterface<IPaymentRequestResponse, IInitiateDepositBody>(
  "POST",
  "/wallet/payment-request",
  { amount: amountUsd },
 );

export const withdrawRequest = (amountUsd: number, destination: string) =>
 callAPIInterface<IWithdrawResponse, IWithdrawRequestBody>(
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

 const refetch = useCallback(() => {
  dispatch(fetchWalletBalance());
 }, [dispatch]);

 useEffect(() => {
  refetch();
 }, [refetch]);

 useEffect(() => {
  if (!socket) return;
  socket.on("wallet:updated", refetch);
  return () => {
   socket.off("wallet:updated", refetch);
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

 const hasMoreRef = useRef(true);
 const pageIdRef = useRef<string | null>(null);
 const isFetchingRef = useRef(false);
 const latestRequestIdRef = useRef(0);

 const loadTransactions = useCallback(
  async (isFirstLoad: boolean) => {
   if (!isFirstLoad && (isFetchingRef.current || !hasMoreRef.current)) return;

   const requestId = ++latestRequestIdRef.current;
   isFetchingRef.current = true;
   isFirstLoad ? setTransactionsLoading(true) : setLoadingMore(true);

   const cursor =
    !isFirstLoad && pageIdRef.current
     ? `&ending_before=${encodeURIComponent(pageIdRef.current)}`
     : "";

   try {
    const res = await callAPIInterface<IListResponse<ITransactionResponse> | null, undefined>(
     "GET",
     `/wallet/transactions?limit=${PAGE_SIZE}${cursor}`,
    );
    if (latestRequestIdRef.current !== requestId) return;
    const data = res?.data ?? [];
    setTransactions((prev) => (isFirstLoad ? data : [...prev, ...data]));
    hasMoreRef.current = res?.has_more ?? false;
    pageIdRef.current = res?.page_id ?? null;
   } catch (err) {
    showApiErrorToast(err);
   } finally {
    isFetchingRef.current = false;
    if (latestRequestIdRef.current === requestId) {
     isFirstLoad ? setTransactionsLoading(false) : setLoadingMore(false);
    }
   }
  },
  [],
 );

 useEffect(() => {
  loadTransactions(true);
 }, [loadTransactions]);

 useEffect(() => {
  if (!socket) return;
  const refreshTransactions = () => loadTransactions(true);
  socket.on("wallet:updated", refreshTransactions);
  return () => {
   socket.off("wallet:updated", refreshTransactions);
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
  refetchBalance: loadBalance,
 };
}
