import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IActiveGameFoundResponse } from "@/types/types";

interface IRematchOffer {
    gameId: string;
    opponentUsername: string;
    stakeAmount: number;
}

interface IDeviceHandoff {
    deviceName: string | null;
}

interface ISocketModalsState {
    activeGame: IActiveGameFoundResponse | null;
    deviceHandoff: IDeviceHandoff | null;
    rematchOffer: IRematchOffer | null;
}

const initialState: ISocketModalsState = {
    activeGame: null,
    deviceHandoff: null,
    rematchOffer: null,
};

const socketModalsSlice = createSlice({
    name: "socketModals",
    initialState,
    reducers: {
        setActiveGame: (
            state,
            action: PayloadAction<IActiveGameFoundResponse | null>,
        ) => {
            state.activeGame = action.payload;
        },
        setDeviceHandoff: (
            state,
            action: PayloadAction<IDeviceHandoff | null>,
        ) => {
            state.deviceHandoff = action.payload;
        },
        setRematchOffer: (
            state,
            action: PayloadAction<IRematchOffer | null>,
        ) => {
            state.rematchOffer = action.payload;
        },
    },
});

export const socketModalsReducer = socketModalsSlice.reducer;
export const { setActiveGame, setDeviceHandoff, setRematchOffer } =
    socketModalsSlice.actions;
