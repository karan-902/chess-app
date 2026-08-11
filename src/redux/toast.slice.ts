import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ToastSeverity = "error" | "warning" | "info" | "success";

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

const initialState: IToastState = {
    open: false,
    message: "",
    severity: "info",
    title: "",
};

const toastSlice = createSlice({
    name: "toast",
    initialState,
    reducers: {
        showToast: (state, action: PayloadAction<IToastPayload>) => {
            state.open = true;
            state.message = action.payload.message;
            state.severity = action.payload.severity;
            state.title = action.payload.title;
        },
        hideToast: (state) => {
            state.open = false;
        },
    },
});

export const toastReducer = toastSlice.reducer;
export const { showToast, hideToast } = toastSlice.actions;
