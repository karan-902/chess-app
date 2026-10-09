import { useState } from "react";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomDrawer from "@gopvp/common/src/components/Drawer/Drawer";
import { formatAmount } from "@gopvp/common/src/util/format";
import { GAME_LOGO_PATH } from "@gopvp/chess/src/constants/asset";
import { MATCH_OUTCOME_SUBTITLES } from "@gopvp/common/src/constants/mapper";
import type { IGameOverOverlayProps } from "@gopvp/chess/src/types/component";
import { backText, chessText } from "@gopvp/common/src/constants/message";

export default function GameOverOverlay({
 gameEnded,
 outcome,
 isPvc,
 opponentName,
 onNewGame,
}: IGameOverOverlayProps) {
 const [isLogoLoaded, setIsLogoLoaded] = useState(false);
 const tone = outcome === "win" || outcome === "loss" ? outcome : "neutral";
 const scoreChange = Math.round(gameEnded.score_change);
 const tiles = [
  {
   value: `${gameEnded.amount > 0 ? "+" : ""}${formatAmount(gameEnded.amount)}`,
   change: gameEnded.amount,
  },
  ...(scoreChange === 0
   ? []
   : [
      {
       value: `${scoreChange > 0 ? "+" : ""}${scoreChange}`,
       change: scoreChange,
      },
     ]),
 ];

 return (
  <CustomDrawer
   anchor="bottom"
   open
   onClose={onNewGame}
   customClass={classNames("result-sheet game-over-sheet", tone)}
  >
   <Box customClass="result-hero">
    {!isLogoLoaded && (
     <Skeleton variant="rounded" customClass="result-logo-skeleton" />
    )}
    <img
     src={GAME_LOGO_PATH}
     alt=""
     hidden={!isLogoLoaded}
     onLoad={() => setIsLogoLoaded(true)}
    />
    <Text customClass="result-title">
     {isLogoLoaded ? chessText : <Skeleton customClass="text" width={140} />}
    </Text>
    <Text customClass="result-subtitle">
     {isLogoLoaded ? (
      MATCH_OUTCOME_SUBTITLES[outcome](opponentName)
     ) : (
      <Skeleton customClass="text" width={140} />
     )}
    </Text>
   </Box>

   {!isPvc && (
    <Box customClass="result-tiles">
     {tiles.map(({ value, change }) => (
      <Box key={value} customClass="result-tile">
       <Text
        customClass={classNames("result-tile-val", {
         pos: change > 0,
         neg: change < 0,
        })}
       >
        {isLogoLoaded ? value : <Skeleton customClass="text" width={50} />}
       </Text>
      </Box>
     ))}
    </Box>
   )}

   <Button
    type="button"
    variant="contained"
    fullWidth
    customClass="game-cta result-back-btn"
    onClick={onNewGame}
   >
    {backText}
   </Button>
  </CustomDrawer>
 );
}
