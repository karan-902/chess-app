import type { IToast } from "@gopvp/common/src/types/component";

type TToastListener = (toast: IToast) => void;

const listeners = new Set<TToastListener>();

const toastService = {
 show: (toast: IToast) => listeners.forEach((listener) => listener(toast)),
 subscribe: (listener: TToastListener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
 },
};

export default toastService;
