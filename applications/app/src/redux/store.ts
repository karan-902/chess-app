import { combineReducers, configureStore } from "@reduxjs/toolkit";
import localforage from "localforage";
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
import sessionStorage from "redux-persist/lib/storage/session";
import { injectStore } from "@gopvp/common/src/util/injectStore";
import { buildPersistConfig } from "@gopvp/app/src/redux/hooks";
import authReducer, {
 type TAuthSessionState,
} from "@gopvp/app/src/redux/auth/slice";
import commonReducer from "@gopvp/app/src/redux/common/slice";
import walletReducer from "@gopvp/app/src/redux/wallet/slice";
import socketModalsReducer from "@gopvp/app/src/redux/socketModals/slice";
import speedReducer, {
 type ISpeedState,
} from "@gopvp/app/src/redux/speed/slice";
import gameReducer, { type IGameState } from "@gopvp/app/src/redux/game/slice";
import matchReducer from "@gopvp/chess/src/redux/match/slice";
import pvcReducer, { type IPvcState } from "@gopvp/chess/src/redux/pvc/slice";
import {
 APP_STORAGE_NAME,
 APP_STORAGE_STORE_NAME,
 SESSION_PERSIST_KEY,
 SPEED_PERSIST_KEY,
 GAME_PERSIST_KEY,
 PVC_PERSIST_KEY,
} from "@gopvp/app/src/constants/storageKey";

const appStorage = localforage.createInstance({
 name: APP_STORAGE_NAME,
 storeName: APP_STORAGE_STORE_NAME,
});

const authPersistConfig = buildPersistConfig<TAuthSessionState>({
 key: SESSION_PERSIST_KEY,
 storage: appStorage,
});

const speedPersistConfig = buildPersistConfig<ISpeedState>({
 key: SPEED_PERSIST_KEY,
 storage: appStorage,
});

const gamePersistConfig = buildPersistConfig<IGameState>({
 key: GAME_PERSIST_KEY,
 storage: appStorage,
 whitelist: ["enteredGame"],
});

const pvcPersistConfig = buildPersistConfig<IPvcState>({
 key: PVC_PERSIST_KEY,
 storage: sessionStorage,
});

const rootReducer = combineReducers({
 auth: persistReducer(authPersistConfig, authReducer),
 common: commonReducer,
 wallet: walletReducer,
 socketModals: socketModalsReducer,
 speed: persistReducer(speedPersistConfig, speedReducer),
 game: persistReducer(gamePersistConfig, gameReducer),
 match: matchReducer,
 pvc: persistReducer(pvcPersistConfig, pvcReducer),
});
export const store = configureStore({
 reducer: rootReducer,
 middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
   serializableCheck: {
    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
   },
  }),
});

export const persistor = persistStore(store);

injectStore(store, persistor);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
