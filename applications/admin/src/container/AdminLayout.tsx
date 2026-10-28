import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomChip from "@gopvp/common/src/components/Chip/Chip";
import CustomAppBar from "@gopvp/common/src/components/AppBar/AppBar";
import { LogOut } from "@gopvp/common/src/components/images";
import { ADMIN_NAV_SECTIONS } from "@gopvp/admin/src/constants/option";
import { ADMIN_ENDPOINTS } from "@gopvp/admin/src/constants/endpoint";
import { ADMIN_LOGO_PATH } from "@gopvp/admin/src/constants/asset";
import { ADMIN_ROLE_LABELS } from "@gopvp/admin/src/constants/label";
import {
 adminBadgeText,
 brandAltText,
 logOutText,
} from "@gopvp/admin/src/constants/message";
import { adminApiCall, endAdminSession } from "@gopvp/admin/src/utils/api";
import { loadAdminSession } from "@gopvp/admin/src/utils/session";

export default function AdminLayout() {
 const navigate = useNavigate();
 const { pathname } = useLocation();
 const session = loadAdminSession();
 const [isLoggingOut, setIsLoggingOut] = useState(false);

 const handleLogout = async () => {
  if (isLoggingOut) return;
  setIsLoggingOut(true);
  try {
   await adminApiCall<null>("POST", ADMIN_ENDPOINTS.LOGOUT);
  } catch (error) {
   console.error(error);
  } finally {
   endAdminSession();
  }
 };

 return (
  <Box customClass="admin-shell">
   <Box component="aside" customClass="admin-sidebar">
    <Box customClass="admin-brand">
     <img src={ADMIN_LOGO_PATH} alt={brandAltText} />
     <CustomChip label={adminBadgeText} customClass="admin-status gold" />
    </Box>

    {ADMIN_NAV_SECTIONS.map((section) => (
     <Box component="nav" key={section.title} customClass="admin-nav-group">
      <Text customClass="admin-nav-label color-muted">{section.title}</Text>
      {section.items.map(({ label, icon: Icon, path }) => (
       <Button
        key={label}
        customClass={classNames(
         "admin-nav-item",
         pathname === path && "active",
        )}
        disabled={!path}
        fullWidth
        onClick={() => path && navigate(path)}
       >
        <Icon size={18} aria-hidden />
        {label}
       </Button>
      ))}
     </Box>
    ))}
   </Box>

   <Box customClass="admin-main">
    <CustomAppBar customClass="admin-topbar">
     <Box customClass="admin-me">
      <Box customClass="admin-avatar" aria-hidden>
       {session?.name.charAt(0).toUpperCase()}
      </Box>
      <Box>
       <Text>{session?.name}</Text>
       <Text customClass="color-muted">
        {session && (ADMIN_ROLE_LABELS[session.role] ?? session.role)}
       </Text>
      </Box>
     </Box>
     <Button
      customClass="admin-btn"
      size="small"
      isLoading={isLoggingOut}
      onClick={handleLogout}
     >
      <LogOut size={16} aria-hidden />
      {logOutText}
     </Button>
    </CustomAppBar>

    <Box component="main" customClass="admin-content">
     <Outlet />
    </Box>
   </Box>
  </Box>
 );
}
