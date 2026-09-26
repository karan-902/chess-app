import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { AccountBalanceWalletIcon } from "@/components/base/images";
import CustomAppBar from "@/components/base/AppBar/AppBar";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import CustomAvatar from "@/components/base/Avatar/Avatar";
import CustomPopover from "@/components/base/Popover/Popover";
import Skeleton from "@/components/base/Skeleton/Skeleton";
import Button from "@/components/base/Button/Button";
import CustomChip from "@/components/base/Chip/Chip";
import { CustomTabs, CustomTab } from "@/components/base/Tabs/Tabs";
import { useWalletBalance } from "@/hooks/useWallet";
import { useLogout } from "@/hooks/useLogout";
import { useReduxSelector } from "@/redux/hooks";
import { formatAmount } from "@/utils/format";
import { getGameFromPath, getGameRoutes, shortenUsername } from "@/utils";
import { NAV_ITEMS } from "@/constants/config";
import {
 profileTitle,
 appBarLogout,
 appBarWallet,
 appBarBack,
} from "@/constants/messages";
import CustomIconButton from "@/components/base/IconButton/IconButton";
import { ChessLogo } from "@/components/constants";

export default function Header() {
 const { pathname } = useLocation();
 const navigate = useNavigate();
 const enteredGame = useReduxSelector((state) => state.speed.enteredGame);
 const routes = enteredGame && getGameRoutes(enteredGame);
 const isGamePage = !!getGameFromPath(pathname);
 const activeNavPath =
  routes && NAV_ITEMS.some((item) => routes[item.page] === pathname)
   ? pathname
   : false;
 const { usdValue, loading } = useWalletBalance();
 const session = useReduxSelector((state) => state.auth.session);
 const logout = useLogout();
 const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

 const closeMenu = () => setAnchorEl(null);

 return (
  <CustomAppBar
   brand={
    <Link
     to={routes ? routes.PLAY : "/"}
     className="appbar-brand"
     title="Go to Play"
    >
     <ChessLogo muted={false} showText size={30} />
    </Link>
   }
   bottomSlot={
    isGamePage && routes ? (
     <CustomTabs
      customClass="appbar-nav-tabs"
      value={activeNavPath}
      onChange={(_, value) => navigate(value)}
     >
      {NAV_ITEMS.map((item) => (
       <CustomTab key={item.id} value={routes[item.page]} label={item.label} />
      ))}
     </CustomTabs>
    ) : (
     <Button
      type="button"
      customClass="appbar-back-btn"
      startIcon="arrowBack"
      onClick={() => navigate(routes ? routes.PLAY : "/")}
     >
      {appBarBack}
     </Button>
    )
   }
  >
   <Box customClass="appbar-right">
    <NavLink to="/wallet" style={{ textDecoration: "none" }}>
     {" "}
     {loading ? (
      <Skeleton customClass="text" width={44} height={13} />
     ) : (
      <CustomChip
       icon={<AccountBalanceWalletIcon />}
       label={formatAmount(usdValue)}
       customClass="appbar-balance"
      />
     )}
    </NavLink>

    {session ? (
     <CustomIconButton
      customClass={classNames(
       "appbar-menu-trigger",
       pathname === "/profile" && "active",
      )}
      onClick={(e) => setAnchorEl(e.currentTarget)}
      icon="person"
     />
    ) : (
     <Skeleton variant="circular" width={28} height={28} />
    )}

    <CustomPopover
     open={!!anchorEl}
     anchorEl={anchorEl}
     onClose={closeMenu}
     anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
     transformOrigin={{ vertical: "top", horizontal: "right" }}
     customClass="appbar-account-popover"
    >
     <Box customClass="appbar-dropdown-head">
      <CustomAvatar
       letter={session?.username?.charAt(0).toUpperCase() ?? ""}
       customClass="sm primary"
      />
      <Box customClass="appbar-dropdown-id">
       <Text customClass="appbar-dropdown-name">
        {session?.username && shortenUsername(session.username)}
       </Text>
      </Box>
     </Box>
     <NavLink
      to="/profile"
      className={({ isActive }) =>
       classNames("appbar-dropdown-item", isActive && "active")
      }
      onClick={closeMenu}
     >
      {profileTitle}
     </NavLink>
     <NavLink
      to="/wallet"
      className={({ isActive }) =>
       classNames("appbar-dropdown-item", isActive && "active")
      }
      onClick={closeMenu}
     >
      {appBarWallet}
     </NavLink>
     <Button
      type="button"
      sx={{ justifyContent: "flex-start" }}
      customClass="appbar-dropdown-item  danger"
      onClick={() => {
       closeMenu();
       logout();
      }}
     >
      {appBarLogout}
     </Button>
    </CustomPopover>
   </Box>
  </CustomAppBar>
 );
}
