import CustomDrawer from "@gopvp/common/src/components/Drawer/Drawer";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import SheetActions from "@gopvp/common/src/components/SheetActions/SheetActions";
import type { IResignSheetProps } from "@gopvp/chess/src/types/component";
import {
 resignTheGameText,
 loseTheGameText,
 loseAndForfeitText,
 resignText,
} from "@gopvp/chess/src/constants/message";
import { keepPlayingText } from "@gopvp/common/src/constants/message";

export default function ResignSheet({
 open,
 isPvc,
 betAmount,
 onKeepPlaying,
 onResign,
}: IResignSheetProps) {
 return (
  <CustomDrawer anchor="bottom" open={open} onClose={onKeepPlaying}>
   <Box customClass="matchmaking-searching">
    <Text customClass="dialog-title">{resignTheGameText}</Text>
    <Text customClass="empty-state-desc description">
     {isPvc ? loseTheGameText : loseAndForfeitText(betAmount)}
    </Text>
    <SheetActions cancelLabel={resignText} onCancel={onResign}>
     <Button
      type="button"
      variant="contained"
      fullWidth
      customClass="common-play"
      onClick={onKeepPlaying}
     >
      {keepPlayingText}
     </Button>
    </SheetActions>
   </Box>
  </CustomDrawer>
 );
}
