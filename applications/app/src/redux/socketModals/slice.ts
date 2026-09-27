import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
 IActiveGameEvent,
 IGameStateBasePlayer,
} from "@gopvp/common/src/types/response";

interface IDeviceHandoff {
 deviceName: string | null;
}

interface IActiveGame extends IActiveGameEvent {
 bet: number;
 opponent: IGameStateBasePlayer;
}

interface ISocketModalsState {
 activeGame: IActiveGame | null;
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
  setActiveGame: (state, action: PayloadAction<IActiveGame | null>) => {
   state.activeGame = action.payload;
  },
 },
});

export const { setActiveGame } = socketModalsSlice.actions;
export default socketModalsSlice.reducer;
