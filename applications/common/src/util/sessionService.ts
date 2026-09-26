import localforage from "localforage";

type TSessionListener = (session: unknown) => void;

const SESSION_KEY = "session";
const sessionStore = localforage.createInstance({
 name: "gopvp",
 storeName: "session",
});

let cachedSession: unknown = null;
const listeners = new Set<TSessionListener>();

const setCachedSession = (session: unknown) => {
 cachedSession = session;
 listeners.forEach((listener) => listener(session));
};

const sessionService = {
 init: async <TSession>() => {
  setCachedSession(await sessionStore.getItem<TSession>(SESSION_KEY));
  return cachedSession as TSession | null;
 },
 loadSession: async <TSession>() => cachedSession as TSession | null,
 saveSession: async <TSession>(session: TSession) => {
  setCachedSession(session);
  await sessionStore.setItem(SESSION_KEY, session);
 },
 updateSession: async <TSession>(changes: Partial<TSession>) => {
  if (!cachedSession) return;
  await sessionService.saveSession({
   ...(cachedSession as TSession),
   ...changes,
  });
 },
 deleteSession: async () => {
  setCachedSession(null);
  await sessionStore.removeItem(SESSION_KEY);
 },
 subscribe: <TSession>(listener: (session: TSession | null) => void) => {
  listeners.add(listener as TSessionListener);
  return () => listeners.delete(listener as TSessionListener);
 },
};

export default sessionService;
// Blue => #081439
// Yellow => #D4B446
