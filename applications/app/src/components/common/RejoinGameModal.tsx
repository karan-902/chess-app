import { useEffect, useState } from "react";
import CustomDrawer from "@gopvp/common/src/components/Drawer/Drawer";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import { icons } from "@gopvp/common/src/components/images";
import MatchTicket from "@gopvp/app/src/components/common/MatchTicket";
import PayoutTicket from "@gopvp/common/src/components/PayoutTicket/PayoutTicket";
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
 rejoinNowText,
 exitText,
 forfeitGameText,
 leavingForfeitsText,
 forfeitAndExitText,
 matchOverText,
 entryText,
 winText,
 poolMinutesText,
} from "@gopvp/app/src/constants/message";
import {
 keepPlayingText,
 closeText,
} from "@gopvp/common/src/constants/message";
import { MS_PER_MINUTE } from "@gopvp/app/src/constants/limit";
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
 const myName = shortenUsername(
  useReduxSelector((state) => state.auth.session?.username ?? ""),
 );
 const deviceHandoff = useReduxSelector(
  (state) => state.socketModals.deviceHandoff,
 );
 const openingMatchId = useReduxSelector(
  (state) => state.socketModals.openingMatchId,
 );
 const isFindingMatch = useReduxSelector(
  (state) => state.socketModals.isFindingMatch,
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
  isFindingMatch ||
  deviceHandoff !== null ||
  shownGame.match_id === openingMatchId
 ) {
  return null;
 }

 const opponentName = shortenUsername(shownGame.opponent.username);
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

 const sheet = matchResult
  ? {
     title: matchOverText,
     description: MATCH_OUTCOME_SUBTITLES[
      MATCH_RESULT_OUTCOMES[matchResult.result]
     ](opponentName),
     primaryLabel: closeText,
     onPrimary: handleCloseResult,
    }
  : confirmingExit
    ? {
       title: forfeitGameText,
       description: leavingForfeitsText(betAmount),
       primaryLabel: keepPlayingText,
       onPrimary: () => setConfirmingExit(false),
       secondaryLabel: forfeitAndExitText,
       onSecondary: handleForfeit,
      }
    : {
       title: rejoinMatchText,
       description: matchStillLiveText(opponentName),
       primaryLabel: rejoinNowText,
       onPrimary: handleRejoin,
       secondaryLabel: exitText,
       onSecondary: () => setConfirmingExit(true),
      };

 return (
  <CustomDrawer
   anchor="bottom"
   open
   onClose={() => {}}
   hideCloseIcon
   customClass="match-confirm-sheet rejoin-sheet"
  >
   <Box customClass="pool-confirm-slide match-sheet">
    <Box customClass="public-heading">
     <Text component="h2" customClass="public-title" aria-live="polite">
      {sheet.title}
     </Text>
     <Text customClass="page-subtitle public-subtitle">
      {sheet.description}
     </Text>
    </Box>
    {matchResult ? (
     <PayoutTicket
      gameEnded={matchResult}
      outcome={MATCH_RESULT_OUTCOMES[matchResult.result]}
      isPvc={false}
      myName={myName}
      opponentName={opponentName}
     />
    ) : (
     <MatchTicket
      status="found"
      chip={poolMinutesText(Math.round(shownGame.time / MS_PER_MINUTE))}
      stats={[
       { label: entryText, value: betAmount },
       { label: winText, value: formatAmount(shownGame.prize), isWin: true },
      ]}
      myName={myName}
      opponentName={opponentName}
     />
    )}
    {forfeitSeconds !== null && !matchResult && (
     <Text customClass="match-timer low">
      <icons.timer />
      {formatMMSS(forfeitSeconds)}
     </Text>
    )}
    <Box customClass="match-retry">
     <Button
      type="button"
      variant="contained"
      fullWidth
      customClass="game-cta play-cta"
      onClick={sheet.onPrimary}
     >
      {sheet.primaryLabel}
     </Button>
     {sheet.secondaryLabel && (
      <Button
       type="button"
       variant="text"
       customClass="sheet-cancel-link"
       onClick={sheet.onSecondary}
      >
       {sheet.secondaryLabel}
      </Button>
     )}
    </Box>
   </Box>
  </CustomDrawer>
 );
}
