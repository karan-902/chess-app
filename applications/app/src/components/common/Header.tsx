import { useEffect, useRef, useState } from "react";
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
import CustomIconButton from "@gopvp/common/src/components/IconButton/IconButton";
import { ROUTES } from "@gopvp/app/src/constants/route";

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
 const previousBalanceRef = useRef<number | null>(null);
 const [isBalanceShining, setIsBalanceShining] = useState(false);

 useEffect(() => {
  if (loading) return;
  const previousBalance = previousBalanceRef.current;
  previousBalanceRef.current = usdValue;
  if (previousBalance !== null && usdValue > previousBalance)
   setIsBalanceShining(true);
 }, [usdValue, loading]);
 const session = useReduxSelector((state) => state.auth.session);
 const logout = useLogout();
 const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

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
     <img src="/gopvp-logo.png" width="auto" height={54} alt="gopvp-logo" />
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
       startIcon="arrowBack"
       onClick={goToPlay}
      >
       {backText}
      </Button>
     )
    )
   }
  >
   <Box customClass="appbar-right">
    <NavLink to={ROUTES.WALLET} style={{ textDecoration: "none" }}>
     {" "}
     {loading ? (
      <Skeleton variant="rounded" customClass="appbar-balance-skeleton" />
     ) : (
      <CustomChip
       icon={<AccountBalanceWalletIcon />}
       label={formatAmount(usdValue)}
       customClass={classNames("appbar-balance", isBalanceShining && "shine")}
       onAnimationEnd={() => setIsBalanceShining(false)}
      />
     )}
    </NavLink>

    {session ? (
     <CustomIconButton
      customClass={classNames(
       "appbar-menu-trigger",
       pathname === ROUTES.PROFILE && "active",
      )}
      onClick={(e) => setAnchorEl(e.currentTarget)}
      icon="person"
     />
    ) : (
     <Skeleton variant="circular" width={24} height={24} />
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
      to={ROUTES.PROFILE}
      className={({ isActive }) =>
       classNames("appbar-dropdown-item", isActive && "active")
      }
      onClick={closeMenu}
     >
      {profileText}
     </NavLink>
     <NavLink
      to={ROUTES.WALLET}
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
