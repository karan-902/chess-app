import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GameSlug } from "@/constants/config";

export interface ISpeedLaunchParams {
    acct: string | null;
    lang: string | null;
    balBtc: number | null;
    balUsdt: number | null;
    lightningAddress: string | null;
}

export interface ISpeedState extends ISpeedLaunchParams {
    enteredGame: GameSlug | null;
}

const initialState: ISpeedState = {
    enteredGame: null,
    acct: null,
    lang: null,
    balBtc: null,
    balUsdt: null,
    lightningAddress: null,
};

const speedSlice = createSlice({
    name: "speed",
    initialState,
    reducers: {
        hydrateSpeed: (_state, action: PayloadAction<ISpeedState>) => action.payload,
        setEnteredGame: (state, action: PayloadAction<GameSlug>) => {
            state.enteredGame = action.payload;
        },
        setSpeedLaunchParams: (state, action: PayloadAction<ISpeedLaunchParams>) => ({
            ...state,
            ...action.payload,
        }),
    },
});

export const { hydrateSpeed, setEnteredGame, setSpeedLaunchParams } = speedSlice.actions;
export default speedSlice.reducer;
