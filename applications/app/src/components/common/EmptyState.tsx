import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import { ChessLogo } from "@gopvp/app/src/constants/icon";
import type { IEmptyStateProps } from "@gopvp/app/src/types/component";

export default function EmptyState({ title, description }: IEmptyStateProps) {
 return (
  <Box customClass="matches-empty">
   <ChessLogo size={44} showText={false} muted />
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
