import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomDrawer from "@gopvp/common/src/components/Drawer/Drawer";
import { icons } from "@gopvp/common/src/components/images";
import StakeTicket from "@gopvp/app/src/components/common/StakeTicket";
import FaceOff from "@gopvp/app/src/components/common/FaceOff";
import type { IPoolConfirmSheetProps } from "@gopvp/app/src/types/component";
import {
 cancelSearchText,
 findingYourText,
 rivalText,
 opponentFoundText,
 confirmYourText,
 matchText,
 tapToConfirmText,
 winItAllText,
 findOpponentText,
} from "@gopvp/app/src/constants/message";
import { cancelText } from "@gopvp/common/src/constants/message";
import { formatMMSS } from "@gopvp/common/src/util/format";
import { POOL_TIMEOUT_SECONDS } from "@gopvp/app/src/constants/limit";
import SheetActions from "@gopvp/common/src/components/SheetActions/SheetActions";

export default function PoolConfirmSheet({
 open,
 onClose,
 status,
 queuedPool,
 confirmPool,
 secondsLeft,
 onLeaveQueue,
 onConfirmJoin,
 onConfirmCancel,
}: IPoolConfirmSheetProps) {
 const elapsedSeconds = POOL_TIMEOUT_SECONDS - secondsLeft;

 return (
  <CustomDrawer anchor="bottom" open={open} onClose={onClose}>
   {status === "queued" || status === "found" ? (
    <Box customClass="matchmaking-searching pool-confirm">
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
    </Box>
   ) : (
    confirmPool && (
     <Box customClass="matchmaking-searching pool-confirm">
      <Text customClass="dialog-title">
       {confirmYourText} <b>{matchText}</b>
      </Text>
      <Text customClass="sheet-subtitle">
       {tapToConfirmText} <b>{winItAllText}</b>
      </Text>
      <StakeTicket entry={confirmPool.bet} prize={confirmPool.prize} />
      <SheetActions
       cancelLabel={cancelText}
       onCancel={onConfirmCancel}
       isCancelDisabled={status === "joining"}
      >
       <Button
        type="button"
        variant="contained"
        fullWidth
        customClass="common-play"
        isLoading={status === "joining"}
        loaderOnDark
        onClick={onConfirmJoin}
       >
        {findOpponentText}
       </Button>
      </SheetActions>
     </Box>
    )
   )}
  </CustomDrawer>
 );
}
