import type { IToast } from "@gopvp/common/src/types/component";

type TInjectedStore = {
 dispatch: (action: { type: string; payload?: unknown }) => unknown;
 getState: () => { auth: { session: unknown } };
};

type TInjectedPersistor = {
 flush: () => Promise<unknown>;
};

const SHOW_TOAST_ACTION = "common/showToast";

let injectedStore: TInjectedStore | null = null;
let injectedPersistor: TInjectedPersistor | null = null;

export const injectStore = (
 store: TInjectedStore,
 persistor: TInjectedPersistor,
) => {
 injectedStore = store;
 injectedPersistor = persistor;
};

export const getInjectedStore = () => injectedStore;

export const getInjectedPersistor = () => injectedPersistor;

export const showToastMessage = (toast: IToast) =>
 injectedStore?.dispatch({
  type: SHOW_TOAST_ACTION,
  payload: { isToastOpen: true, ...toast },
 });
