import { createAsyncThunk } from "@reduxjs/toolkit";
import {
 callAPIInterface,
 getDeviceFingerprint,
} from "@gopvp/common/src/util/api";
import type {
 ILoginBody,
 IGoogleLoginBody,
} from "@gopvp/common/src/types/payload";
import type { ILoginResponse } from "@gopvp/common/src/types/response";
import { throwThunkError } from "@gopvp/app/src/redux/createAppThunk";
import sessionService from "@gopvp/common/src/util/sessionService";
import { ENDPOINTS } from "@gopvp/common/src/constants/endpoint";

export const login = createAsyncThunk(
 "auth/login",
 async (body: ILoginBody, { rejectWithValue }) => {
  try {
   const fingerprint = await getDeviceFingerprint();
   const res = await callAPIInterface<ILoginResponse, ILoginBody>(
    "POST",
    ENDPOINTS.LOGIN,
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
 async (body: IGoogleLoginBody, { rejectWithValue }) => {
  try {
   const fingerprint = await getDeviceFingerprint();
   const res = await callAPIInterface<ILoginResponse, IGoogleLoginBody>(
    "POST",
    ENDPOINTS.SSO_LOGIN,
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
