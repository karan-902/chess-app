import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import type { IStakeTicketProps } from "@gopvp/app/src/types/component";
import { entryText, winText } from "@gopvp/app/src/constants/message";
import { formatAmount } from "@gopvp/common/src/util/format";

export default function StakeTicket({ entry, prize }: IStakeTicketProps) {
 return (
  <Box customClass="stake-ticket">
   <Box customClass="stake-ticket-col">
    <Text customClass="stake-label">{entryText}</Text>
    <Text customClass="stake-value">{formatAmount(entry)}</Text>
   </Box>
   <Box customClass="stake-ticket-col">
    <Text customClass="stake-label win">{winText}</Text>
    <Text customClass="stake-value win">{formatAmount(prize)}</Text>
   </Box>
  </Box>
 );
}
