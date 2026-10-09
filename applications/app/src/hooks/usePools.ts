import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "@gopvp/app/src/config/firebase";
import {
 callAPIInterface,
 showApiErrorToast,
} from "@gopvp/common/src/util/api";
import { useGame } from "@gopvp/app/src/hooks/useGame";
import type {
 IPoolResponse,
 IPoolsDocResponse,
} from "@gopvp/common/src/types/response";
import {
 ENDPOINTS,
 FIRESTORE_COLLECTIONS,
} from "@gopvp/common/src/constants/endpoint";
import { firebaseProjectId } from "@gopvp/common/src/constants/env";

export function usePools() {
 const { game } = useGame();
 const [pools, setPools] = useState<IPoolResponse[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(false);

 useEffect(() => {
  const loadPools = async () => {
   try {
    setPools(
     await callAPIInterface<IPoolResponse[], undefined>(
      "GET",
      `${ENDPOINTS.POOLS}?game=${game}`,
     ),
    );
   } catch (err) {
    setError(true);
    setPools([]);
    showApiErrorToast(err);
   } finally {
    setLoading(false);
   }
  };
  loadPools();
 }, [game]);

 useEffect(() => {
  if (!firebaseProjectId) return;
  return onSnapshot(
   doc(firestore, FIRESTORE_COLLECTIONS.POOLS, game),
   (snapshot) => {
    const poolsDoc = snapshot.data() as IPoolsDocResponse | undefined;
    if (poolsDoc) setPools(poolsDoc.pools);
   },
   (err) => console.error(err),
  );
 }, [game]);

 return { pools, loading, error };
}
