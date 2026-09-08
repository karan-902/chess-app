import Modal from "@/components/base/Modal/Modal";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import type { IResignModalProps } from "@/types/components";
import {
    playResignDialogTitle,
    playResignDialogPvcDescription,
    playResignDialogPvpDescription,
    playResignDialogKeepPlayingButton,
    playResignDialogResignButton,
} from "@/constants/messages";

export default function ResignModal({
    open,
    isPvc,
    stakeAmount,
    onKeepPlaying,
    onResign,
}: IResignModalProps) {
    return (
        <Modal open={open} onClose={onKeepPlaying}>
            <Text customClass="gr-heading section-heading">{playResignDialogTitle}</Text>
            <Text customClass="gr-elo caption">
                {isPvc
                    ? playResignDialogPvcDescription
                    : playResignDialogPvpDescription(stakeAmount)}
            </Text>
            <Box customClass="gr-resign-actions">
                <Button customClass="gr-link" onClick={onKeepPlaying}>
                    {playResignDialogKeepPlayingButton}
                </Button>
                <Button customClass="gr-link danger" onClick={onResign}>
                    {playResignDialogResignButton}
                </Button>
            </Box>
        </Modal>
    );
}
