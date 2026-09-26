import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { AccountBalanceWalletIcon } from "@gopvp/common/src/components/images";
import CustomAppBar from "@gopvp/common/src/components/AppBar/AppBar";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import CustomAvatar from "@gopvp/common/src/components/Avatar/Avatar";
import CustomPopover from "@gopvp/common/src/components/Popover/Popover";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomChip from "@gopvp/common/src/components/Chip/Chip";
import { CustomTabs, CustomTab } from "@gopvp/common/src/components/Tabs/Tabs";
import { useWalletBalance } from "@gopvp/chess/src/hooks/useWallet";
import { useLogout } from "@gopvp/chess/src/hooks/useLogout";
import { useReduxSelector } from "@gopvp/chess/src/redux/hooks";
import { formatAmount, shortenUsername } from "@gopvp/common/src/util/format";
import { getGameFromPath, getGameRoutes } from "@gopvp/chess/src/utils";
import { NAV_ITEMS } from "@gopvp/chess/src/constants/config";
import {
 profileText,
 logOutText,
 walletText,
 backText,
} from "@gopvp/chess/src/constants/messages";
import CustomIconButton from "@gopvp/common/src/components/IconButton/IconButton";
import { ChessLogo } from "@gopvp/chess/src/components/constants";

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
       <CustomTab key={item.page} value={routes[item.page]} label={item.label} />
      ))}
     </CustomTabs>
    ) : (
     <Button
      type="button"
      customClass="appbar-back-btn"
      startIcon="arrowBack"
      onClick={() => navigate(routes ? routes.PLAY : "/")}
     >
      {backText}
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
      {profileText}
     </NavLink>
     <NavLink
      to="/wallet"
      className={({ isActive }) =>
       classNames("appbar-dropdown-item", isActive && "active")
      }
      onClick={closeMenu}
     >
      {walletText}
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
      {logOutText}
     </Button>
    </CustomPopover>
   </Box>
  </CustomAppBar>
 );
}
