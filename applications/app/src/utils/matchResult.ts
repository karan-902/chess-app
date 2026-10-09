import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { firebaseApp, firestore } from "@gopvp/app/src/config/firebase";
import { firebaseProjectId } from "@gopvp/common/src/constants/env";
import { FIRESTORE_COLLECTIONS } from "@gopvp/common/src/constants/endpoint";
import type {
 IActiveGameResponse,
 IMatchResultResponse,
} from "@gopvp/common/src/types/response";

function subscribeUserDoc<TData>(
 userId: string | undefined,
 pathSegments: string[],
 onData: (data: TData | null) => void,
): () => void {
 if (!firebaseProjectId || !userId) return () => {};
 let unsubscribeDoc = () => {};
 const unsubscribeAuth = onAuthStateChanged(getAuth(firebaseApp), (user) => {
  unsubscribeDoc();
  unsubscribeDoc = () => {};
  if (user?.uid !== userId) return;
  const [collection, ...rest] = pathSegments;
  unsubscribeDoc = onSnapshot(
   doc(firestore, collection, ...rest),
   (snapshot) =>
    onData(snapshot.exists() ? (snapshot.data() as TData) : null),
   (err) => console.error(err),
  );
 });
 return () => {
  unsubscribeAuth();
  unsubscribeDoc();
 };
}

export function subscribeMatchResult(
 matchId: string,
 userId: string | undefined,
 onResult: (result: IMatchResultResponse) => void,
): () => void {
 return subscribeUserDoc<IMatchResultResponse>(
  userId,
  [
   FIRESTORE_COLLECTIONS.MATCH_RESULTS,
   matchId,
   FIRESTORE_COLLECTIONS.MATCH_RESULT_PLAYERS,
   userId ?? "",
  ],
  (result) => {
   if (result) onResult(result);
  },
 );
}

export function subscribeActiveGame(
 userId: string | undefined,
 onActiveGame: (activeGame: IActiveGameResponse | null) => void,
): () => void {
 return subscribeUserDoc<IActiveGameResponse>(
  userId,
  [FIRESTORE_COLLECTIONS.ACTIVE_GAMES, userId ?? ""],
  onActiveGame,
 );
}
