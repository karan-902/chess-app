import { useEffect, useState } from "react";
import CustomModal from "@gopvp/common/src/components/Modal/Modal";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Card from "@gopvp/common/src/components/Card/Card";
import StatRowSkeleton from "@/components/common/StatRowSkeleton";
import { useGame } from "@/hooks/useGame";
import {
 callAPIInterface,
 showApiErrorToast,
} from "@gopvp/common/src/util/api";
import { shortenUsername, formatAmount } from "@gopvp/common/src/util/format";
import {
 scoreText,
 grossIncomeText,
 winsText,
 bestStreakText,
} from "@/constants/messages";
import type { ILeaderboardPlayerResponse } from "@gopvp/common/src/types/response";
import type { ILeaderboardPlayerModalProps } from "@gopvp/common/src/types/component";

const STAT_SKELETON_ROWS = 4;

export default function LeaderboardPlayerModal({
 playerId,
 onClose,
}: ILeaderboardPlayerModalProps) {
 const { game } = useGame();
 const [stats, setStats] = useState<ILeaderboardPlayerResponse | null>(
  null,
 );

 useEffect(() => {
  if (!playerId) return;
  let isCancelled = false;
  const loadStats = async () => {
   setStats(null);
   try {
    const res = await callAPIInterface<
     ILeaderboardPlayerResponse,
     undefined
    >("GET", `/leaderboard/${playerId}?game=${game}`);
    if (!isCancelled) setStats(res);
   } catch (err) {
    showApiErrorToast(err);
    if (!isCancelled) onClose();
   }
  };
  loadStats();
  return () => {
   isCancelled = true;
  };
 }, [playerId, game, onClose]);

 const statRows = stats && [
  { label: scoreText, value: Math.round(stats.score) },
  { label: winsText, value: stats.wins },
  { label: bestStreakText, value: stats.best_streak },
  { label: grossIncomeText, value: formatAmount(stats.gross_income) },
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
