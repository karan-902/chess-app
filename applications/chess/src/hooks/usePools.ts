import { useState, useEffect } from "react";
import { callAPIInterface, showApiErrorToast } from "@/utils";
import { useGame } from "@/hooks/useGame";
import type { IPoolResponse } from "@gopvp/common/src/types/response";

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
                        `/matchmaking/pools?game=${game}`,
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
