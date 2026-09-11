import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ILoginResponse } from "@/types/utils";

export type TAuthSessionState = {
    isLoggedIn: boolean;
    session: ILoginResponse | null;
};

export const initialState: TAuthSessionState = {
    isLoggedIn: false,
    session: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setSession: (state, action: PayloadAction<ILoginResponse>) => {
            state.session = action.payload;
            state.isLoggedIn =
                Boolean(state.session.access_token) &&
                Boolean(state.session.refresh_token);
        },
        clearSession: () => initialState,
        updateSession: (state, action: PayloadAction<Partial<ILoginResponse>>) => {
            if (state.session) {
                state.session = { ...state.session, ...action.payload };
            }
        },
    },
});

export const { setSession, clearSession, updateSession } = authSlice.actions;
export default authSlice.reducer;
