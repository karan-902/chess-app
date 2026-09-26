import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IActiveGameFoundResponse } from "@/types/types";

interface IRematchOffer {
 gameId: string;
 opponentUsername: string;
 betAmount: number;
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
 },
});

export const { setActiveGame } = socketModalsSlice.actions;
export default socketModalsSlice.reducer;
