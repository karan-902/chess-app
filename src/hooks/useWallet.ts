import { useCallback, useEffect, useRef, useState } from "react";
import { callAPIInterface } from "@/utils";
import { useSocket } from "@/context/SocketContext";
import type {
    IWalletBalanceResponse,
    IWalletStatsResponse,
    ITransactionResponse,
    ITransactionsResponse,
    IWithdrawBody,
    IWithdrawResponse,
    IInitiateDepositBody,
    IInitiateDepositResponse,
    WithdrawMethod,
} from "@/types/utils";

const PAGE_SIZE = 20;

export const initiateDeposit = (amountUsd: number) =>
    callAPIInterface<IInitiateDepositBody, IInitiateDepositResponse>(
        "POST",
        "/deposit",
        { amount_usd: amountUsd },
    );

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
    const [usdValue, setUsdValue] = useState(0);
    const [withdrawableUsd, setWithdrawableUsd] = useState(0);
    const [loading, setLoading] = useState(true);

    const refetch = useCallback(async () => {
        try {
            const res = await callAPIInterface<
                undefined,
                IWalletBalanceResponse
            >("GET", "/wallet");
            setUsdValue(res.balance_usd + res.pending_withdrawal_usd);
            setWithdrawableUsd(res.withdrawable_usd);
        } catch {
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (!socket) return;
        socket.on("wallet_credited", refetch);
        socket.on("wallet_updated", refetch);
        return () => {
            socket.off("wallet_credited", refetch);
            socket.off("wallet_updated", refetch);
        };
    }, [socket, refetch]);

    return { usdValue, withdrawableUsd, loading, refetch };
}

export function useWallet() {
    const { socket } = useSocket();
    const {
        usdValue,
        withdrawableUsd,
        loading: balanceLoading,
        refetch: loadBalance,
    } = useWalletBalance();

    const [stats, setStats] = useState({
        deposited: 0,
        withdrawn: 0,
        netPayouts: 0,
    });
    const [statsLoading, setStatsLoading] = useState(true);

    const loadStats = useCallback(async () => {
        try {
            const res = await callAPIInterface<undefined, IWalletStatsResponse>(
                "GET",
                "/wallet/stats",
            );
            setStats({
                deposited: res.deposited_usd,
                withdrawn: res.withdrawn_usd,
                netPayouts: res.net_payouts_usd,
            });
        } catch {
        } finally {
            setStatsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    useEffect(() => {
        if (!socket) return;
        socket.on("wallet_updated", loadStats);
        return () => {
            socket.off("wallet_updated", loadStats);
        };
    }, [socket, loadStats]);

    const [transactions, setTransactions] = useState<ITransactionResponse[]>(
        [],
    );
    const [transactionsLoading, setTransactionsLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const hasMoreRef = useRef(true);
    const pageIdRef = useRef<string | null>(null);
    const isFetchingRef = useRef(false);

    const loadTransactions = useCallback(async (isFirstLoad: boolean) => {
        if (isFetchingRef.current) return;
        if (!isFirstLoad && !hasMoreRef.current) return;

        isFetchingRef.current = true;
        isFirstLoad ? setTransactionsLoading(true) : setLoadingMore(true);

        const cursor =
            !isFirstLoad && pageIdRef.current
                ? `&ending_before=${encodeURIComponent(pageIdRef.current)}`
                : "";

        try {
            const res = await callAPIInterface<
                undefined,
                ITransactionsResponse
            >("GET", `/wallet/transactions?limit=${PAGE_SIZE}${cursor}`);
            setTransactions((prev) =>
                isFirstLoad ? res.data : [...prev, ...res.data],
            );
            hasMoreRef.current = res.has_more;
            pageIdRef.current = res.page_id;
        } catch {
            // leave existing list as-is on failure
        } finally {
            isFetchingRef.current = false;
            isFirstLoad ? setTransactionsLoading(false) : setLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        loadTransactions(true);
    }, []);

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
        stats,
        statsLoading,
        transactions,
        transactionsLoading,
        loadingMore,
        hasMore: hasMoreRef.current,
        loadMoreTransactions,
        refetchBalance: loadBalance,
    };
}
