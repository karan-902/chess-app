import classNames from "classnames";
import Text from "@gopvp/common/src/components/Text/Text";
import {
 Crown,
 DollarSign,
 Flame,
 Medal,
 Trophy,
} from "@gopvp/common/src/components/images";
import { GAME_LOGO_PATH } from "@gopvp/chess/src/constants/asset";
import type { ILeaderboardPlayerResponse } from "@gopvp/common/src/types/response";
import type { IChessLogoProps, IStatRow } from "@gopvp/app/src/types/component";

export const STAT_ICONS: Record<
 Exclude<keyof ILeaderboardPlayerResponse, "username">,
 Pick<IStatRow, "icon" | "tone">
> = {
 score: { icon: Crown, tone: "gold" },
 wins: { icon: Trophy, tone: "gold" },
 current_streak: { icon: Flame, tone: "gold" },
 best_streak: { icon: Medal, tone: "gold" },
 gross_income: { icon: DollarSign, tone: "gold" },
};

export function ChessLogo({ size = 42, muted = false }: IChessLogoProps) {
 return (
  <Text
   customClass={classNames("chess-logo", muted && "muted")}
   sx={{ gap: size * 0.38 }}
   component="span"
  >
   <img src={GAME_LOGO_PATH} width={size} height={size} alt="" />
  </Text>
 );
}
