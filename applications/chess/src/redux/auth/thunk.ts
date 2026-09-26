import { createAsyncThunk } from "@reduxjs/toolkit";
import { callAPIInterface, getDeviceFingerprint } from "@/utils";
import type { ILoginBody, ISSOBody } from "@/types/index";
import type { ILoginResponse } from "@/types/utils";
import { throwThunkError } from "@/redux/createAppThunk";
import sessionService from "@gopvp/common/src/util/sessionService";

export const login = createAsyncThunk(
 "auth/login",
 async (body: ILoginBody, { rejectWithValue }) => {
  try {
   const fingerprint = await getDeviceFingerprint();
   const res = await callAPIInterface<ILoginBody, ILoginResponse>(
    "POST",
    "/auth/login",
    { ...body, fingerprint },
   );
   // if ("status" in res) return res;
   await sessionService.saveSession(res);
   return res;
  } catch (err: any) {
   return rejectWithValue({
    ...err?.response?.data,
    ...throwThunkError(err),
   });
  }
 },
);

export const googleLogin = createAsyncThunk(
 "auth/googleLogin",
 async (body: ISSOBody, { rejectWithValue }) => {
  try {
   const fingerprint = await getDeviceFingerprint();
   const res = await callAPIInterface<ISSOBody, ILoginResponse>(
    "POST",
    "/auth/sso-login",
    { ...body, fingerprint },
   );
   // if ("status" in res) return res
   await sessionService.saveSession(res);
   return res;
  } catch (err: any) {
   return rejectWithValue({
    ...err?.response?.data,
    ...throwThunkError(err),
   });
  }
 },
);
