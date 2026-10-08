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
  <CustomDrawer
   anchor="bottom"
   open={open}
   onClose={onClose}
   customClass="gold-foil"
  >
   {status === "queued" || status === "found" ? (
    <Box customClass="matchmaking-searching">
     <Box customClass="logo-loader" role="progressbar" />
     <Text customClass="dialog-title gold-foil" aria-live="polite">
      {status === "found" ? opponentFoundText : findingOpponentText}
     </Text>
     <Text customClass="searching-timer gold-foil">
      {secondsLeftText(secondsLeft)}
     </Text>
     <Box customClass="searching-details gold-foil">
      <Box customClass="searching-detail-item gold-foil">
       <Text customClass="searching-detail-label caption gold-foil">
        {entryFeeText}
       </Text>
       <Text customClass="searching-detail-value value-heading gold-foil">
        ${queuedPool?.bet}
       </Text>
      </Box>
      <Box customClass="searching-detail-item gold-foil prize-item">
       <Text customClass="searching-detail-label caption gold-foil">
        {prizeText}
       </Text>
       <Text customClass="searching-detail-value value-heading win-prize gold-foil">
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
      <Text customClass="dialog-title gold-foil">{confirmYourMatchText}</Text>
      <Text customClass="empty-state-desc description">
       {matchedOnConfirmText}
      </Text>
      <Box customClass="searching-details gold-foil">
       <Box customClass="searching-detail-item gold-foil">
        <Text customClass="searching-detail-label caption gold-foil">
         {entryFeeText}
        </Text>
        <Text customClass="searching-detail-value value-heading gold-foil">
         ${confirmPool.bet}
        </Text>
       </Box>
       <Box customClass="searching-detail-item gold-foil prize-item">
        <Text customClass="searching-detail-label caption gold-foil">
         {prizeText}
        </Text>
        <Text customClass="searching-detail-value value-heading win-prize gold-foil">
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
        customClass="common-play gold-foil shine"
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
