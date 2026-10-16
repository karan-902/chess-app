import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomDrawer from "@gopvp/common/src/components/Drawer/Drawer";
import { MATCH_OUTCOME_SUBTITLES } from "@gopvp/common/src/constants/mapper";
import { backText, chessText } from "@gopvp/common/src/constants/message";
import { GAME_LOGO_PATH } from "@gopvp/chess/src/constants/asset";
import PayoutTicket from "@gopvp/chess/src/pages/play/PayoutTicket";
import type { IGameOverOverlayProps } from "@gopvp/chess/src/types/component";

export default function GameOverOverlay({
 onNewGame,
 ...ticket
}: IGameOverOverlayProps) {
 const { outcome, opponentName } = ticket;
 const tone = outcome === "win" || outcome === "loss" ? outcome : "neutral";

 return (
  <CustomDrawer
   anchor="bottom"
   open
   onClose={onNewGame}
   customClass={classNames("result-sheet game-over-sheet", tone)}
  >
   <Box customClass="public-heading">
    <img className="payout-logo" src={GAME_LOGO_PATH} alt={chessText} />
    <Text component="h2" customClass="public-title">
     {MATCH_OUTCOME_SUBTITLES[outcome](opponentName)}
    </Text>
   </Box>
   <PayoutTicket {...ticket} />
   <Button
    type="button"
    variant="contained"
    fullWidth
    customClass="game-cta play-cta"
    onClick={onNewGame}
   >
    {backText}
   </Button>
  </CustomDrawer>
 );
}
