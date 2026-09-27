import { useDispatch, useSelector } from "react-redux";
import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import type { IMatchState } from "@gopvp/chess/src/redux/match/slice";
import type { IPvcState } from "@gopvp/chess/src/redux/pvc/slice";

interface IChessState {
 match: IMatchState;
 pvc: IPvcState;
}

export const useChessSelector = useSelector.withTypes<IChessState>();
export const useChessDispatch =
 useDispatch.withTypes<ThunkDispatch<IChessState, unknown, UnknownAction>>();
