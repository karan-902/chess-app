import type { IPvcSnapshot } from "@/types/component";
import type { IPvcState } from "@/redux/pvc/slice";

const FINGERPRINT_KEY = "gopvp_fingerprint";
const PVC_STATE_KEY = "pvc_state";

function readStorage(storage: Storage, key: string): string | null {
 try {
  return storage.getItem(key);
 } catch {
  return null;
 }
}

function readSessionJson<T>(key: string): T | null {
 const raw = readStorage(sessionStorage, key);
 try {
  return raw ? JSON.parse(raw) : null;
 } catch {
  return null;
 }
}

function writeStorage(storage: Storage, key: string, value: string | null) {
 try {
  if (value === null) storage.removeItem(key);
  else storage.setItem(key, value);
 } catch {}
}

export const getStoredFingerprint = () =>
 readStorage(localStorage, FINGERPRINT_KEY);
export const setStoredFingerprint = (fingerprint: string) =>
 writeStorage(localStorage, FINGERPRINT_KEY, fingerprint);

export const markGameFinished = (id: string) =>
 writeStorage(sessionStorage, `gr_finished:${id}`, "1");
export const isGameFinished = (id: string) =>
 readStorage(sessionStorage, `gr_finished:${id}`) === "1";

export const savePvcState = (state: IPvcState) =>
 writeStorage(sessionStorage, PVC_STATE_KEY, JSON.stringify(state));
export const loadPvcState = () => readSessionJson<IPvcState>(PVC_STATE_KEY);

export const savePvcSnapshot = (id: string, snapshot: IPvcSnapshot) =>
 writeStorage(sessionStorage, `pvc_snapshot:${id}`, JSON.stringify(snapshot));
export const clearPvcSnapshot = (id: string) =>
 writeStorage(sessionStorage, `pvc_snapshot:${id}`, null);
export const loadPvcSnapshot = (id: string) =>
 readSessionJson<IPvcSnapshot>(`pvc_snapshot:${id}`);
