export function readStorage(storage: Storage, key: string): string | null {
 try {
  return storage.getItem(key);
 } catch {
  return null;
 }
}

export function writeStorage(
 storage: Storage,
 key: string,
 value: string | null,
) {
 try {
  if (value === null) storage.removeItem(key);
  else storage.setItem(key, value);
 } catch {}
}
