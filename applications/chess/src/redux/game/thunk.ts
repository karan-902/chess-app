import { createAsyncThunk } from "@reduxjs/toolkit";
import { callAPIInterface, showApiErrorToast } from "@/utils";
import {
 noDataFoundText,
} from "@/constants/messages";
import { throwThunkError } from "@/redux/createAppThunk";
import { finishGameLoad, setGameDetails, startGameLoad } from "@/redux/game/slice";
import type { IGameDetailsResponse } from "@/types/utils";

export const fetchGameDetails = createAsyncThunk(
    "game/fetchGameDetails",
    async (slug: string, { dispatch, rejectWithValue }) => {
        dispatch(startGameLoad(slug));
        try {
            const res = await callAPIInterface<undefined, IGameDetailsResponse>(
                "GET",
                `/games/${slug}`,
            );
            dispatch(setGameDetails(res));
            return res;
        } catch (err) {
            showApiErrorToast(err, noDataFoundText);
            return rejectWithValue(throwThunkError(err));
        } finally {
            dispatch(finishGameLoad());
        }
    },
);
