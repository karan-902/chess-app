import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import { formatAmount } from "@gopvp/common/src/util/format";
import type { IGameOverOverlayProps } from "@gopvp/chess/src/types/component";
import { settlementText } from "@gopvp/chess/src/constants/message";
import { backText, scoreText } from "@gopvp/common/src/constants/message";

export default function GameOverOverlay({
 gameEnded,
 reasonLabel,
 resultHeader,
 isWinner,
 isDrawResult,
 onNewGame,
}: IGameOverOverlayProps) {
 const scoreChange = Math.round(gameEnded.score_change);

 return (
  <Box customClass="gr-overlay">
   <Text customClass="gr-overlay-badge">{reasonLabel}</Text>
   <Text customClass="gr-overlay-title">{resultHeader}</Text>
   {(gameEnded.amount !== 0 || scoreChange !== 0) && (
    <Box customClass="gr-settlement">
     <Box customClass="gr-settlement-item">
      <Text
       customClass={classNames(
        "gr-settlement-val",
        isWinner && "win",
        !isWinner && !isDrawResult && "loss",
       )}
      >
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
   <Box customClass="gr-overlay-actions">
    <Button customClass="gr-overlay-btn secondary" onClick={onNewGame}>
     {backText}
    </Button>
   </Box>
  </Box>
 );
}
