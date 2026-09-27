import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ISpeedState {
 acct: string | null;
 lang: string | null;
 balBtc: number | null;
 balUsdt: number | null;
 lightningAddress: string | null;
}

const speedInitialState: ISpeedState = {
 acct: null,
 lang: null,
 balBtc: null,
 balUsdt: null,
 lightningAddress: null,
};

const speedSlice = createSlice({
 name: "speed",
 initialState: speedInitialState,
 reducers: {
  setLaunchParams: (_state, action: PayloadAction<ISpeedState>) =>
   action.payload,
 },
});

export const { setLaunchParams } = speedSlice.actions;
export default speedSlice.reducer;
