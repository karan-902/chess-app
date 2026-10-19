import { useEffect } from "react";
import { getAuth, signInWithCustomToken, signOut } from "firebase/auth";
import { firebaseApp } from "@gopvp/app/src/config/firebase";
import { useReduxSelector } from "@gopvp/app/src/redux/hooks";
import { callAPIInterface } from "@gopvp/common/src/util/api";
import { ENDPOINTS } from "@gopvp/common/src/constants/endpoint";
import { firebaseProjectId } from "@gopvp/common/src/constants/env";
import type { IFirebaseTokenResponse } from "@gopvp/common/src/types/response";

export function useFirebaseAuth() {
 const userId = useReduxSelector((state) =>
  state.auth.isLoggedIn ? state.auth.session?.id : undefined,
 );

 useEffect(() => {
  if (!firebaseProjectId) return;
  const auth = getAuth(firebaseApp);
  let isCancelled = false;

  const syncFirebaseUser = async () => {
   try {
    await auth.authStateReady();
    if (isCancelled) return;
    if (!userId) {
     if (auth.currentUser) await signOut(auth);
     return;
    }
    if (auth.currentUser?.uid === userId) return;
    const { token } = await callAPIInterface<IFirebaseTokenResponse>(
     "GET",
     ENDPOINTS.FIREBASE_TOKEN,
    );
    if (!isCancelled) await signInWithCustomToken(auth, token);
   } catch (err) {
    console.error(err);
   }
  };

  syncFirebaseUser();
  return () => {
   isCancelled = true;
  };
 }, [userId]);
}
