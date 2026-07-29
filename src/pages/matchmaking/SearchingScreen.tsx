import { useEffect, useState } from "react";
import { X } from "lucide-react";
import clsx from "clsx";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import Button from "../../components/base/Button/Button";
import { CATEGORY_META, QUEUE_TIMEOUT_SECONDS } from "@/constants/config";
import { formateAmount, formateTimeControl } from "@/utils/formate";
import {
    matchmakingSearchingOpponentFound,
    matchmakingSearchingFindingOpponent,
    matchmakingSearchingStartingGame,
    matchmakingSearchingTimeLeft,
    matchmakingSearchingStakeLabel,
    matchmakingSearchingPrizeLabel,
    matchmakingSearchingCancelButton,
} from "@/components/messages";
import type { Pool } from "@/types/types";
import type { MatchmakingStatus } from "@/hooks/useMatchmaking";

interface ISearchingScreenProps {
    pool: Pool;
    status: MatchmakingStatus;
    onCancel: () => void;
}

// Purely visual — mirrors the server's own queue timeout so the wait feels
// active, but only the server's queue_timeout event actually ends a search.
function useCountdown(totalSeconds: number) {
    const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
    useEffect(() => {
        setSecondsLeft(totalSeconds);
        const id = setInterval(() => {
            setSecondsLeft((s) => Math.max(0, s - 1));
        }, 1000);
        return () => clearInterval(id);
    }, [totalSeconds]);
    return secondsLeft;
}

export default function SearchingScreen({
    pool,
    status,
    onCancel,
}: ISearchingScreenProps) {
    const secondsLeft = useCountdown(QUEUE_TIMEOUT_SECONDS[pool.category]);
    const isFound = status === "found";
    const stake = formateAmount(pool.stake, pool.currency);
    const prize = formateAmount(pool.prize, pool.currency);
    const timeLabel = formateTimeControl(pool.time);
    const cat = CATEGORY_META[pool.category];

    return (
        <Box customClass={clsx("searching-screen", isFound && "found")}>
            <Box customClass="searching-ring-wrap">
                <Box customClass="searching-ring" />
                <Box customClass="searching-ring searching-ring--delay" />
                <Box customClass="searching-ring-inner">
                    <Text as="span" customClass="searching-ring-icon">
                        ♟
                    </Text>
                </Box>
            </Box>

            <Box customClass="searching-text-group">
                <Text as="h2" customClass="searching-title">
                    {isFound
                        ? matchmakingSearchingOpponentFound
                        : matchmakingSearchingFindingOpponent}
                </Text>
                <Text as="p" customClass="searching-sub">
                    {isFound
                        ? matchmakingSearchingStartingGame
                        : matchmakingSearchingTimeLeft(secondsLeft, stake)}
                </Text>
            </Box>

            <Box customClass="searching-chips">
                <Box customClass="searching-chip">
                    <Text as="span" customClass="searching-chip-label">
                        {matchmakingSearchingStakeLabel}
                    </Text>
                    <Text as="span" customClass="searching-chip-value">
                        {stake}
                    </Text>
                </Box>
                <Box customClass="searching-chip">
                    <Text as="span" customClass="searching-chip-label">
                        {matchmakingSearchingPrizeLabel}
                    </Text>
                    <Text
                        as="span"
                        customClass="searching-chip-value searching-chip-value--gold"
                    >
                        {prize}
                    </Text>
                </Box>
                <Box customClass="searching-chip">
                    <Text as="span" customClass="searching-chip-label">
                        {cat.emoji} {cat.label}
                    </Text>
                    <Text as="span" customClass="searching-chip-value">
                        {timeLabel}
                    </Text>
                </Box>
            </Box>

            {!isFound && (
                <Button
                    variant="ghost"
                    customClass="searching-cancel-btn"
                    onClick={onCancel}
                >
                    <X size={14} />
                    {matchmakingSearchingCancelButton}
                </Button>
            )}
        </Box>
    );
}
