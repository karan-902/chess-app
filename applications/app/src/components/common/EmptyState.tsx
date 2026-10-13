import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import { Inbox } from "@gopvp/common/src/components/images";
import type { IEmptyStateProps } from "@gopvp/app/src/types/component";

export default function EmptyState({ title, description }: IEmptyStateProps) {
 return (
  <Box customClass="matches-empty">
   <Box customClass="empty-state-icon">
    <Inbox strokeWidth={1.6} />
   </Box>
   {title && (
    <Text component="h3" customClass="empty-state-title">
     {title}
    </Text>
   )}
   {description && <Text customClass="empty-state-desc">{description}</Text>}
  </Box>
 );
}
