import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IWalletBalanceResponse } from "@/types/utils";

interface IWalletState {
    balanceUsd: number;
    winUsd: number;
    withdrawableUsd: number;
    pendingWithdrawalUsd: number;
    loading: boolean;
}

const initialState: IWalletState = {
    balanceUsd: 0,
    winUsd: 0,
    withdrawableUsd: 0,
    pendingWithdrawalUsd: 0,
    loading: true,
};

const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        setWalletBalance: (
            state,
            action: PayloadAction<IWalletBalanceResponse>,
        ) => {
            state.balanceUsd = action.payload.balance_usd;
            state.winUsd = action.payload.win_usd;
            state.withdrawableUsd = action.payload.withdrawable_usd;
            state.pendingWithdrawalUsd = action.payload.pending_withdrawal_usd;
            state.loading = false;
        },
        setWalletLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const walletReducer = walletSlice.reducer;
export const { setWalletBalance, setWalletLoading } = walletSlice.actions;
