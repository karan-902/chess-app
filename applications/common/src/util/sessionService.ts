import {
 getInjectedPersistor,
 getInjectedStore,
} from "@gopvp/common/src/util/injectStore";

const SET_SESSION_ACTION = "auth/setSession";
const UPDATE_SESSION_ACTION = "auth/updateSession";
const CLEAR_SESSION_ACTION = "auth/clearSession";

const store = () => getInjectedStore()!;

const sessionService = {
 loadSession: async <TSession>() =>
  (store().getState().auth.session ?? null) as TSession | null,
 saveSession: async <TSession>(session: TSession) => {
  store().dispatch({ type: SET_SESSION_ACTION, payload: session });
  await getInjectedPersistor()?.flush();
 },
 updateSession: async <TSession>(changes: Partial<TSession>) => {
  store().dispatch({
   type: UPDATE_SESSION_ACTION,
   payload: changes,
  });
  await getInjectedPersistor()?.flush();
 },
 deleteSession: async () => {
  store().dispatch({ type: CLEAR_SESSION_ACTION });
  await getInjectedPersistor()?.flush();
 },
};

export default sessionService;
