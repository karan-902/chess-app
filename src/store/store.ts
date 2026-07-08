import { configureStore } from "@reduxjs/toolkit";
import localforage from "localforage";
import authReducer, { type TAuthSessionState } from "./persisted/auth.slice";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import { buildPersistConfig } from "./hooks";

const lf = localforage.createInstance({
    name: "KingStake",
    storeName: "key-value-pairs",
});

const authPersistConfig = buildPersistConfig<TAuthSessionState>({
    key: "CHESS-SESSION",
    storage: lf,
});

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
