import { createAsyncThunk } from "@reduxjs/toolkit";
import {
 callAPIInterface,
 showApiErrorToast,
} from "@gopvp/common/src/util/api";
import { throwThunkError } from "@gopvp/app/src/redux/createAppThunk";
import {
 setWalletBalance,
 setWalletLoading,
} from "@gopvp/app/src/redux/wallet/slice";
import type { IBalanceResponse } from "@gopvp/common/src/types/response";
import { ENDPOINTS } from "@gopvp/common/src/constants/endpoint";

export const fetchWalletBalance = createAsyncThunk(
 "wallet/fetchWalletBalance",
 async (_, { dispatch, rejectWithValue }) => {
  try {
   const res = await callAPIInterface<IBalanceResponse | null, undefined>(
    "GET",
    ENDPOINTS.WALLET_BALANCE,
   );
   if (res) dispatch(setWalletBalance(res));
   else dispatch(setWalletLoading(false));
   return res;
  } catch (err) {
   dispatch(setWalletLoading(false));
   showApiErrorToast(err);
   return rejectWithValue(throwThunkError(err));
  }
 },
);
