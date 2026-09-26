import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ToastSeverity = "error" | "warning" | "info" | "success";

interface ILoaderState {
    open: boolean;
    text: string;
}

interface IToastState {
    isToastOpen: boolean;
    toastMessage: string;
    toastVariant: ToastSeverity;
    toastTitle?: string;
}

interface ICommonState {
    loader: ILoaderState;
    toast: IToastState;
}

const initialState: ICommonState = {
    loader: {
        open: false,
        text: "Loading...",
    },
    toast: {
        isToastOpen: false,
        toastMessage: "",
        toastVariant: "info",
        toastTitle: "",
    },
};

const commonSlice = createSlice({
    name: "common",
    initialState,
    reducers: {
        showLoader: (
            state,
            action: PayloadAction<{ text?: string } | undefined>,
        ) => {
            state.loader.open = true;
            state.loader.text = action.payload?.text ?? "Loading...";
        },
        hideLoader: (state) => {
            state.loader.open = false;
        },
        showToast: (state, action: PayloadAction<IToastState>) => {
            state.toast = action.payload;
        },
        hideToast: (state) => {
            state.toast.isToastOpen = false;
        },
    },
});

export const { showLoader, hideLoader, showToast, hideToast } =
    commonSlice.actions;
export default commonSlice.reducer;
