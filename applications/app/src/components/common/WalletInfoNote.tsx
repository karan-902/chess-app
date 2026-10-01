import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import { Info } from "@gopvp/common/src/components/images";
import type { IWalletInfoNoteProps } from "@gopvp/app/src/types/component";

export default function WalletInfoNote({ text }: IWalletInfoNoteProps) {
 return (
  <Box customClass="modal-info-box">
   <Info size={16} strokeWidth={2} />
   <Text customClass="modal-info-text caption">{text}</Text>
  </Box>
 );
}
