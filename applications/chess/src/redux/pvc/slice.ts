import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { TIME_SECONDS } from "@gopvp/chess/src/constants";
import {
 computerText,
 difficultyText,
} from "@gopvp/chess/src/constants/messages";
import type { Difficulty } from "@gopvp/chess/src/types/component";
import type {
 GameCategory,
 IGameRoomPlayer,
 PieceColor,
} from "@gopvp/chess/src/types/index";

export interface IPvcState {
 gameId: string | null;
 difficulty: Difficulty;
 time: number;
 self: IGameRoomPlayer | null;
 opponent: IGameRoomPlayer | null;
}

interface IStartPvcGamePayload {
 gameId: string;
 difficulty: Difficulty;
 category: GameCategory;
 color: PieceColor;
 username: string;
}

const initialState: IPvcState = {
 gameId: null,
 difficulty: "medium",
 time: 0,
 self: null,
 opponent: null,
};

const pvcSlice = createSlice({
 name: "pvc",
 initialState,
 reducers: {
  startPvcGame: (_state, action: PayloadAction<IStartPvcGamePayload>) => {
   const { gameId, difficulty, category, color, username } = action.payload;
   return {
    gameId,
    difficulty,
    time: TIME_SECONDS[category] * 1000,
    self: { name: username, scoreLabel: "", color },
    opponent: {
     name: computerText,
     scoreLabel: difficultyText[difficulty],
     color: color === "w" ? "b" : "w",
    },
   };
  },
 },
});

export const { startPvcGame } = pvcSlice.actions;
export default pvcSlice.reducer;
