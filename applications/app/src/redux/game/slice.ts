import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IGameResponse } from "@gopvp/common/src/types/response";
import type { GameSlug } from "@gopvp/app/src/config/game";

export interface IGameState {
 enteredGame: GameSlug | null;
 requestedSlug: string | null;
 details: IGameResponse | null;
 isLoading: boolean;
}

const initialState: IGameState = {
 enteredGame: null,
 requestedSlug: null,
 details: null,
 isLoading: false,
};

const gameSlice = createSlice({
 name: "game",
 initialState,
 reducers: {
  setEnteredGame: (state, action: PayloadAction<GameSlug>) => {
   state.enteredGame = action.payload;
  },
  startGameLoad: (state, action: PayloadAction<string>) => {
   state.requestedSlug = action.payload;
   state.details = null;
   state.isLoading = true;
  },
  setGameDetails: (state, action: PayloadAction<IGameResponse>) => {
   state.details = action.payload;
  },
  finishGameLoad: (state) => {
   state.isLoading = false;
  },
 },
});

export const { setEnteredGame, startGameLoad, setGameDetails, finishGameLoad } =
 gameSlice.actions;
export default gameSlice.reducer;
