import type { AppDispatch, RootState } from "./store";
import { useDispatch, useSelector } from "react-redux";

export const useReduxSelector = useSelector.withTypes<RootState>();
export const useReduxDispatch = useDispatch.withTypes<AppDispatch>();
