import { useCallback, useEffect } from "react";
import { callAPIInterface } from "@gopvp/common/src/util/api";
import { usePaginatedList } from "@gopvp/app/src/hooks/usePaginatedList";
import { endingBeforeQuery } from "@gopvp/app/src/utils";
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
import { TRANSACTIONS_PAGE_SIZE } from "@gopvp/app/src/constants/limit";
import { ENDPOINTS } from "@gopvp/common/src/constants/endpoint";
import { SOCKET_EVENTS } from "@gopvp/common/src/constants/event";

export const paymentRequest = (amountUsd: number) =>
 callAPIInterface<IPaymentRequestResponse, IInitiateDepositBody>(
  "POST",
  ENDPOINTS.PAYMENT_REQUEST,
  { amount: amountUsd },
 );

export const withdrawRequest = (amountUsd: number, destination: string) =>
 callAPIInterface<IWithdrawResponse, IWithdrawRequestBody>(
  "POST",
  ENDPOINTS.WITHDRAW,
  {
   amount: amountUsd,
   destination,
  },
 );

export function useWalletBalance() {
 const dispatch = useReduxDispatch();
 const { balanceUsd, withdrawableUsd, loading } = useReduxSelector(
  (state) => state.wallet,
 );

 const refetch = useCallback(() => {
  dispatch(fetchWalletBalance());
 }, [dispatch]);

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
 } = useWalletBalance();

 const fetchPage = useCallback(
  (cursor: string | null) =>
   callAPIInterface<IListResponse<ITransactionResponse> | null, undefined>(
    "GET",
    `${ENDPOINTS.TRANSACTIONS}?limit=${TRANSACTIONS_PAGE_SIZE}${endingBeforeQuery(cursor)}`,
   ),
  [],
 );

 const {
  items: transactions,
  loading: transactionsLoading,
  loadingMore,
  loadMore: loadMoreTransactions,
  refresh,
 } = usePaginatedList(fetchPage);

 useEffect(() => {
  if (!socket) return;
  socket.on(SOCKET_EVENTS.WALLET_UPDATED, refresh);
  return () => {
   socket.off(SOCKET_EVENTS.WALLET_UPDATED, refresh);
  };
 }, [socket, refresh]);

 return {
  usdValue,
  withdrawableUsd,
  balanceLoading,
  transactions,
  transactionsLoading,
  loadingMore,
  loadMoreTransactions,
 };
}
