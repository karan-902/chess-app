import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomDrawer from "@gopvp/common/src/components/Drawer/Drawer";
import { icons } from "@gopvp/common/src/components/images";
// import StakeTicket from "@gopvp/app/src/components/common/StakeTicket";
// import FaceOff from "@gopvp/app/src/components/common/FaceOff";
// import MatchDeck from "@gopvp/app/src/components/common/MatchDeck";
import MatchTicket from "@gopvp/app/src/components/common/MatchTicket";
import type { IPoolConfirmSheetProps } from "@gopvp/app/src/types/component";
import {
 cancelSearchText,
 // findingYourText,
 // rivalText,
 // opponentFoundText,
 confirmYourMatchText,
 slideToPlayText,
 swipeToFindRivalText,
 drawingYourRivalText,
 // oneCardIsOpponentText,
 // youreMatchedText,
 // getSetText,
 // checkingPlayersText,
 // matchingSkillText,
 // almostThereText,
 // stillLookingText,
 rivalFoundText,
 rivalReadyText,
 noRivalNowText,
 nothingChargedText,
 startingInText,
 tryAgainText,
 pickAnotherBetText,
 timeText,
 entryText,
 winText,
 poolMinutesText,
} from "@gopvp/app/src/constants/message";
import { cancelText } from "@gopvp/common/src/constants/message";
import {
 formatMMSS,
 formatAmount,
 shortenUsername,
} from "@gopvp/common/src/util/format";
import {
 MATCH_TIMER_LOW_SECONDS,
 MATCH_COUNTDOWN_STEPS,
 MS_PER_MINUTE,
} from "@gopvp/app/src/constants/limit";
import { useReduxSelector } from "@gopvp/app/src/redux/hooks";
import SlideToConfirm from "@gopvp/common/src/components/SlideToConfirm/SlideToConfirm";
import PoolCard from "@gopvp/app/src/components/common/PoolCard";

// const SEARCH_LINES = [checkingPlayersText, matchingSkillText, almostThereText];

