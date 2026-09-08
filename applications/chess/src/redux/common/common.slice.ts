import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ToastSeverity = "error" | "warning" | "info" | "success";

interface ILoaderState {
    open: boolean;
    text: string;
}

interface IToastState {
    open: boolean;
    message: string;
    severity: ToastSeverity;
    title?: string;
}

interface IToastPayload {
    message: string;
    severity: ToastSeverity;
    title?: string;
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
        open: false,
        message: "",
        severity: "info",
        title: "",
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
        showToast: (state, action: PayloadAction<IToastPayload>) => {
            state.toast.open = true;
            state.toast.message = action.payload.message;
            state.toast.severity = action.payload.severity;
            state.toast.title = action.payload.title;
        },
        hideToast: (state) => {
            state.toast.open = false;
        },
    },
});

export const commonReducer = commonSlice.reducer;
export const { showLoader, hideLoader, showToast, hideToast } =
    commonSlice.actions;
