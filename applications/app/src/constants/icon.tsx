import classNames from "classnames";
import Text from "@gopvp/common/src/components/Text/Text";
import { Crown, Medal } from "@gopvp/common/src/components/images";
import { GAME_LOGO_PATH } from "@gopvp/chess/src/constants/asset";
import type { ILeaderboardPlayerResponse } from "@gopvp/common/src/types/response";
import type { IChessLogoProps, IStatRow } from "@gopvp/app/src/types/component";

export const STAT_ICONS: Record<
 Exclude<keyof ILeaderboardPlayerResponse, "username">,
 Pick<IStatRow, "icon" | "tone">
> = {
 score: { icon: Crown, tone: "gold" },
 wins: { icon: Medal, tone: "gold" },
 current_streak: { icon: Medal, tone: "silver" },
 best_streak: { icon: Medal, tone: "silver" },
 gross_income: { icon: Crown, tone: "bronze" },
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
