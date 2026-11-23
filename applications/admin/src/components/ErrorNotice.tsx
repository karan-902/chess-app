import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import { AlertCircle } from "@gopvp/common/src/components/images";
import type { TAdminErrorNoticeProps } from "@gopvp/admin/src/types";

export default function ErrorNotice({ message }: TAdminErrorNoticeProps) {
 return (
  <Box customClass="admin-error" role="alert">
   <AlertCircle size={18} aria-hidden />
   <Text customClass="admin-stat-label">{message}</Text>
  </Box>
 );
}
