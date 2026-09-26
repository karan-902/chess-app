import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IGameStatePlayer, IGameStateResponse } from "@gopvp/chess/src/types/response";
import type { IGameRoomPlayer } from "@gopvp/chess/src/types/index";

interface IMatchState {
 state: IGameStateResponse | null;
 self: IGameRoomPlayer | null;
 opponent: IGameRoomPlayer | null;
}

interface ISetMatchStatePayload {
 match: IGameStateResponse;
 userId?: string;
}

const initialState: IMatchState = {
 state: null,
 self: null,
 opponent: null,
};

const toRoomPlayer = (player?: IGameStatePlayer): IGameRoomPlayer | null =>
 player
  ? {
     name: player.username,
     scoreLabel: String(Math.round(player.score)),
     color: player.color,
    }
  : null;

const matchSlice = createSlice({
 name: "match",
 initialState,
 reducers: {
  setMatchState: (state, action: PayloadAction<ISetMatchStatePayload>) => {
   const { match, userId } = action.payload;
   state.state = match;
   state.self = toRoomPlayer(
    match.players.find((player) => player.user_id === userId),
   );
   state.opponent = toRoomPlayer(
    match.players.find((player) => player.user_id !== userId),
   );
  },
  clearMatchState: () => initialState,
 },
});

export const { setMatchState, clearMatchState } = matchSlice.actions;
export default matchSlice.reducer;
