import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomModal from "@gopvp/common/src/components/Modal/Modal";
import { ChessLogo } from "@gopvp/chess/src/components/constants";
import type { IPoolConfirmSheetProps } from "@gopvp/chess/src/types/component";
import {
 secondsLeftText,
 cancelSearchText,
 findingOpponentText,
 opponentFoundText,
 entryFeeText,
 prizeText,
 confirmYourMatchText,
 matchedOnConfirmText,
 cancelText,
 findOpponentText,
} from "@gopvp/chess/src/constants/messages";

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
  <CustomModal open={open} onClose={onClose} customClass="pool-confirm-sheet">
   {status === "queued" || status === "found" ? (
    <Box customClass="matchmaking-searching">
     <Box customClass="live-ring-wrap searching-ring">
      <Box customClass="searching-logo">
       <ChessLogo size={44} showText={false} />
      </Box>
      <Text component="span" customClass="live-ring" />
     </Box>
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
      customClass="searching-cancel-btn"
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
      <Box customClass="pool-confirm-actions">
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
       <Button
        type="button"
        variant="outlined"
        fullWidth
        customClass="pool-confirm-cancel-btn"
        disabled={status === "joining"}
        onClick={onConfirmCancel}
       >
        {cancelText}
       </Button>
      </Box>
     </Box>
    )
   )}
  </CustomModal>
 );
}
