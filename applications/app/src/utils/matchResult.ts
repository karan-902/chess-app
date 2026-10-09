import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { firebaseApp, firestore } from "@gopvp/app/src/config/firebase";
import { firebaseProjectId } from "@gopvp/common/src/constants/env";
import { FIRESTORE_COLLECTIONS } from "@gopvp/common/src/constants/endpoint";
import type { IMatchResultResponse } from "@gopvp/common/src/types/response";

export function subscribeMatchResult(
 matchId: string,
 userId: string | undefined,
 onResult: (result: IMatchResultResponse) => void,
): () => void {
 if (!firebaseProjectId || !userId) return () => {};
 let unsubscribeDoc = () => {};
 const unsubscribeAuth = onAuthStateChanged(getAuth(firebaseApp), (user) => {
  unsubscribeDoc();
  unsubscribeDoc = () => {};
  if (user?.uid !== userId) return;
  unsubscribeDoc = onSnapshot(
   doc(
    firestore,
    FIRESTORE_COLLECTIONS.MATCH_RESULTS,
    matchId,
    FIRESTORE_COLLECTIONS.MATCH_RESULT_PLAYERS,
    userId,
   ),
   (snapshot) => {
    if (snapshot.exists()) onResult(snapshot.data() as IMatchResultResponse);
   },
   (err) => console.error(err),
  );
 });
 return () => {
  unsubscribeAuth();
  unsubscribeDoc();
 };
}
