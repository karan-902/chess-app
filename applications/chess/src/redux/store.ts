import { configureStore } from "@reduxjs/toolkit";
import localforage from "localforage";
import sessionService from "@gopvp/common/src/util/sessionService";
import { injectStore } from "@gopvp/common/src/util/injectStore";
import authReducer, {
 clearSession,
 setSession,
} from "@gopvp/chess/src/redux/auth/slice";
import commonReducer from "@gopvp/chess/src/redux/common/slice";
import walletReducer from "@gopvp/chess/src/redux/wallet/slice";
import socketModalsReducer from "@gopvp/chess/src/redux/socketModals/slice";
import launchReducer, {
 setLaunchParams,
 type ILaunchState,
} from "@gopvp/chess/src/redux/launch/slice";
import gameReducer, { setEnteredGame } from "@gopvp/chess/src/redux/game/slice";
import matchReducer from "@gopvp/chess/src/redux/match/slice";
import pvcReducer from "@gopvp/chess/src/redux/pvc/slice";
import { savePvcState } from "@gopvp/chess/src/utils/storage";
import type { ILoginResponse } from "@gopvp/common/src/types/response";
import type { GameSlug } from "@gopvp/chess/src/constants/config";

interface IPersistedState {
 enteredGame: GameSlug | null;
 launch: ILaunchState;
}

export const store = configureStore({
 reducer: {
  auth: authReducer,
  common: commonReducer,
  wallet: walletReducer,
  socketModals: socketModalsReducer,
  launch: launchReducer,
  game: gameReducer,
  match: matchReducer,
  pvc: pvcReducer,
 },
});

sessionService.subscribe<ILoginResponse>((session) =>
 store.dispatch(session ? setSession(session) : clearSession()),
);

injectStore(store);

const persistedStore = localforage.createInstance({
 name: "gopvp",
 storeName: "app",
});
const PERSISTED_STATE_KEY = "state";
let savedEnteredGame = store.getState().game.enteredGame;
let savedLaunch = store.getState().launch;

store.subscribe(() => {
 const {
  game: { enteredGame },
  launch,
 } = store.getState();
 if (enteredGame === savedEnteredGame && launch === savedLaunch) return;
 savedEnteredGame = enteredGame;
 savedLaunch = launch;
 persistedStore.setItem<IPersistedState>(PERSISTED_STATE_KEY, {
  enteredGame,
  launch,
 });
});

let savedPvcState = store.getState().pvc;

store.subscribe(() => {
 const pvcState = store.getState().pvc;
 if (pvcState === savedPvcState) return;
 savedPvcState = pvcState;
 savePvcState(pvcState);
});

export async function hydratePersistedState() {
 const persisted =
  await persistedStore.getItem<IPersistedState>(PERSISTED_STATE_KEY);
 if (!persisted) return;
 if (persisted.enteredGame)
  store.dispatch(setEnteredGame(persisted.enteredGame));
 store.dispatch(setLaunchParams(persisted.launch));
}

const legacySessionStore = localforage.createInstance({
 name: "Chess",
 storeName: "key-value-pairs",
});

const LEGACY_SESSION_KEY = "persist:CHESS-SESSION";

export async function hydrateSession() {
 if (await sessionService.init<ILoginResponse>()) return;
 try {
  const legacyState =
   await legacySessionStore.getItem<string>(LEGACY_SESSION_KEY);
  const legacySession: ILoginResponse | null = legacyState
   ? JSON.parse(JSON.parse(legacyState).session)
   : null;
  if (legacySession) await sessionService.saveSession(legacySession);
  await legacySessionStore.removeItem(LEGACY_SESSION_KEY);
 } catch {}
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
