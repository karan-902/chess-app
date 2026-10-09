import { initializeApp } from "firebase/app";
import {
 initializeFirestore,
 persistentLocalCache,
 persistentMultipleTabManager,
} from "firebase/firestore";
import {
 firebaseApiKey,
 firebaseAppId,
 firebaseAuthDomain,
 firebaseProjectId,
} from "@gopvp/common/src/constants/env";

export const firebaseApp = initializeApp({
 apiKey: firebaseApiKey,
 authDomain: firebaseAuthDomain,
 projectId: firebaseProjectId,
 appId: firebaseAppId,
});

export const firestore = initializeFirestore(firebaseApp, {
 localCache: persistentLocalCache({
  tabManager: persistentMultipleTabManager(),
 }),
});
