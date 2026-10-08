import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import { ChessLogo } from "@gopvp/app/src/constants/icon";
import type { IEmptyStateProps } from "@gopvp/app/src/types/component";
import { EMPTY_STATE_LOGO_SIZE } from "@gopvp/app/src/constants/limit";

export default function EmptyState({ title, description }: IEmptyStateProps) {
 return (
  <Box customClass="matches-empty">
   <Box customClass="empty-state-icon">
    <ChessLogo size={EMPTY_STATE_LOGO_SIZE} showText={false} muted />
   </Box>
   {title && (
    <Text component="h3" customClass="section-heading">
     {title}
    </Text>
   )}
   {description && (
    <Text customClass="empty-state-desc description">{description}</Text>
   )}
  </Box>
 );
}
