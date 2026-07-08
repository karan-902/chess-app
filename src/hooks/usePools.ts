import { useState, useEffect } from "react";
import { callAPIInterface } from "@/utils";
import type { Pool } from "@/types/types";

export interface PoolStats {
    online: number;
    games: number;
    liquidity: string;
}

export function usePools() {
    const [pools, setPools] = useState<Pool[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        callAPIInterface<undefined, Pool[]>("GET", "/pools")
            .then(setPools)
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, []);

    const games = pools.reduce((sum, p) => sum + p.active, 0);
    const ethLocked = pools.reduce((sum, p) => sum + p.stake_amount * p.active, 0);
    const liquidity =
        ethLocked >= 100
            ? `${(ethLocked / 1000).toFixed(1)}K ETH`
            : `${ethLocked.toFixed(2)} ETH`;

    return { pools, loading, error, games, liquidity };
}
