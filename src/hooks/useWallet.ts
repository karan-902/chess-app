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
    WithdrawMethod,
    TransactionType,
} from "@/types/utils";

const PAGE_SIZE = 20;

export const initiateDeposit = (amountUsd: number) =>
    callAPIInterface<IInitiateDepositBody, IInitiateDepositResponse>(
        "POST",
        "/deposit",
        { amount_usd: amountUsd },
    );

export const getPendingDeposit = () =>
    callAPIInterface<
        undefined,
        IInitiateDepositResponse | { status: "none" }
    >("GET", "/deposit/pending");

export const requestWithdraw = (
    amountUsd: number,
    withdrawMethod: WithdrawMethod,
    destination: string,
) =>
    callAPIInterface<IWithdrawBody, IWithdrawResponse>(
        "POST",
        "/wallet/withdraw",
        { amount_usd: amountUsd, withdraw_method: withdrawMethod, destination },
    );

export function useWalletBalance() {
    const { socket } = useSocket();
    const dispatch = useReduxDispatch();
    const { balanceUsd, pendingWithdrawalUsd, winUsd, withdrawableUsd, loading } =
        useReduxSelector((state) => state.wallet);

    const refetch = useCallback(async () => {
        try {
            const res = await callAPIInterface<
                undefined,
                IWalletBalanceResponse
            >("GET", "/wallet");
            dispatch(setWalletBalance(res));
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
        usdValue: balanceUsd + pendingWithdrawalUsd,
        withdrawableUsd,
        winUsd,
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

    const [transactions, setTransactions] = useState<ITransactionResponse[]>(
        [],
    );
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
            if (!isFirstLoad && (isFetchingRef.current || !hasMoreRef.current))
                return;

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
                const res = await callAPIInterface<
                    ITransactionsFilterBody,
                    ITransactionsResponse
                >(
                    "POST",
                    `/wallet/transactions/filter?limit=${PAGE_SIZE}${cursor}`,
                    requestFilter,
                );
                if (activeFilterRef.current !== requestFilter) return;
                setTransactions((prev) =>
                    isFirstLoad ? res.data : [...prev, ...res.data],
                );
                hasMoreRef.current = res.has_more;
                pageIdRef.current = res.page_id;
            } catch {
            } finally {
                isFetchingRef.current = false;
                if (activeFilterRef.current === requestFilter) {
                    isFirstLoad
                        ? setTransactionsLoading(false)
                        : setLoadingMore(false);
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
