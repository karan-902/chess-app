import CustomModal from "@/components/base/Modal/Modal";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import type { IResignModalProps } from "@/types/component";
import {
 resignTheGameText,
 loseTheGameText,
 loseAndForfeitText,
 keepPlayingText,
 resignText,
} from "@/constants/messages";

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
