import { createAsyncThunk } from "@reduxjs/toolkit";
import { callAPIInterface, showApiErrorToast } from "@/utils";
import { throwThunkError } from "@/redux/createAppThunk";
import { setWalletBalance, setWalletLoading } from "@/redux/wallet/slice";
import type { IBalanceResponse } from "@gopvp/common/src/types/response";

export const fetchWalletBalance = createAsyncThunk(
 "wallet/fetchWalletBalance",
 async (_, { dispatch, rejectWithValue }) => {
  try {
   const res = await callAPIInterface<IBalanceResponse | null, undefined>(
    "GET",
    "/wallet/balance",
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
