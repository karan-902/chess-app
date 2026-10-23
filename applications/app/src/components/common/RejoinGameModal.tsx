import { useEffect, useState } from "react";
import CustomDrawer from "@gopvp/common/src/components/Drawer/Drawer";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import SheetActions from "@gopvp/common/src/components/SheetActions/SheetActions";
import { icons } from "@gopvp/common/src/components/images";
import { useCountdown } from "@gopvp/common/src/hooks/useCountdown";
import { useSocket } from "@gopvp/app/src/context/SocketContext";
import { useReduxSelector, useReduxDispatch } from "@gopvp/app/src/redux/hooks";
import { setActiveGame } from "@gopvp/app/src/redux/socketModals/slice";
import { showAckErrorToast } from "@gopvp/common/src/util/api";
import {
 formatAmount,
 formatMMSS,
 shortenUsername,
} from "@gopvp/common/src/util/format";
import { buildMatchUrl, isGameSlug } from "@gopvp/app/src/utils";
import { subscribeMatchResult } from "@gopvp/app/src/utils/matchResult";
import { navigateTo } from "@gopvp/common/src/util/navigationService";
import {
 rejoinMatchText,
 matchStillLiveText,
 feeText,
 opponentText,
 rejoinNowText,
 exitText,
 forfeitGameText,
 leavingForfeitsText,
 forfeitAndExitText,
 matchOverText,
 amountText,
} from "@gopvp/app/src/constants/message";
import {
 keepPlayingText,
 closeText,
} from "@gopvp/common/src/constants/message";
import {
 MATCH_RESULT_OUTCOMES,
 MATCH_OUTCOME_SUBTITLES,
} from "@gopvp/common/src/constants/mapper";
import { SOCKET_EVENTS } from "@gopvp/common/src/constants/event";
import type { IMatchResultResponse } from "@gopvp/common/src/types/response";

export default function RejoinGameModal() {
 const dispatch = useReduxDispatch();
 const { socket } = useSocket();
 const activeGame = useReduxSelector((state) => state.socketModals.activeGame);
 const userId = useReduxSelector((state) => state.auth.session?.id);
 const deviceHandoff = useReduxSelector(
  (state) => state.socketModals.deviceHandoff,
 );
 const openingMatchId = useReduxSelector(
  (state) => state.socketModals.openingMatchId,
 );
 const [confirmingExit, setConfirmingExit] = useState(false);
 const [matchResult, setMatchResult] = useState<IMatchResultResponse | null>(
  null,
 );
 const [lastActiveGame, setLastActiveGame] = useState(activeGame);
 const lastMatchId = lastActiveGame?.match_id;

 useEffect(() => {
  if (activeGame) setLastActiveGame(activeGame);
 }, [activeGame]);

 useEffect(() => {
  if (!lastMatchId) return;
  return subscribeMatchResult(lastMatchId, userId, setMatchResult);
 }, [lastMatchId, userId]);

 const shownGame = activeGame ?? (matchResult ? lastActiveGame : null);
 const forfeitSeconds = useCountdown(shownGame?.forfeit_at ?? null);

 if (
  !shownGame ||
  deviceHandoff !== null ||
  shownGame.match_id === openingMatchId
 ) {
  return null;
 }

 const { opponent } = shownGame;
 const opponentName = shortenUsername(opponent.username);
 const betAmount = formatAmount(shownGame.bet);

 const clearActiveGame = () => {
  setConfirmingExit(false);
  setLastActiveGame(null);
  dispatch(setActiveGame(null));
 };

 const handleForfeit = () => {
  socket?.emit(SOCKET_EVENTS.GAME_REJOIN_DECLINED, showAckErrorToast);
  clearActiveGame();
 };

 const handleCloseResult = () => {
  setMatchResult(null);
  clearActiveGame();
 };

 const handleRejoin = () => {
  clearActiveGame();
  if (isGameSlug(shownGame.game_slug)) {
   navigateTo(buildMatchUrl(shownGame.game_slug, shownGame.match_id), {
    replace: true,
   });
  }
 };

 const renderHead = (title: string, description: string) => (
  <Box customClass="match-head">
   <Box customClass="room-heading">
    <Text customClass="dialog-title">{title}</Text>
    <Text customClass="description">{description}</Text>
   </Box>
   {forfeitSeconds !== null && !matchResult && (
    <Text customClass="match-timer low">
     <icons.timer />
     {formatMMSS(forfeitSeconds)}
    </Text>
   )}
  </Box>
 );

 return (
  <CustomDrawer
   anchor="bottom"
   open
   onClose={() => {}}
   hideCloseIcon
   customClass="rejoin-sheet"
  >
   {matchResult ? (
    <>
     {renderHead(
      matchOverText,
      MATCH_OUTCOME_SUBTITLES[MATCH_RESULT_OUTCOMES[matchResult.result]](
       opponentName,
      ),
     )}
     <Box customClass="stat-row">
      <Text component="span" customClass="stat-title">
       {amountText}
      </Text>
      <Text component="span" customClass="stat-val">
       {`${matchResult.amount > 0 ? "+" : ""}${formatAmount(matchResult.amount)}`}
      </Text>
     </Box>
     <SheetActions>
      <Button variant="contained" fullWidth onClick={handleCloseResult}>
       {closeText}
      </Button>
     </SheetActions>
    </>
   ) : confirmingExit ? (
    <>
     {renderHead(forfeitGameText, leavingForfeitsText(betAmount))}
     <SheetActions
      cancelLabel={forfeitAndExitText}
      onCancel={handleForfeit}
     >
      <Button
       variant="contained"
       fullWidth
       onClick={() => setConfirmingExit(false)}
      >
       {keepPlayingText}
      </Button>
     </SheetActions>
    </>
   ) : (
    <>
     {renderHead(rejoinMatchText, matchStillLiveText(opponentName))}
     <Box customClass="stat-row">
      <Text component="span" customClass="stat-title">
       {opponentText}
      </Text>
      <Text component="span" customClass="stat-val">
       {opponentName} ({Math.round(opponent.score)})
      </Text>
     </Box>
     <Box customClass="stat-row">
      <Text component="span" customClass="stat-title">
       {feeText}
      </Text>
      <Text component="span" customClass="stat-val">
       {betAmount}
      </Text>
     </Box>
     <SheetActions
      cancelLabel={exitText}
      onCancel={() => setConfirmingExit(true)}
     >
      <Button variant="contained" fullWidth onClick={handleRejoin}>
       {rejoinNowText}
      </Button>
     </SheetActions>
    </>
   )}
  </CustomDrawer>
 );
}
