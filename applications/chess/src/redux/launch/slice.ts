import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ILaunchState {
    acct: string | null;
    lang: string | null;
    balBtc: number | null;
    balUsdt: number | null;
    lightningAddress: string | null;
}

const initialState: ILaunchState = {
    acct: null,
    lang: null,
    balBtc: null,
    balUsdt: null,
    lightningAddress: null,
};

const launchSlice = createSlice({
    name: "launch",
    initialState,
    reducers: {
        setLaunchParams: (_state, action: PayloadAction<ILaunchState>) =>
            action.payload,
    },
});

export const { setLaunchParams } = launchSlice.actions;
export default launchSlice.reducer;
