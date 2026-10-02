import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IGameResponse } from "@gopvp/common/src/types/response";
import type {
 GamePage,
 LeaderboardScope,
 LeaderboardSort,
} from "@gopvp/common/src/types/index";
import type { MatchesSubtab } from "@gopvp/common/src/types/component";
import type { GameSlug } from "@gopvp/app/src/config/game";
import {
 DEFAULT_LEADERBOARD_SCOPE,
 DEFAULT_LEADERBOARD_SORT,
} from "@gopvp/app/src/constants/option";

export interface IGameState {
 enteredGame: GameSlug | null;
 activePage: GamePage;
 matchesSubtab: MatchesSubtab;
 leaderboardScope: LeaderboardScope;
 leaderboardSort: LeaderboardSort;
 requestedSlug: string | null;
 details: IGameResponse | null;
 isLoading: boolean;
}

const initialState: IGameState = {
 enteredGame: null,
 activePage: "PLAY",
 matchesSubtab: "history",
 leaderboardScope: DEFAULT_LEADERBOARD_SCOPE,
 leaderboardSort: DEFAULT_LEADERBOARD_SORT,
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
  setActivePage: (state, action: PayloadAction<GamePage>) => {
   state.activePage = action.payload;
  },
  setMatchesSubtab: (state, action: PayloadAction<MatchesSubtab>) => {
   state.matchesSubtab = action.payload;
  },
  setLeaderboardScope: (state, action: PayloadAction<LeaderboardScope>) => {
   state.leaderboardScope = action.payload;
  },
  setLeaderboardSort: (state, action: PayloadAction<LeaderboardSort>) => {
   state.leaderboardSort = action.payload;
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

export const {
 setEnteredGame,
 setActivePage,
 setMatchesSubtab,
 setLeaderboardScope,
 setLeaderboardSort,
 startGameLoad,
 setGameDetails,
 finishGameLoad,
} = gameSlice.actions;
export default gameSlice.reducer;
