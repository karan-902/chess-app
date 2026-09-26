import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IGameDetailsResponse } from "@/types/utils";

interface IGameState {
    requestedSlug: string | null;
    details: IGameDetailsResponse | null;
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
        setGameDetails: (state, action: PayloadAction<IGameDetailsResponse>) => {
            state.details = action.payload;
        },
        finishGameLoad: (state) => {
            state.isLoading = false;
        },
    },
});

export const { startGameLoad, setGameDetails, finishGameLoad } = gameSlice.actions;
export default gameSlice.reducer;
