import { useState, useEffect } from "react";
import {
 callAPIInterface,
 showApiErrorToast,
} from "@gopvp/common/src/util/api";
import { useGame } from "@gopvp/app/src/hooks/useGame";
import type { IPoolResponse } from "@gopvp/common/src/types/response";
import { ENDPOINTS } from "@gopvp/common/src/constants/endpoint";

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

 return { pools, loading, error };
}
