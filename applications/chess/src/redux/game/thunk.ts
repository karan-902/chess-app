import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    callAPIInterface,
    showApiErrorToast,
} from "@gopvp/common/src/util/api";
import { throwThunkError } from "@gopvp/chess/src/redux/createAppThunk";
import { finishGameLoad, setGameDetails, startGameLoad } from "@gopvp/chess/src/redux/game/slice";
import type { IGameResponse } from "@gopvp/common/src/types/response";

export const fetchGameDetails = createAsyncThunk(
    "game/fetchGameDetails",
    async (slug: string, { dispatch, rejectWithValue }) => {
        dispatch(startGameLoad(slug));
        try {
            const res = await callAPIInterface<IGameResponse, undefined>(
                "GET",
                `/games/${slug}`,
            );
            dispatch(setGameDetails(res));
            return res;
        } catch (err) {
            showApiErrorToast(err);
            return rejectWithValue(throwThunkError(err));
        } finally {
            dispatch(finishGameLoad());
        }
    },
);
