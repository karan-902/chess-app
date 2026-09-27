import { readStorage, writeStorage } from "@gopvp/common/src/util/storage";
import type { IPvcSnapshot } from "@gopvp/chess/src/types/component";

function readSessionJson<T>(key: string): T | null {
 const raw = readStorage(sessionStorage, key);
 try {
  return raw ? JSON.parse(raw) : null;
 } catch {
  return null;
 }
}

export const markGameFinished = (id: string) =>
 writeStorage(sessionStorage, `gr_finished:${id}`, "1");
export const isGameFinished = (id: string) =>
 readStorage(sessionStorage, `gr_finished:${id}`) === "1";

export const savePvcSnapshot = (id: string, snapshot: IPvcSnapshot) =>
 writeStorage(sessionStorage, `pvc_snapshot:${id}`, JSON.stringify(snapshot));
export const clearPvcSnapshot = (id: string) =>
 writeStorage(sessionStorage, `pvc_snapshot:${id}`, null);
export const loadPvcSnapshot = (id: string) =>
 readSessionJson<IPvcSnapshot>(`pvc_snapshot:${id}`);
