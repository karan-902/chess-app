import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomDrawer from "@gopvp/common/src/components/Drawer/Drawer";
import { formatAmount } from "@gopvp/common/src/util/format";
import { RESULT_ICONS } from "@gopvp/chess/src/constants/icon";
import { RESULT_HEADERS } from "@gopvp/chess/src/constants/label";
import type { IGameOverOverlayProps } from "@gopvp/chess/src/types/component";
import {
 settlementText,
 vsOpponentText,
} from "@gopvp/chess/src/constants/message";
import { backText, scoreText } from "@gopvp/common/src/constants/message";

export default function GameOverOverlay({
 gameEnded,
 outcome,
 isPvc,
 reasonLabel,
 opponentName,
 onNewGame,
}: IGameOverOverlayProps) {
 const scoreChange = Math.round(gameEnded.score_change);
 const ResultIcon = RESULT_ICONS[outcome];
 const subtitle = [reasonLabel, opponentName && vsOpponentText(opponentName)]
  .filter(Boolean)
  .join(" · ");

 return (
  <CustomDrawer anchor="bottom" open onClose={onNewGame}>
   <Box customClass="matchmaking-searching">
    <Box customClass={classNames("gr-result-emblem", outcome)}>
     <ResultIcon strokeWidth={2} />
    </Box>
    <Text customClass={classNames("gr-overlay-title", outcome)}>
     {RESULT_HEADERS[outcome]}
    </Text>
    {!isPvc && subtitle && (
     <Text customClass="description">{subtitle}</Text>
    )}
    {(gameEnded.amount !== 0 || scoreChange !== 0) && (
     <Box customClass="gr-settlement">
      <Box customClass="gr-settlement-item">
       <Text customClass={classNames("gr-settlement-val", outcome)}>
        {gameEnded.amount > 0 && "+"}
        {formatAmount(gameEnded.amount)}
       </Text>
       <Text customClass="gr-settlement-lbl caption">{settlementText}</Text>
      </Box>
      <Box customClass="gr-settlement-item">
       <Text customClass="gr-settlement-val">
        {scoreChange >= 0 ? `+${scoreChange}` : scoreChange}
       </Text>
       <Text customClass="gr-settlement-lbl caption">{scoreText}</Text>
      </Box>
     </Box>
    )}
    <Button
     type="button"
     variant="contained"
     fullWidth
     customClass="game-cta"
     onClick={onNewGame}
    >
     {backText}
    </Button>
   </Box>
  </CustomDrawer>
 );
}
