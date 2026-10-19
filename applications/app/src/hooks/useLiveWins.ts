import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "@gopvp/app/src/config/firebase";
import { useGame } from "@gopvp/app/src/hooks/useGame";
import type {
 ILiveWinsDocResponse,
 IWorldMatchHistoryResponse,
} from "@gopvp/common/src/types/response";
import { FIRESTORE_COLLECTIONS } from "@gopvp/common/src/constants/endpoint";
import { firebaseProjectId } from "@gopvp/common/src/constants/env";
import { firebaseConfigMissingText } from "@gopvp/app/src/constants/message";

export function useLiveWins() {
 const { game } = useGame();
 const [liveWins, setLiveWins] = useState<IWorldMatchHistoryResponse[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(false);

 useEffect(() => {
  if (!firebaseProjectId) {
   console.error(firebaseConfigMissingText);
   setError(true);
   setLoading(false);
   return;
  }
  setLoading(true);
  setError(false);
  return onSnapshot(
   doc(firestore, FIRESTORE_COLLECTIONS.LIVE_WINS, game),
   (snapshot) => {
    setLiveWins(
     (snapshot.data() as ILiveWinsDocResponse | undefined)?.matches ?? [],
    );
    setLoading(false);
   },
   (err) => {
    console.error(err);
    setError(true);
    setLiveWins([]);
    setLoading(false);
   },
  );
 }, [game]);

 return { liveWins, loading, error };
}
