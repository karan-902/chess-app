import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import CustomIconButton from "@gopvp/common/src/components/IconButton/IconButton";
import MoveList from "@gopvp/chess/src/pages/play/MoveList";
import type { IReviewControlsProps } from "@gopvp/chess/src/types/component";
import {
 previousMoveText,
 nextMoveText,
} from "@gopvp/chess/src/constants/message";

export default function ReviewControls({
 moveHistory,
 fenHistory,
 viewIndex,
 onJump,
 premove,
 onCancelPremoves,
 status,
 isReviewing,
 goBack,
 goForward,
}: IReviewControlsProps) {
 return (
  <Box
   customClass={classNames("gr-review-controls", isReviewing && "reviewing")}
  >
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
    premove={premove}
    onCancelPremoves={onCancelPremoves}
    status={status}
   />
   <CustomIconButton
    customClass={classNames("gr-review-btn", isReviewing && "live")}
    onClick={goForward}
    disabled={!isReviewing}
    aria-label={nextMoveText}
    icon="chevronRight"
   />
  </Box>
 );
}
