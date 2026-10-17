import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IActiveGameResponse } from "@gopvp/common/src/types/response";

interface IDeviceHandoff {
 deviceName: string | null;
}

interface ISocketModalsState {
 activeGame: IActiveGameResponse | null;
 deviceHandoff: IDeviceHandoff | null;
 openingMatchId: string | null;
}

const initialState: ISocketModalsState = {
 activeGame: null,
 deviceHandoff: null,
 openingMatchId: null,
};

const socketModalsSlice = createSlice({
 name: "socketModals",
 initialState,
 reducers: {
  setActiveGame: (state, action: PayloadAction<IActiveGameResponse | null>) => {
   state.activeGame = action.payload;
  },
  setOpeningMatchId: (state, action: PayloadAction<string>) => {
   state.openingMatchId = action.payload;
  },
 },
});

export const { setActiveGame, setOpeningMatchId } = socketModalsSlice.actions;
export default socketModalsSlice.reducer;
