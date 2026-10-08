import { useEffect, useState } from "react";
import ResultSheet from "@gopvp/app/src/components/common/ResultSheet";
import { useGame } from "@gopvp/app/src/hooks/useGame";
import {
 callAPIInterface,
 showApiErrorToast,
} from "@gopvp/common/src/util/api";
import {
 shortenUsername,
 formatAmount,
 formatNumber,
} from "@gopvp/common/src/util/format";
import { scoreText } from "@gopvp/common/src/constants/message";
import {
 winsText,
 bestStreakText,
 currentStreakText,
} from "@gopvp/app/src/constants/message";
import type { ILeaderboardPlayerResponse } from "@gopvp/common/src/types/response";
import type { IPlayerRowSheetProps } from "@gopvp/common/src/types/component";
import { ENDPOINTS } from "@gopvp/common/src/constants/endpoint";
import { useReduxSelector } from "@gopvp/app/src/redux/hooks";

export default function PlayerRowSheet({
 playerId,
 onClose,
}: IPlayerRowSheetProps) {
 const { game, gameLabel } = useGame();
 const scope = useReduxSelector((state) => state.game.leaderboardScope);
 const [stats, setStats] = useState<ILeaderboardPlayerResponse | null>(null);

 useEffect(() => {
  if (!playerId) return;
  let isCancelled = false;
  const loadStats = async () => {
   setStats(null);
   try {
    const res = await callAPIInterface<ILeaderboardPlayerResponse, undefined>(
     "GET",
     `${ENDPOINTS.LEADERBOARD}/${playerId}?game=${game}&scope=${scope}`,
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
 }, [playerId, game, scope, onClose]);

 return (
  <ResultSheet
   open={!!playerId}
   onClose={onClose}
   tone="gold"
   title={stats ? shortenUsername(stats.username) : undefined}
   subtitle={gameLabel}
   amount={stats ? formatAmount(stats.gross_income) : undefined}
   tiles={
    stats && [
     { label: scoreText, value: formatNumber(stats.score) },
     { label: winsText, value: stats.wins },
     { label: bestStreakText, value: stats.best_streak },
     { label: currentStreakText, value: stats.current_streak },
    ]
   }
   skeletonTiles={4}
   customClass="gold-foil"
  />
 );
}
