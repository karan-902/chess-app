import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { User, Wallet } from "@gopvp/common/src/components/images";
import CustomAppBar from "@gopvp/common/src/components/AppBar/AppBar";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import CustomAvatar from "@gopvp/common/src/components/Avatar/Avatar";
import CustomPopover from "@gopvp/common/src/components/Popover/Popover";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomChip from "@gopvp/common/src/components/Chip/Chip";
import { CustomTabs, CustomTab } from "@gopvp/common/src/components/Tabs/Tabs";
import { useWalletBalance } from "@gopvp/app/src/hooks/useWallet";
import { useLogout } from "@gopvp/app/src/hooks/useLogout";
import { useReduxDispatch, useReduxSelector } from "@gopvp/app/src/redux/hooks";
import { setActivePage } from "@gopvp/app/src/redux/game/slice";
import { formatAmount, shortenUsername } from "@gopvp/common/src/util/format";
import { getGameFromPath, getGamePath } from "@gopvp/app/src/utils";
import { NAV_ITEMS } from "@gopvp/app/src/constants/option";
import {
 profileText,
 logOutText,
 walletText,
 goToPlayText,
} from "@gopvp/app/src/constants/message";
import { backText } from "@gopvp/common/src/constants/message";
import { ROUTES } from "@gopvp/app/src/constants/route";
import { WALLET_3D_PATH } from "@gopvp/app/src/constants/asset";

export default function Header() {
 const { pathname } = useLocation();
 const navigate = useNavigate();
 const dispatch = useReduxDispatch();
 const { enteredGame, activePage } = useReduxSelector((state) => state.game);
 const gamePath = enteredGame && getGamePath(enteredGame);
 const isGamePage = !!getGameFromPath(pathname);
 const goToPlay = () => {
  if (!gamePath) return;
  dispatch(setActivePage("PLAY"));
  navigate(gamePath);
 };
 const { usdValue, loading } = useWalletBalance();
 const session = useReduxSelector((state) => state.auth.session);
 const logout = useLogout();
 const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
 const initial = session?.username?.charAt(0).toUpperCase() ?? "";

 const closeMenu = () => setAnchorEl(null);

 return (
  <CustomAppBar
   brand={
    <Link
     to={gamePath || "/"}
     className="appbar-brand"
     title={goToPlayText}
     onClick={() => dispatch(setActivePage("PLAY"))}
    >
     <img src="/gopvp-logo.png" alt="gopvp-logo" />
    </Link>
   }
   bottomSlot={
    isGamePage && gamePath ? (
     <CustomTabs
      customClass="appbar-nav-tabs"
      value={activePage}
      onChange={(_, value) => dispatch(setActivePage(value))}
     >
      {NAV_ITEMS.map((item) => (
       <CustomTab key={item.page} value={item.page} label={item.label} />
      ))}
     </CustomTabs>
    ) : (
     gamePath && (
      <Button
       type="button"
       customClass="appbar-back-btn"
       startIcon="moveLeft"
       onClick={goToPlay}
      >
       {backText}
      </Button>
     )
    )
   }
  >
   <Box customClass="appbar-right">
    {loading ? (
     <Skeleton variant="rounded" customClass="appbar-balance-skeleton" />
    ) : (
     <Box customClass="appbar-wallet">
      <NavLink to={ROUTES.WALLET}>
       <CustomChip
        icon={<img src={WALLET_3D_PATH} alt="" />}
        label={formatAmount(usdValue)}
        customClass="appbar-balance"
       />
      </NavLink>
     </Box>
    )}

    {session ? (
     <Box
      component="button"
      customClass={classNames(
       "appbar-avatar-trigger",
       pathname === ROUTES.PROFILE && "active",
      )}
      aria-label={profileText}
      onClick={(e) => setAnchorEl(e.currentTarget)}
     >
      <CustomAvatar letter={initial} customClass="header" />
     </Box>
    ) : (
     <Skeleton variant="circular" width={40} height={40} />
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
      <CustomAvatar letter={initial} customClass="header md" />
      <Box customClass="appbar-dropdown-id">
       <Text customClass="appbar-dropdown-name">
        {session?.username && shortenUsername(session.username)}
       </Text>
       {session?.email && (
        <Text customClass="appbar-dropdown-email">{session.email}</Text>
       )}
      </Box>
     </Box>
     <NavLink
      to={ROUTES.PROFILE}
      className={({ isActive }) =>
       classNames("appbar-dropdown-item", isActive && "active")
      }
      onClick={closeMenu}
     >
      <User size={18} strokeWidth={2} />
      {profileText}
     </NavLink>
     <NavLink
      to={ROUTES.WALLET}
      className={({ isActive }) =>
       classNames("appbar-dropdown-item", isActive && "active")
      }
      onClick={closeMenu}
     >
      <Wallet size={18} strokeWidth={2} />
      {walletText}
     </NavLink>
     <Button
      type="button"
      startIcon="logOut"
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
