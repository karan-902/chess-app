import {
 getInjectedPersistor,
 getInjectedStore,
} from "@gopvp/common/src/util/injectStore";
import {
 SET_SESSION_ACTION,
 UPDATE_SESSION_ACTION,
 CLEAR_SESSION_ACTION,
} from "@gopvp/common/src/constants/action";

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
