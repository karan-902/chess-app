import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import Button from "../../components/base/Button/Button";
import type { Pool } from "@/types/types";
import type { MatchmakingStatus } from "@/hooks/useMatchmaking";

interface ISearchingScreenProps {
    pool: Pool;
    status: MatchmakingStatus;
    onCancel: () => void;
}

function useElapsed() {
    const [elapsed, setElapsed] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setElapsed(s => s + 1), 1000);
        return () => clearInterval(id);
    }, []);
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    return m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${s}s`;
}

export default function SearchingScreen({ pool, status, onCancel }: ISearchingScreenProps) {
    const elapsed = useElapsed();
    const isFound = status === "found";

    return (
        <Box customClass="searching-screen">
            {/* Pulsing ring */}
            <Box customClass="searching-ring-wrap">
                <Box customClass="searching-ring" />
                <Box customClass="searching-ring searching-ring--delay" />
                <Box customClass="searching-ring-inner">
                    <Text as="span" customClass="searching-ring-icon">♟</Text>
                </Box>
            </Box>

            {/* Status text */}
            <Box customClass="searching-text-group">
                <Text as="h2" customClass="searching-title">
                    {isFound ? "Opponent found!" : "Finding opponent…"}
                </Text>
                <Text as="p" customClass="searching-sub">
                    {isFound
                        ? "Starting game now"
                        : `Searching for ${elapsed} · ${pool.stake} stake`}
                </Text>
            </Box>

            {/* Pool info chips */}
            <Box customClass="searching-chips">
                <Box customClass="searching-chip">
                    <Text as="span" customClass="searching-chip-label">Stake</Text>
                    <Text as="span" customClass="searching-chip-value">{pool.stake}</Text>
                </Box>
                <Box customClass="searching-chip">
                    <Text as="span" customClass="searching-chip-label">Prize</Text>
                    <Text as="span" customClass="searching-chip-value searching-chip-value--gold">{pool.prize}</Text>
                </Box>
                <Box customClass="searching-chip">
                    <Text as="span" customClass="searching-chip-label">Time</Text>
                    <Text as="span" customClass="searching-chip-value">{pool.time}</Text>
                </Box>
            </Box>

            {/* Cancel */}
            {!isFound && (
                <Button variant="ghost" customClass="searching-cancel-btn" onClick={onCancel}>
                    <X size={14} />
                    Cancel search
                </Button>
            )}
        </Box>
    );
}
