import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomAppBar from "@gopvp/common/src/components/AppBar/AppBar";
import CustomChip from "@gopvp/common/src/components/Chip/Chip";
import CustomPopover from "@gopvp/common/src/components/Popover/Popover";
import {
 KeyboardArrowDownIcon,
 ShieldTick,
 User01,
} from "@gopvp/common/src/components/images";
import { ADMIN_NAV_SECTIONS } from "@gopvp/admin/src/constants/option";
import { ADMIN_ENDPOINTS } from "@gopvp/admin/src/constants/endpoint";
import { ADMIN_LOGO_PATH } from "@gopvp/admin/src/constants/asset";
import { ADMIN_ROLE_LABELS } from "@gopvp/admin/src/constants/label";
import { ROUTES } from "@gopvp/admin/src/constants/route";
import {
 accountMenuText,
 brandAltText,
 logOutText,
 profileText,
} from "@gopvp/admin/src/constants/message";
import { adminApiCall, endAdminSession } from "@gopvp/admin/src/utils/api";
import { loadAdminSession } from "@gopvp/admin/src/utils/session";

export default function AdminLayout() {
 const navigate = useNavigate();
 const { pathname } = useLocation();
 const session = loadAdminSession();
 const [isLoggingOut, setIsLoggingOut] = useState(false);
 const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
 const initial = session?.name.charAt(0).toUpperCase() ?? "";

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
    </Box>

    <Box customClass="admin-nav">
     {ADMIN_NAV_SECTIONS.map((section) => (
      <Box component="nav" key={section.title} customClass="admin-nav-group">
       <Text customClass="admin-nav-label">{section.title}</Text>
       {section.items
        .filter(({ roles }) => !roles || (session && roles.has(session.role)))
        .map(({ label, icon: Icon, path }) => (
         <Button
          key={label}
          customClass={classNames(
           "admin-nav-item",
           (pathname === path ||
            (path &&
             path !== ROUTES.DASHBOARD &&
             pathname.startsWith(`${path}/`))) &&
            "active",
          )}
          disabled={!path}
          onClick={() => path && navigate(path)}
         >
          <Icon size={18} aria-hidden />
          {label}
         </Button>
        ))}
      </Box>
     ))}
    </Box>
   </Box>

   <Box customClass="admin-main">
    <CustomAppBar customClass="admin-topbar">
     {session && (
      <CustomChip
       icon={<ShieldTick size={16} aria-hidden />}
       label={ADMIN_ROLE_LABELS[session.role] ?? session.role}
       customClass="admin-role"
      />
     )}
     <Box
      component="button"
      customClass="admin-me"
      aria-label={accountMenuText}
      aria-haspopup="menu"
      aria-expanded={!!menuAnchor}
      onClick={(event) => setMenuAnchor(event.currentTarget)}
     >
      <Box customClass="admin-avatar" aria-hidden>
       {initial}
      </Box>
      <Text customClass="admin-me-name">{session?.name}</Text>
      <KeyboardArrowDownIcon size={16} aria-hidden />
     </Box>
     <CustomPopover
      open={!!menuAnchor}
      anchorEl={menuAnchor}
      onClose={() => setMenuAnchor(null)}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      customClass="appbar-account-popover"
     >
      <NavLink
       to={ROUTES.PROFILE}
       className={({ isActive }) =>
        classNames("appbar-dropdown-item", isActive && "active")
       }
       onClick={() => setMenuAnchor(null)}
      >
       <User01 size={18} aria-hidden />
       {profileText}
      </NavLink>
      <Button
       type="button"
       startIcon="logOut"
       customClass="appbar-dropdown-item"
       isLoading={isLoggingOut}
       onClick={handleLogout}
      >
       {logOutText}
      </Button>
     </CustomPopover>
    </CustomAppBar>

    <Box component="main" customClass="admin-content">
     <Outlet />
    </Box>
   </Box>
  </Box>
 );
}
