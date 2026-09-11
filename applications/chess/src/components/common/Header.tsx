import { useState } from "react";
import { Link, useLocation } from "react-router";
import classNames from "classnames";
import { User as UserIcon } from "lucide-react";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AppBar from "@/components/base/AppBar/AppBar";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Avatar from "@/components/base/Avatar/Avatar";
import Popover from "@/components/base/Popover/Popover";
import Skeleton from "@/components/base/Skeleton/Skeleton";
import Button from "@/components/base/Button/Button";
import Chip from "@/components/base/Chip/Chip";
import { useWalletBalance } from "@/hooks/useWallet";
import { useLogout } from "@/hooks/useLogout";
import { useReduxSelector } from "@/redux/hooks";
import { formatAmount } from "@/utils/format";
import { shortenUsername } from "@/utils";
import { NAV_ITEMS } from "@/constants/config";
import { profileTitle, appBarLogout, appBarWallet } from "@/constants/messages";
import IconButton from "@/components/base/IconButton/IconButton";
import { ChessLogo } from "@/components/constants";
import { getAvatarUrl } from "@/utils/avatar";

export default function Header() {
 const { pathname } = useLocation();
 const { usdValue, loading } = useWalletBalance();
 const session = useReduxSelector((state) => state.auth.session);
 const logout = useLogout();
 const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

 const getAvatar = () => {
  if (session?.avatar_seed == undefined || session.avatar_seed == null) {
   return;
  }
  return getAvatarUrl(session?.avatar_seed);
 };
 const closeMenu = () => setAnchorEl(null);

 return (
  <AppBar
   toolbarClass="app-toolbar"
   brand={
    <Link to="/play" className="appbar-brand" title="Go to Play">
     <ChessLogo muted={false} showText size={30} />
    </Link>
   }
   bottomSlot={
    <Box customClass="appbar-nav-tabs">
     {NAV_ITEMS.map((item) => (
      <Link
       key={item.id}
       to={item.path}
       className={classNames(
        "appbar-nav-tab",
        pathname === item.path && "active",
       )}
      >
       {item.label}
      </Link>
     ))}
    </Box>
   }
  >
   <Box customClass="appbar-right">
    <Link to="/wallet" style={{ textDecoration: "none" }}>
     {" "}
     {loading ? (
      <Skeleton customClass="text" width={44} height={13} />
     ) : (
      <Chip
       icon={<AccountBalanceWalletIcon />}
       label={formatAmount(usdValue)}
       customClass="appbar-balance"
      />
     )}
    </Link>

    {session ? (
     <IconButton
      customClass={classNames(
       "appbar-menu-trigger",
       pathname === "/profile" && "active",
      )}
      onClick={(e) => setAnchorEl(e.currentTarget)}
     >
      <UserIcon size={18} strokeWidth={2.5} />
     </IconButton>
    ) : (
     <Skeleton customClass="circle" width={28} height={28} />
    )}

    <Popover
     open={!!anchorEl}
     anchorEl={anchorEl}
     onClose={closeMenu}
     anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
     transformOrigin={{ vertical: "top", horizontal: "right" }}
     customClass="appbar-account-popover"
    >
     <Box customClass="appbar-dropdown-head">
      <Avatar letter="" src={getAvatar()} customClass="sm primary" />
      <Box customClass="appbar-dropdown-id">
       <Text customClass="appbar-dropdown-name">
        {session?.username && shortenUsername(session.username)}
       </Text>
      </Box>
     </Box>
     <Link to="/profile" className="appbar-dropdown-item" onClick={closeMenu}>
      {profileTitle}
     </Link>
     <Link to="/wallet" className="appbar-dropdown-item" onClick={closeMenu}>
      {appBarWallet}
     </Link>
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
    </Popover>
   </Box>
  </AppBar>
 );
}
