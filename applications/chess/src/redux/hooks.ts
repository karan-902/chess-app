import type { PersistConfig } from "redux-persist";
import type { AppDispatch, RootState } from "./store";
import { useDispatch, useSelector } from "react-redux";

export const useReduxSelector = useSelector.withTypes<RootState>();
export const useReduxDispatch = useDispatch.withTypes<AppDispatch>();

export function buildPersistConfig<TState>(
    options: PersistConfig<TState>,
): PersistConfig<TState> {
    return { version: 1, ...options };
}
