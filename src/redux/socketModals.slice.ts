import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IActiveGameFoundResponse } from "@/types/types";

export interface ISentChallenge {
    friendId: string;
    friendUsername: string;
    stakeAmount: number;
    secondsLeft: number;
}

interface IRematchOffer {
    gameId: string;
    opponentUsername: string;
    stakeAmount: number;
}

interface IIncomingChallenge {
    challengerId: string;
    challengerUsername: string;
    stakeAmount: number;
}

interface IDeviceHandoff {
    deviceName: string | null;
}

interface ISocketModalsState {
    activeGame: IActiveGameFoundResponse | null;
    deviceHandoff: IDeviceHandoff | null;
    rematchOffer: IRematchOffer | null;
    incomingChallenge: IIncomingChallenge | null;
    sentChallenge: ISentChallenge | null;
}

const initialState: ISocketModalsState = {
    activeGame: null,
    deviceHandoff: null,
    rematchOffer: null,
    incomingChallenge: null,
    sentChallenge: null,
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
        setIncomingChallenge: (
            state,
            action: PayloadAction<IIncomingChallenge | null>,
        ) => {
            state.incomingChallenge = action.payload;
        },
        setSentChallenge: (
            state,
            action: PayloadAction<ISentChallenge | null>,
        ) => {
            state.sentChallenge = action.payload;
        },
        decrementSentChallengeCountdown: (state) => {
            if (state.sentChallenge) {
                state.sentChallenge.secondsLeft = Math.max(
                    0,
                    state.sentChallenge.secondsLeft - 1,
                );
            }
        },
    },
});

export const socketModalsReducer = socketModalsSlice.reducer;
export const {
    setActiveGame,
    setDeviceHandoff,
    setRematchOffer,
    setIncomingChallenge,
    setSentChallenge,
    decrementSentChallengeCountdown,
} = socketModalsSlice.actions;