export default function PoolConfirmSheet({
 open,
 onClose,
 status,
 queuedPool,
 confirmPool,
 opponentName,
 confirmTone,
 PoolLabel,
 secondsLeft,
 onLeaveQueue,
 onConfirmJoin,
 onConfirmCancel,
 onRetry,
 onPickAnotherBet,
}: IPoolConfirmSheetProps) {
 // const elapsedSeconds = POOL_TIMEOUT_SECONDS - secondsLeft;
 const isRevealed = status === "revealing" || status === "found";
 const isTimeout = status === "timeout";
 const isLowTime =
  (status === "queued" || status === "joining") &&
  secondsLeft <= MATCH_TIMER_LOW_SECONDS;
 const myName = shortenUsername(
  useReduxSelector((state) => state.auth.session?.username ?? ""),
 );

 return (
  <CustomDrawer
   anchor="bottom"
   open={open}
   onClose={onClose}
   customClass="match-confirm-sheet"
  >
   {queuedPool && status !== "idle" ? (
    <Box
     customClass={classNames(
      "pool-confirm-slide",
      "match-sheet",
      isTimeout && "lost",
     )}
    >
     <Box customClass="match-head">
      <Box customClass="public-heading">
       <Text component="h2" customClass="public-title" aria-live="polite">
        {isTimeout
         ? noRivalNowText
         : isRevealed
           ? rivalFoundText
           : drawingYourRivalText}
       </Text>
       {(isTimeout || isRevealed) && (
        <Text customClass="page-subtitle public-subtitle">
         {isTimeout
          ? nothingChargedText(formatAmount(queuedPool.bet))
          : rivalReadyText(opponentName)}
        </Text>
       )}
       {/* {!isTimeout && !isRevealed && (isLowTime ? (
        <Text customClass="page-subtitle public-subtitle">
         {stillLookingText}
        </Text>
       ) : (
        <Text customClass="page-subtitle public-subtitle match-status-lines">
         {SEARCH_LINES.map((line) => (
          <span key={line}>{line}</span>
         ))}
        </Text>
       ))} */}
      </Box>
     </Box>
     {/* <MatchDeck isRevealed={isRevealed} opponentName={opponentName} /> */}
     <MatchTicket
      status={status}
      stats={[
       {
        label: timeText,
        value: poolMinutesText(Math.round(queuedPool.time / MS_PER_MINUTE)),
       },
       { label: entryText, value: formatAmount(queuedPool.bet) },
       { label: winText, value: formatAmount(queuedPool.prize), isWin: true },
      ]}
      tone={confirmTone}
      myName={myName}
      opponentName={opponentName}
     />
     <Text
      customClass={classNames(
       "match-timer",
       isLowTime && "low",
       (isRevealed || isTimeout) && "settled",
      )}
     >
      <icons.timer />
      {formatMMSS(isTimeout ? 0 : secondsLeft)}
     </Text>
     {/* <PoolCard pool={queuedPool} PoolLabel={PoolLabel} tone={confirmTone} /> */}
     {isTimeout ? (
      <Box customClass="match-retry">
       <Button
        type="button"
        variant="contained"
        fullWidth
        customClass="game-cta play-cta"
        onClick={onRetry}
       >
        {tryAgainText}
       </Button>
       <Button
        type="button"
        variant="text"
        customClass="sheet-cancel-link"
        onClick={onPickAnotherBet}
       >
        {pickAnotherBetText}
       </Button>
      </Box>
     ) : isRevealed ? (
      <Text customClass="match-starting" aria-live="polite">
       {startingInText}{" "}
       <span className="match-countdown">
        {MATCH_COUNTDOWN_STEPS.map((step) => (
         <b key={step}>{step}</b>
        ))}
       </span>
      </Text>
     ) : (
      <Button
       type="button"
       variant="text"
       customClass="sheet-cancel-link"
       onClick={onLeaveQueue}
      >
       {cancelSearchText}
      </Button>
     )}
    </Box>
   ) : (
    confirmPool && (
     <Box customClass="pool-confirm-slide">
      <Box customClass="public-heading">
       <Text component="h2" customClass="public-title">
        {confirmYourMatchText}
       </Text>
       <Text customClass="page-subtitle public-subtitle">
        {slideToPlayText}
       </Text>
      </Box>
      <PoolCard pool={confirmPool} PoolLabel={PoolLabel} tone={confirmTone} />
      <SlideToConfirm
       label={swipeToFindRivalText}
       onConfirm={onConfirmJoin}
       isLoading={status === "joining"}
      />
      <Button
       type="button"
       variant="text"
       customClass="sheet-cancel-link"
       disabled={status === "joining"}
       onClick={onConfirmCancel}
      >
       {cancelText}
      </Button>
     </Box>
    )
   )}
   {/* <Box customClass="matchmaking-searching pool-confirm">
     <Box
      customClass="mm-radar"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={POOL_TIMEOUT_SECONDS}
      aria-valuenow={secondsLeft}
     >
      <svg className="mm-radar-ring" viewBox="0 0 200 200" aria-hidden>
       <circle className="mm-radar-track" cx="100" cy="100" r="97" />
       <circle
        className="mm-radar-progress"
        cx="100"
        cy="100"
        r="97"
        pathLength={POOL_TIMEOUT_SECONDS}
        strokeDasharray={POOL_TIMEOUT_SECONDS}
        strokeDashoffset={-elapsedSeconds}
       />
      </svg>
      <Box
       customClass="mm-radar-head"
       style={{
        transform: `rotate(${(elapsedSeconds / POOL_TIMEOUT_SECONDS) * 360}deg)`,
       }}
      />
      <img className="mm-radar-logo" src="/gopvp-logo.png" alt="" />
     </Box>
     <Text customClass="dialog-title mm-title" aria-live="polite">
      {status === "found" ? (
       opponentFoundText
      ) : (
       <>
        {findingYourText} <b>{rivalText}</b>
       </>
      )}
     </Text>
     <Text customClass="mm-timer">
      <icons.timer />
      {formatMMSS(secondsLeft)}
     </Text>
     <FaceOff />
     {queuedPool && (
      <StakeTicket entry={queuedPool.bet} prize={queuedPool.prize} />
     )}
     <Button
      type="button"
      variant="outlined"
      fullWidth
      customClass="cancel-btn"
      disabled={status === "found"}
      onClick={onLeaveQueue}
     >
      {cancelSearchText}
     </Button>
    </Box> */}
  </CustomDrawer>
 );
}
