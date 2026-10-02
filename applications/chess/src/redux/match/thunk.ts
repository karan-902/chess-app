import { createAsyncThunk } from "@reduxjs/toolkit";
import { requestGameState } from "@gopvp/common/src/util/socket";
import { setMatchState } from "@gopvp/chess/src/redux/match/slice";
import type { IGameStateResponse } from "@gopvp/chess/src/types/response";

interface ILoadMatchStateArgs {
 matchId: string;
 userId?: string;
}

export const loadMatchState = createAsyncThunk(
 "match/loadMatchState",
 async ({ matchId, userId }: ILoadMatchStateArgs, { dispatch }) => {
  const match = await requestGameState<IGameStateResponse>(matchId);
  if (match) dispatch(setMatchState({ match, userId }));
  return !!match;
 },
);
