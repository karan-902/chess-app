import { configureStore } from "@reduxjs/toolkit";
import localforage from "localforage";
import sessionService from "@gopvp/common/src/util/sessionService";
import toastService from "@gopvp/common/src/util/toastService";
import authReducer, { clearSession, setSession } from "./auth/slice";
import commonReducer, { showToast } from "./common/slice";
import walletReducer from "./wallet/slice";
import socketModalsReducer from "./socketModals/slice";
import speedReducer, { hydrateSpeed, type ISpeedState } from "./speed/slice";
import gameReducer from "./game/slice";
import matchReducer from "./match/slice";
import pvcReducer from "./pvc/slice";
import { savePvcState } from "@/utils/storage";
import type { ILoginResponse } from "@gopvp/common/src/types/response";

export const store = configureStore({
 reducer: {
  auth: authReducer,
  common: commonReducer,
  wallet: walletReducer,
  socketModals: socketModalsReducer,
  speed: speedReducer,
  game: gameReducer,
  match: matchReducer,
  pvc: pvcReducer,
 },
});

sessionService.subscribe<ILoginResponse>((session) =>
 store.dispatch(session ? setSession(session) : clearSession()),
);

toastService.subscribe((toast) =>
 store.dispatch(showToast({ isToastOpen: true, ...toast })),
);

const speedStore = localforage.createInstance({ name: "gopvp", storeName: "speed" });
const SPEED_STATE_KEY = "state";
let savedSpeedState = store.getState().speed;

store.subscribe(() => {
 const speedState = store.getState().speed;
 if (speedState === savedSpeedState) return;
 savedSpeedState = speedState;
 speedStore.setItem(SPEED_STATE_KEY, speedState);
});

let savedPvcState = store.getState().pvc;

store.subscribe(() => {
 const pvcState = store.getState().pvc;
 if (pvcState === savedPvcState) return;
 savedPvcState = pvcState;
 savePvcState(pvcState);
});

export async function hydrateSpeedState() {
 const storedSpeedState = await speedStore.getItem<ISpeedState>(SPEED_STATE_KEY);
 if (storedSpeedState) store.dispatch(hydrateSpeed(storedSpeedState));
}

const legacySessionStore = localforage.createInstance({
 name: "Chess",
 storeName: "key-value-pairs",
});
const LEGACY_SESSION_KEY = "persist:CHESS-SESSION";

export async function hydrateSession() {
 if (await sessionService.init<ILoginResponse>()) return;
 try {
  const legacyState = await legacySessionStore.getItem<string>(LEGACY_SESSION_KEY);
  const legacySession: ILoginResponse | null = legacyState
   ? JSON.parse(JSON.parse(legacyState).session)
   : null;
  if (legacySession) await sessionService.saveSession(legacySession);
  await legacySessionStore.removeItem(LEGACY_SESSION_KEY);
 } catch {}
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
