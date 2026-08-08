import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import classNames from "classnames";
import { Wallet as WalletIcon, User as UserIcon } from "lucide-react";
import AppBar from "./base/AppBar/AppBar";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Avatar from "@/components/base/Avatar/Avatar";
import Popover from "@/components/base/Popover/Popover";
import Tooltip from "@/components/base/Tooltip/Tooltip";
import Skeleton from "@/components/base/Skeleton/Skeleton";
import Button from "@/components/base/Button/Button";
// import { useSocket } from "@/context/SocketContext";
import { useWalletBalance } from "@/hooks/useWallet";
import { useLogout } from "@/hooks/useLogout";
import { useReduxSelector } from "@/redux/hooks";
import { formateAmount } from "@/utils/formate";
import { NAV_ITEMS } from "@/constants/config";
// import { appbarOnlineSuffix } from "@/constants/messages";
import {
    appbarWalletTooltip,
    profileTitle,
    appBarLogout,
    leaderboardRankFallback,
    appBarWalletHistory,
} from "@/constants/messages";
import IconButton from "./base/IconButton/IconButton";

export default function Header() {
    // const { userCounts } = useSocket();
    const { pathname } = useLocation();
    const { usdValue, loading } = useWalletBalance();
    const session = useReduxSelector((state) => state.auth.session);
    const logout = useLogout();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const initial = session?.username?.charAt(0).toUpperCase() ?? "?";

    const closeMenu = () => setAnchorEl(null);

    return (
        <AppBar
            toolbarClass="app-toolbar"
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
                {/*
                 Online Pill
                <Box customClass="appbar-online">
                    <Box customClass="live-ring-wrap">
                        <Text component="span" customClass="live-dot" />
                        <Text component="span" customClass="live-ring" />
                    </Box>
                    <Text customClass="appbar-online-label">
                        {userCounts.active.toLocaleString()}{" "}
                        {appbarOnlineSuffix}
                    </Text>
                </Box>
                */}
                <Box customClass="appbar-balance">
                    {loading ? (
                        <Skeleton customClass="text" width={44} height={13} />
                    ) : (
                        <Text customClass="appbar-balance-label">
                            {formateAmount(usdValue)}
                        </Text>
                    )}
                </Box>

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
                        <Avatar letter={initial} customClass="sm primary" />
                        <Box customClass="appbar-dropdown-id">
                            <Text customClass="appbar-dropdown-name">
                                {session?.username}
                            </Text>
                            <Text customClass="appbar-dropdown-elo">
                                {session?.elo_rating ?? leaderboardRankFallback}{" "}
                                ELO
                            </Text>
                        </Box>
                    </Box>
                    <Link
                        to="/profile"
                        className="appbar-dropdown-item"
                        onClick={closeMenu}
                    >
                        {profileTitle}
                    </Link>
                    <Link
                        to="/wallet"
                        className="appbar-dropdown-item"
                        onClick={closeMenu}
                    >
                        {appBarWalletHistory}
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
