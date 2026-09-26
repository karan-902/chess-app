import CustomModal from "@gopvp/common/src/components/Modal/Modal";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import type { IResignModalProps } from "@gopvp/chess/src/types/component";
import {
 resignTheGameText,
 loseTheGameText,
 loseAndForfeitText,
 keepPlayingText,
 resignText,
} from "@gopvp/chess/src/constants/messages";

export default function ResignModal({
 open,
 isPvc,
 betAmount,
 onKeepPlaying,
 onResign,
}: IResignModalProps) {
 return (
  <CustomModal open={open} onClose={onKeepPlaying}>
   <Text customClass="gr-heading section-heading">{resignTheGameText}</Text>
   <Text customClass="caption">
    {isPvc ? loseTheGameText : loseAndForfeitText(betAmount)}
   </Text>
   <Box customClass="gr-resign-actions">
    <Button customClass="gr-link" onClick={onKeepPlaying}>
     {keepPlayingText}
    </Button>
    <Button customClass="gr-link danger" onClick={onResign}>
     {resignText}
    </Button>
   </Box>
  </CustomModal>
 );
}
