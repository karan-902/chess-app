import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomDrawer from "@gopvp/common/src/components/Drawer/Drawer";
import type { IPoolConfirmSheetProps } from "@gopvp/app/src/types/component";
import {
 secondsLeftText,
 cancelSearchText,
 findingOpponentText,
 opponentFoundText,
 prizeText,
 confirmYourMatchText,
 matchedOnConfirmText,
 findOpponentText,
} from "@gopvp/app/src/constants/message";
import {
 cancelText,
 entryFeeText,
} from "@gopvp/common/src/constants/message";
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
 return (
  <CustomDrawer anchor="bottom" open={open} onClose={onClose}>
   {status === "queued" || status === "found" ? (
    <Box customClass="matchmaking-searching">
     <Box customClass="logo-loader" role="progressbar" />
     <Text customClass="dialog-title" aria-live="polite">
      {status === "found" ? opponentFoundText : findingOpponentText}
     </Text>
     <Text customClass="searching-timer">{secondsLeftText(secondsLeft)}</Text>
     <Box customClass="searching-details">
      <Box customClass="searching-detail-item">
       <Text customClass="searching-detail-label caption">{entryFeeText}</Text>
       <Text customClass="searching-detail-value value-heading">
        ${queuedPool?.bet}
       </Text>
      </Box>
      <Box customClass="searching-detail-item">
       <Text customClass="searching-detail-label caption">{prizeText}</Text>
       <Text customClass="searching-detail-value value-heading win-prize">
        ${queuedPool?.prize}
       </Text>
      </Box>
     </Box>
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
     <Box customClass="matchmaking-searching">
      <Text customClass="dialog-title">{confirmYourMatchText}</Text>
      <Text customClass="empty-state-desc description">
       {matchedOnConfirmText}
      </Text>
      <Box customClass="searching-details">
       <Box customClass="searching-detail-item">
        <Text customClass="searching-detail-label caption">{entryFeeText}</Text>
        <Text customClass="searching-detail-value value-heading">
         ${confirmPool.bet}
        </Text>
       </Box>
       <Box customClass="searching-detail-item">
        <Text customClass="searching-detail-label caption">{prizeText}</Text>
        <Text customClass="searching-detail-value value-heading win-prize">
         ${confirmPool.prize}
        </Text>
       </Box>
      </Box>
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
