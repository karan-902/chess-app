import { useEffect, useState } from "react";
import CustomDrawer from "@gopvp/common/src/components/Drawer/Drawer";
import Text from "@gopvp/common/src/components/Text/Text";
import StatList from "@gopvp/app/src/components/common/StatList";
import { useGame } from "@gopvp/app/src/hooks/useGame";
import {
 callAPIInterface,
 showApiErrorToast,
} from "@gopvp/common/src/util/api";
import { shortenUsername, formatAmount } from "@gopvp/common/src/util/format";
import { scoreText } from "@gopvp/common/src/constants/message";
import {
 grossIncomeText,
 winsText,
 bestStreakText,
} from "@gopvp/app/src/constants/message";
import type { ILeaderboardPlayerResponse } from "@gopvp/common/src/types/response";
import type { IPlayerRowSheetProps } from "@gopvp/common/src/types/component";
import { PLAYER_STATS_SKELETON_ROWS } from "@gopvp/app/src/constants/limit";
import { ENDPOINTS } from "@gopvp/common/src/constants/endpoint";

export default function PlayerRowSheet({
 playerId,
 onClose,
}: IPlayerRowSheetProps) {
 const { game } = useGame();
 const [stats, setStats] = useState<ILeaderboardPlayerResponse | null>(null);

 useEffect(() => {
  if (!playerId) return;
  let isCancelled = false;
  const loadStats = async () => {
   setStats(null);
   try {
    const res = await callAPIInterface<ILeaderboardPlayerResponse, undefined>(
     "GET",
     `${ENDPOINTS.LEADERBOARD}/${playerId}?game=${game}`,
    );
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
  <CustomDrawer anchor="bottom" open={!!playerId} onClose={onClose}>
   {stats && (
    <Text customClass="sheet-title dialog-title">
     {shortenUsername(stats.username)}
    </Text>
   )}
   <StatList rows={statRows} skeletonRows={PLAYER_STATS_SKELETON_ROWS} />
  </CustomDrawer>
 );
}
