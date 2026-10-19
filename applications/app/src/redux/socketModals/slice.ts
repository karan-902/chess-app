import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IActiveGameResponse } from "@gopvp/common/src/types/response";

interface IDeviceHandoff {
 deviceName: string | null;
}

interface ISocketModalsState {
 activeGame: IActiveGameResponse | null;
 deviceHandoff: IDeviceHandoff | null;
 openingMatchId: string | null;
 isFindingMatch: boolean;
}

const initialState: ISocketModalsState = {
 activeGame: null,
 deviceHandoff: null,
 openingMatchId: null,
 isFindingMatch: false,
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
  setFindingMatch: (state, action: PayloadAction<boolean>) => {
   state.isFindingMatch = action.payload;
  },
 },
});

export const { setActiveGame, setOpeningMatchId, setFindingMatch } =
 socketModalsSlice.actions;
export default socketModalsSlice.reducer;
