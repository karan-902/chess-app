import Box from "@gopvp/common/src/components/Box/Box";
import Card from "@gopvp/common/src/components/Card/Card";
import Text from "@gopvp/common/src/components/Text/Text";
import { formatDateTime } from "@gopvp/common/src/util/format";
import { ADMIN_ROLE_LABELS } from "@gopvp/admin/src/constants/label";
import {
 adminIdText,
 emailText,
 lastLoginText,
 neverText,
 profileHintText,
 profileText,
 roleText,
} from "@gopvp/admin/src/constants/message";
import { loadAdminSession } from "@gopvp/admin/src/utils/session";
import FieldList from "@gopvp/admin/src/components/FieldList";

export default function Profile() {
 const session = loadAdminSession();
 const fields = session
  ? [
     { label: emailText, value: session.email },
     {
      label: roleText,
      value: ADMIN_ROLE_LABELS[session.role] ?? session.role,
     },
     {
      label: lastLoginText,
      value: session.last_login
       ? formatDateTime(session.last_login)
       : neverText,
     },
     { label: adminIdText, value: session.id },
    ]
  : [];

 return (
  <>
   <Box customClass="admin-page-head">
    <Text component="h1" customClass="admin-page-title">
     {profileText}
    </Text>
    <Text customClass="admin-page-hint">{profileHintText}</Text>
   </Box>

   <Card customClass="admin-detail">
    <Box customClass="admin-detail-head">
     <Box customClass="admin-avatar" aria-hidden>
      {session?.name.charAt(0).toUpperCase()}
     </Box>
     <Text component="h2" customClass="admin-section-title">
      {session?.name}
     </Text>
    </Box>
    <FieldList fields={fields} />
   </Card>
  </>
 );
}
