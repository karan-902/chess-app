import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import CustomModal from "@/components/base/Modal/Modal";
import { ChessLogo } from "@/components/constants";
import type { IPoolConfirmSheetProps } from "@/types/components";
import {
 matchmakingSearchingSecondsLeft,
 matchmakingSearchingCancelButton,
 matchmakingSearchingFindingOpponent,
 matchmakingSearchingOpponentFound,
 matchmakingSearchingBetLabel,
 matchmakingSearchingPrizeLabel,
 matchmakingConfirmTitle,
 matchmakingConfirmDescription,
 matchmakingConfirmCancelButton,
 matchmakingCtaFindOpponentButton,
} from "@/constants/messages";

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
  <CustomModal
   open={open}
   onClose={onClose}
   customClass="pool-confirm-sheet"
  >
   {status === "queued" || status === "found" ? (
    <Box customClass="matchmaking-searching">
     <Box customClass="live-ring-wrap searching-ring">
      <Box customClass="searching-logo">
       <ChessLogo size={44} showText={false} />
      </Box>
      <Text component="span" customClass="live-ring" />
     </Box>
     <Text customClass="dialog-title" aria-live="polite">
      {status === "found"
       ? matchmakingSearchingOpponentFound
       : matchmakingSearchingFindingOpponent}
     </Text>
     <Text customClass="searching-timer">
      {matchmakingSearchingSecondsLeft(secondsLeft)}
     </Text>
     <Box customClass="searching-details">
      <Box customClass="searching-detail-item">
       <Text customClass="searching-detail-label caption">
        {matchmakingSearchingBetLabel}
       </Text>
       <Text customClass="searching-detail-value value-heading">
        ${queuedPool?.bet}
       </Text>
      </Box>
      <Box customClass="searching-detail-item">
       <Text customClass="searching-detail-label caption">
        {matchmakingSearchingPrizeLabel}
       </Text>
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
      {matchmakingSearchingCancelButton}
     </Button>
    </Box>
   ) : (
    confirmPool && (
     <Box customClass="matchmaking-searching">
      <Text customClass="dialog-title">{matchmakingConfirmTitle}</Text>
      <Text customClass="empty-state-desc description">
       {matchmakingConfirmDescription}
      </Text>
      <Box customClass="searching-details">
       <Box customClass="searching-detail-item">
        <Text customClass="searching-detail-label caption">
         {matchmakingSearchingBetLabel}
        </Text>
        <Text customClass="searching-detail-value value-heading">
         ${confirmPool.bet}
        </Text>
       </Box>
       <Box customClass="searching-detail-item">
        <Text customClass="searching-detail-label caption">
         {matchmakingSearchingPrizeLabel}
        </Text>
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
        {matchmakingCtaFindOpponentButton}
       </Button>
       <Button
        type="button"
        variant="outlined"
        fullWidth
        customClass="pool-confirm-cancel-btn"
        disabled={status === "joining"}
        onClick={onConfirmCancel}
       >
        {matchmakingConfirmCancelButton}
       </Button>
      </Box>
     </Box>
    )
   )}
  </CustomModal>
 );
}
