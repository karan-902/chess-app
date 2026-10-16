import CustomDrawer from "@gopvp/common/src/components/Drawer/Drawer";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import type { IResignSheetProps } from "@gopvp/chess/src/types/component";
import {
 giveUpThisGameText,
 lossCantBeUndoneText,
 computerWinsRoundText,
 backToGameText,
 endGameText,
 resignText,
} from "@gopvp/chess/src/constants/message";

export default function ResignSheet({
 open,
 isPvc,
 onKeepPlaying,
 onResign,
}: IResignSheetProps) {
 return (
  <CustomDrawer anchor="bottom" open={open} onClose={onKeepPlaying}>
   <Box customClass="resign-sheet">
    <Text customClass="dialog-title">{giveUpThisGameText}</Text>
    <Text customClass="empty-state-desc description">
     {isPvc ? computerWinsRoundText : lossCantBeUndoneText}
    </Text>
    <Button
     type="button"
     variant="contained"
     fullWidth
     customClass="game-cta play-cta"
     onClick={onKeepPlaying}
    >
     {backToGameText}
    </Button>
    <Button
     type="button"
     variant="text"
     customClass="sheet-cancel-link"
     onClick={onResign}
    >
     {isPvc ? endGameText : resignText}
    </Button>
   </Box>
  </CustomDrawer>
 );
}
