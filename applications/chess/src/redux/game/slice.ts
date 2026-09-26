import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IGameResponse } from "@gopvp/common/src/types/response";

interface IGameState {
    requestedSlug: string | null;
    details: IGameResponse | null;
    isLoading: boolean;
}

const initialState: IGameState = {
    requestedSlug: null,
    details: null,
    isLoading: false,
};

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        startGameLoad: (state, action: PayloadAction<string>) => {
            state.requestedSlug = action.payload;
            state.details = null;
            state.isLoading = true;
        },
        setGameDetails: (state, action: PayloadAction<IGameResponse>) => {
            state.details = action.payload;
        },
        finishGameLoad: (state) => {
            state.isLoading = false;
        },
    },
});

export const { startGameLoad, setGameDetails, finishGameLoad } = gameSlice.actions;
export default gameSlice.reducer;
