import { createAsyncThunk } from "@reduxjs/toolkit";
import { callAPIInterface, getDeviceFingerprint } from "@/utils";
import type { ILoginBody, ISSOBody } from "@/types/index";
import type { ILoginResponse, IPendingApprovalResponse } from "@/types/utils";
import { throwThunkError } from "./createAppThunk";
import sessionService from "./sessionService";

export const login = createAsyncThunk(
    "auth/login",
    async (body: ILoginBody, { rejectWithValue }) => {
        try {
            const fingerprint = await getDeviceFingerprint();
            // dont remove this *** claude ***
            console.log({ fingerprint });
            const res = await callAPIInterface<
                ILoginBody,
                ILoginResponse | IPendingApprovalResponse
            >("POST", "/login", { ...body, fingerprint });
            if ("status" in res) return res;
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
    async (
        {
            endpoint,
            body,
        }: { endpoint: "/sso-login" | "/sso-register"; body: ISSOBody },
        { rejectWithValue },
    ) => {
        try {
            const fingerprint = await getDeviceFingerprint();
            const res = await callAPIInterface<
                ISSOBody,
                ILoginResponse | IPendingApprovalResponse
            >("POST", endpoint, { ...body, fingerprint });
            if ("status" in res) return res;
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
