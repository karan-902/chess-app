import { ChevronLeft, ChevronRight } from "lucide-react";
import Box from "@/components/base/Box/Box";
import CustomIconButton from "@/components/base/IconButton/IconButton";
import MoveList from "./MoveList";
import type { IReviewControlsProps } from "@/types/components";
import {
    playMoveHistoryPreviousMoveAriaLabel,
    playMoveHistoryNextMoveAriaLabel,
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
                aria-label={playMoveHistoryPreviousMoveAriaLabel}
            >
                <ChevronLeft size={16} strokeWidth={2} />
            </CustomIconButton>
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
                aria-label={playMoveHistoryNextMoveAriaLabel}
            >
                <ChevronRight size={16} strokeWidth={2} />
            </CustomIconButton>
        </Box>
    );
}
