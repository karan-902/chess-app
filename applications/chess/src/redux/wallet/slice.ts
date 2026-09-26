import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IBalanceResponse } from "@gopvp/common/src/types/response";

interface IWalletState {
 balanceUsd: number;
 withdrawableUsd: number;
 loading: boolean;
}

const initialState: IWalletState = {
 balanceUsd: 0,
 withdrawableUsd: 0,
 loading: true,
};

const walletSlice = createSlice({
 name: "wallet",
 initialState,
 reducers: {
  setWalletBalance: (state, action: PayloadAction<IBalanceResponse>) => {
   state.balanceUsd = action.payload.total_balance;
   state.withdrawableUsd = action.payload.withdraw_balance;
   state.loading = false;
  },
  setWalletLoading: (state, action: PayloadAction<boolean>) => {
   state.loading = action.payload;
  },
 },
});

export const { setWalletBalance, setWalletLoading } = walletSlice.actions;
export default walletSlice.reducer;
