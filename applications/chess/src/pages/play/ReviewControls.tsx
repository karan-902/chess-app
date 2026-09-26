import Box from "@gopvp/common/src/components/Box/Box";
import CustomIconButton from "@gopvp/common/src/components/IconButton/IconButton";
import MoveList from "@gopvp/chess/src/pages/play/MoveList";
import type { IReviewControlsProps } from "@gopvp/chess/src/types/component";
import { previousMoveText, nextMoveText } from "@gopvp/chess/src/constants/messages";

export default function ReviewControls({
 moveHistory,
 fenHistory,
 viewIndex,
 onJump,
 isReviewing,
 goBack,
 goForward,
}: IReviewControlsProps) {
 return (
  <Box customClass="gr-review-controls">
   <CustomIconButton
    customClass="gr-review-btn"
    onClick={goBack}
    disabled={fenHistory.length <= 1}
    aria-label={previousMoveText}
    icon="chevronLeft"
   />
   <MoveList
    moveHistory={moveHistory}
    fenHistory={fenHistory}
    viewIndex={viewIndex}
    onJump={onJump}
   />
   <CustomIconButton
    customClass="gr-review-btn"
    onClick={goForward}
    disabled={!isReviewing}
    aria-label={nextMoveText}
    icon="chevronRight"
   />
  </Box>
 );
}
