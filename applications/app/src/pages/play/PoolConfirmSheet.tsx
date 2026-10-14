import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomDrawer from "@gopvp/common/src/components/Drawer/Drawer";
// import { icons } from "@gopvp/common/src/components/images";
// import StakeTicket from "@gopvp/app/src/components/common/StakeTicket";
// import FaceOff from "@gopvp/app/src/components/common/FaceOff";
import MatchDeck from "@gopvp/app/src/components/common/MatchDeck";
import type { IPoolConfirmSheetProps } from "@gopvp/app/src/types/component";
import {
 cancelSearchText,
 // findingYourText,
 // rivalText,
 // opponentFoundText,
 confirmYourMatchText,
 slideToPlayText,
 slideToFindOpponentText,
 drawingYourRivalText,
 oneCardIsOpponentText,
 youreMatchedText,
 getSetText,
} from "@gopvp/app/src/constants/message";
import { cancelText } from "@gopvp/common/src/constants/message";
import { formatMMSS } from "@gopvp/common/src/util/format";
import { MATCH_TIMER_LOW_SECONDS } from "@gopvp/app/src/constants/limit";
import SlideToConfirm from "@gopvp/common/src/components/SlideToConfirm/SlideToConfirm";
import PoolCard from "@gopvp/app/src/components/common/PoolCard";

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
}: IPoolConfirmSheetProps) {
 // const elapsedSeconds = POOL_TIMEOUT_SECONDS - secondsLeft;
 const isRevealed = status === "revealing" || status === "found";

 return (
  <CustomDrawer anchor="bottom" open={open} onClose={onClose}>
   {status === "queued" || status === "revealing" || status === "found" ? (
    <Box customClass="pool-confirm-slide">
     <Box customClass="match-head">
      <Box customClass="public-heading">
       <Text component="h2" customClass="public-title" aria-live="polite">
        {isRevealed ? youreMatchedText : drawingYourRivalText}
       </Text>
       <Text customClass="page-subtitle public-subtitle">
        {isRevealed ? getSetText : oneCardIsOpponentText}
       </Text>
      </Box>
      {!isRevealed && (
       <Text
        customClass={classNames(
         "match-timer",
         secondsLeft <= MATCH_TIMER_LOW_SECONDS && "low",
        )}
       >
        {formatMMSS(secondsLeft)}
       </Text>
      )}
     </Box>
     <MatchDeck isRevealed={isRevealed} opponentName={opponentName} />
     {queuedPool && (
      <PoolCard pool={queuedPool} PoolLabel={PoolLabel} tone={confirmTone} />
     )}
     <Button
      type="button"
      variant="text"
      customClass="sheet-cancel-link"
      disabled={isRevealed}
      onClick={onLeaveQueue}
     >
      {cancelSearchText}
     </Button>
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
       label={slideToFindOpponentText}
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
      customClass="common-play cancel-btn"
      disabled={status === "found"}
      onClick={onLeaveQueue}
     >
      {cancelSearchText}
     </Button>
    </Box> */}
  </CustomDrawer>
 );
}
