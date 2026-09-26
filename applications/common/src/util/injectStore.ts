import type { IToast } from "@gopvp/common/src/types/component";

type TInjectedStore = {
 dispatch: (action: { type: string; payload: unknown }) => unknown;
};

const SHOW_TOAST_ACTION = "common/showToast";

let injectedStore: TInjectedStore | null = null;

export const injectStore = (store: TInjectedStore) => {
 injectedStore = store;
};

export const showToastMessage = (toast: IToast) =>
 injectedStore?.dispatch({
  type: SHOW_TOAST_ACTION,
  payload: { isToastOpen: true, ...toast },
 });
