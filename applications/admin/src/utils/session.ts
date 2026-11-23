import { readStorage, writeStorage } from "@gopvp/common/src/util/storage";
import { ADMIN_SESSION_STORAGE_KEY } from "@gopvp/admin/src/constants/storageKey";
import type { TAdminSession } from "@gopvp/admin/src/types";

export const loadAdminSession = (): TAdminSession | null => {
 const raw = readStorage(localStorage, ADMIN_SESSION_STORAGE_KEY);
 return raw ? (JSON.parse(raw) as TAdminSession) : null;
};

export const saveAdminSession = (session: TAdminSession) =>
 writeStorage(localStorage, ADMIN_SESSION_STORAGE_KEY, JSON.stringify(session));

export const clearAdminSession = () =>
 writeStorage(localStorage, ADMIN_SESSION_STORAGE_KEY, null);
