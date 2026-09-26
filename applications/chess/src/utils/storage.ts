import type { IPvcSnapshot } from "@/types/components";

const FINGERPRINT_KEY = "gopvp_fingerprint";

function readStorage(storage: Storage, key: string): string | null {
 try {
  return storage.getItem(key);
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

export const getPvcColor = (id: string) =>
 readStorage(sessionStorage, `pvc_color:${id}`);
export const setPvcColor = (id: string, color: string) =>
 writeStorage(sessionStorage, `pvc_color:${id}`, color);

export const savePvcSnapshot = (id: string, snapshot: IPvcSnapshot) =>
 writeStorage(sessionStorage, `pvc_snapshot:${id}`, JSON.stringify(snapshot));
export const clearPvcSnapshot = (id: string) =>
 writeStorage(sessionStorage, `pvc_snapshot:${id}`, null);

export function loadPvcSnapshot(id: string): IPvcSnapshot | null {
 const raw = readStorage(sessionStorage, `pvc_snapshot:${id}`);
 try {
  return raw ? JSON.parse(raw) : null;
 } catch {
  return null;
 }
}
