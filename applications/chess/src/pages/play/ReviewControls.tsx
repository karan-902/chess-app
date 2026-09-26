import Box from "@/components/base/Box/Box";
import CustomIconButton from "@/components/base/IconButton/IconButton";
import MoveList from "./MoveList";
import type { IReviewControlsProps } from "@/types/components";
import {
 previousMoveText,
 nextMoveText,
} from "@/constants/messages";

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
