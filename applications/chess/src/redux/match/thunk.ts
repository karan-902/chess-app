import { createAsyncThunk } from "@reduxjs/toolkit";
import { getSocket } from "@gopvp/common/src/util/socket";
import { setMatchState } from "@gopvp/chess/src/redux/match/slice";
import type { IGameStateResponse } from "@gopvp/chess/src/types/response";
import type {
 IGameNotFoundResponse,
 ISocketAckError,
} from "@gopvp/common/src/types/response";

interface ILoadMatchStateArgs {
 matchId: string;
 userId?: string;
}

export const loadMatchState = createAsyncThunk(
 "match/loadMatchState",
 ({ matchId, userId }: ILoadMatchStateArgs, { dispatch }) =>
  new Promise<boolean>((resolve) => {
   const socket = getSocket();
   if (!socket) return resolve(false);
   socket.emit(
    "game:state",
    (
     err: ISocketAckError | null,
     data: IGameStateResponse | IGameNotFoundResponse,
    ) => {
     if (err || "error" in data || data.match_id !== matchId) {
      resolve(false);
      return;
     }
     dispatch(setMatchState({ match: data, userId }));
     resolve(true);
    },
   );
  }),
);
