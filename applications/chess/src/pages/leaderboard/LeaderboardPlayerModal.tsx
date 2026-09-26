import { useEffect, useState } from "react";
import CustomModal from "@/components/base/Modal/Modal";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Card from "@/components/base/Card/Card";
import StatRowSkeleton from "@/components/common/StatRowSkeleton";
import { useGame } from "@/hooks/useGame";
import { callAPIInterface, showApiErrorToast, shortenUsername } from "@/utils";
import { formatAmount } from "@/utils/format";
import {
    leaderboardPlayerScoreLabel,
    leaderboardPlayerGrossIncomeLabel,
    leaderboardPlayerWinsLabel,
    leaderboardPlayerLoadFailed,
    matchesStatsBestStreakLabel,
} from "@/constants/messages";
import type { ILeaderboardPlayerStatsResponse } from "@/types/types";
import type { ILeaderboardPlayerModalProps } from "@/types/components";

const STAT_SKELETON_ROWS = 4;

export default function LeaderboardPlayerModal({
    playerId,
    onClose,
}: ILeaderboardPlayerModalProps) {
    const { game } = useGame();
    const [stats, setStats] = useState<ILeaderboardPlayerStatsResponse | null>(null);

    useEffect(() => {
        if (!playerId) return;
        let isCancelled = false;
        const loadStats = async () => {
            setStats(null);
            try {
                const res = await callAPIInterface<undefined, ILeaderboardPlayerStatsResponse>(
                    "GET",
                    `/leaderboard/${playerId}?game=${game}`,
                );
                if (!isCancelled) setStats(res);
            } catch (err) {
                showApiErrorToast(err, leaderboardPlayerLoadFailed);
                if (!isCancelled) onClose();
            }
        };
        loadStats();
        return () => {
            isCancelled = true;
        };
    }, [playerId, game, onClose]);

    const statRows = stats && [
        { label: leaderboardPlayerScoreLabel, value: Math.round(stats.score) },
        { label: leaderboardPlayerWinsLabel, value: stats.wins },
        { label: matchesStatsBestStreakLabel, value: stats.best_streak },
        { label: leaderboardPlayerGrossIncomeLabel, value: formatAmount(stats.gross_income) },
    ];

    return (
        <CustomModal
            open={!!playerId}
            onClose={onClose}
            title={stats ? shortenUsername(stats.username) : undefined}
        >
            <Card customClass="stat-list">
                {statRows
                    ? statRows.map(({ label, value }) => (
                          <Box key={label} customClass="stat-row">
                              <Text component="span" customClass="stat-title">
                                  {label}
                              </Text>
                              <Text component="span" customClass="stat-val">
                                  {value}
                              </Text>
                          </Box>
                      ))
                    : Array.from({ length: STAT_SKELETON_ROWS }, (_, index) => (
                          <StatRowSkeleton key={index} />
                      ))}
            </Card>
        </CustomModal>
    );
}
