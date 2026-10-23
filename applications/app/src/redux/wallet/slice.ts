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
 version: number;
}

const initialState: IWalletState = {
 balanceUsd: 0,
 withdrawableUsd: 0,
 lastTransaction: null,
 loading: true,
 version: 0,
};

const isOlder = (state: IWalletState, balance: IBalanceResponse) =>
 (balance.version ?? 0) < state.version;

const applyBalance = (state: IWalletState, balance: IBalanceResponse) => {
 state.balanceUsd = balance.total_balance;
 state.withdrawableUsd = balance.withdraw_balance;
 state.version = balance.version ?? 0;
};

const walletSlice = createSlice({
 name: "wallet",
 initialState,
 reducers: {
  setWalletBalance: (state, action: PayloadAction<IBalanceResponse>) => {
   state.loading = false;
   if (isOlder(state, action.payload)) return;
   applyBalance(state, action.payload);
  },
  setWalletDoc: (state, action: PayloadAction<IWalletDocResponse>) => {
   state.loading = false;
   if (isOlder(state, action.payload)) return;
   applyBalance(state, action.payload);
   state.lastTransaction = action.payload.last_transaction;
  },
  setWalletLoading: (state, action: PayloadAction<boolean>) => {
   state.loading = action.payload;
  },
 },
});

export const { setWalletBalance, setWalletDoc, setWalletLoading } =
 walletSlice.actions;
export default walletSlice.reducer;
