import { createAsyncThunk } from "@reduxjs/toolkit";
import { callAPIInterface } from "@/utils";
import type { ILoginBody, ISSOBody } from "@/types/index";
import type { ILoginResponse } from "@/types/utils";
import { throwThunkError } from "./createAppThunk";
import sessionService from "./sessionService";

export const login = createAsyncThunk(
    "auth/login",
    async (body: ILoginBody, { rejectWithValue }) => {
        try {
            const res = await callAPIInterface<ILoginBody, ILoginResponse>(
                "POST",
                "/login",
                body,
            );
            await sessionService.saveSession(res);
            return res;
        } catch (err) {
            return rejectWithValue(throwThunkError(err));
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
            const res = await callAPIInterface<ISSOBody, ILoginResponse>(
                "POST",
                endpoint,
                body,
            );
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
