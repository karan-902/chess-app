import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
 IBalanceResponse,
 IWalletDocResponse,
 IWalletLastTransaction,
} from "@gopvp/common/src/types/response";

interface IWalletState {
 balanceUsd: number;
 withdrawableUsd: number;
 lastTransaction: IWalletLastTransaction | null;
 loading: boolean;
}

const initialState: IWalletState = {
 balanceUsd: 0,
 withdrawableUsd: 0,
 lastTransaction: null,
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
  setWalletDoc: (state, action: PayloadAction<IWalletDocResponse>) => {
   state.balanceUsd = action.payload.total_balance;
   state.withdrawableUsd = action.payload.withdraw_balance;
   state.lastTransaction = action.payload.last_transaction;
   state.loading = false;
  },
  setWalletLoading: (state, action: PayloadAction<boolean>) => {
   state.loading = action.payload;
  },
 },
});

export const { setWalletBalance, setWalletDoc, setWalletLoading } =
 walletSlice.actions;
export default walletSlice.reducer;
