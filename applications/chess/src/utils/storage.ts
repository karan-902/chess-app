import { readStorage, writeStorage } from "@gopvp/common/src/util/storage";
import type { IPvcSnapshot } from "@gopvp/chess/src/types/component";
import {
 GAME_FINISHED_KEY_PREFIX,
 PVC_SNAPSHOT_KEY_PREFIX,
 MATCH_MOVES_KEY_PREFIX,
} from "@gopvp/chess/src/constants/storageKey";

function readSessionJson<T>(key: string): T | null {
 const raw = readStorage(sessionStorage, key);
 try {
  return raw ? JSON.parse(raw) : null;
 } catch {
  return null;
 }
}

export const markGameFinished = (id: string) =>
 writeStorage(sessionStorage, `${GAME_FINISHED_KEY_PREFIX}${id}`, "1");
export const isGameFinished = (id: string) =>
 readStorage(sessionStorage, `${GAME_FINISHED_KEY_PREFIX}${id}`) === "1";

export const savePvcSnapshot = (id: string, snapshot: IPvcSnapshot) =>
 writeStorage(
  sessionStorage,
  `${PVC_SNAPSHOT_KEY_PREFIX}${id}`,
  JSON.stringify(snapshot),
 );
export const clearPvcSnapshot = (id: string) =>
 writeStorage(sessionStorage, `${PVC_SNAPSHOT_KEY_PREFIX}${id}`, null);
export const loadPvcSnapshot = (id: string) =>
 readSessionJson<IPvcSnapshot>(`${PVC_SNAPSHOT_KEY_PREFIX}${id}`);

export const saveMatchMoves = (id: string, moves: IPvcSnapshot["moves"]) =>
 writeStorage(
  sessionStorage,
  `${MATCH_MOVES_KEY_PREFIX}${id}`,
  JSON.stringify(moves),
 );
export const clearMatchMoves = (id: string) =>
 writeStorage(sessionStorage, `${MATCH_MOVES_KEY_PREFIX}${id}`, null);
export const loadMatchMoves = (id: string) =>
 readSessionJson<IPvcSnapshot["moves"]>(`${MATCH_MOVES_KEY_PREFIX}${id}`);
