import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ILoaderState {
    open: boolean;
    text: string;
}

const initialState: ILoaderState = {
    open: false,
    text: "Loading...",
};

const loaderSlice = createSlice({
    name: "loader",
    initialState,
    reducers: {
        showLoader: (
            state,
            action: PayloadAction<{ text?: string } | undefined>,
        ) => {
            state.open = true;
            state.text = action.payload?.text ?? "Loading...";
        },
        hideLoader: () => initialState,
    },
});

export const loaderReducer = loaderSlice.reducer;
export const { showLoader, hideLoader } = loaderSlice.actions;
