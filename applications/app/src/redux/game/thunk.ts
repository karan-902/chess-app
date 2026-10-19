import { createAsyncThunk } from "@reduxjs/toolkit";
import {
 callAPIInterface,
 showApiErrorToast,
} from "@gopvp/common/src/util/api";
import { throwThunkError } from "@gopvp/app/src/redux/createAppThunk";
import {
 finishGameLoad,
 setGameDetails,
 startGameLoad,
} from "@gopvp/app/src/redux/game/slice";
import type { IGameResponse } from "@gopvp/common/src/types/response";
import { ENDPOINTS } from "@gopvp/common/src/constants/endpoint";
import { showToastMessage } from "@gopvp/common/src/util/injectStore";
import { gameUnavailableText } from "@gopvp/app/src/constants/message";

export const fetchGameDetails = createAsyncThunk(
 "game/fetchGameDetails",
 async (slug: string, { dispatch, rejectWithValue }) => {
  dispatch(startGameLoad(slug));
  try {
   const res = await callAPIInterface<IGameResponse, undefined>(
    "GET",
    `${ENDPOINTS.GAMES}/${slug}`,
   );
   dispatch(setGameDetails(res.is_active ? res : null));
   if (!res.is_active)
    showToastMessage({
     toastMessage: gameUnavailableText,
     toastVariant: "error",
    });
   return res;
  } catch (err) {
   dispatch(setGameDetails(null));
   showApiErrorToast(err);
   return rejectWithValue(throwThunkError(err));
  } finally {
   dispatch(finishGameLoad());
  }
 },
);
