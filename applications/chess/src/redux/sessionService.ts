import type { ILoginResponse } from "@/types/utils";
import { clearSession, setSession } from "./persisted/auth.slice";
import { persistor, store } from "./store";

const sessionService = {
    loadSession: async (): Promise<ILoginResponse | null> => {
        const state = store.getState();
        return state.auth.session;
    },
    saveSession: async (payload: ILoginResponse) => {
        store.dispatch(setSession(payload));
        await persistor.flush();
        return true;
    },
    deleteSession: async () => {
        persistor.purge();
        persistor.persist();
        store.dispatch(clearSession());
        return true;
    },
    purgeAll: async () => {
        store.dispatch(clearSession());
        persistor.purge();
        return true;
    },
};

export default sessionService;
