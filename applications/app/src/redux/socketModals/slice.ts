import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IActiveGameResponse } from "@gopvp/common/src/types/response";

interface IDeviceHandoff {
 deviceName: string | null;
}

interface ISocketModalsState {
 activeGame: IActiveGameResponse | null;
 deviceHandoff: IDeviceHandoff | null;
}

const initialState: ISocketModalsState = {
 activeGame: null,
 deviceHandoff: null,
};

const socketModalsSlice = createSlice({
 name: "socketModals",
 initialState,
 reducers: {
  setActiveGame: (state, action: PayloadAction<IActiveGameResponse | null>) => {
   state.activeGame = action.payload;
  },
 },
});

export const { setActiveGame } = socketModalsSlice.actions;
export default socketModalsSlice.reducer;
