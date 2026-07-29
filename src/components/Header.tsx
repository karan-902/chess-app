import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { DollarSign, Plus, User, Wallet, LogOut } from "lucide-react";
import Box from "@/components/base/Box/Box";
import Button from "@/components/base/Button/Button";
import Avatar from "@/components/base/Avatar/Avatar";
import { useReduxSelector } from "@/store/hooks";
import { useSocket } from "@/context/SocketContext";
import { useWalletBalance } from "@/hooks/useWallet";
import { useLogout } from "@/hooks/useLogout";
import { useWalletActionModal } from "@/context/WalletActionModalContext";
import { formateAmount } from "@/utils/formate";
import { getAvatarUrl } from "@/utils/avatar";
import {
    appbarOnlineSuffix,
    appbarDepositButton,
    appBarViewProfile,
    appBarWalletHistory,
    appBarLogout,
} from "@/components/messages";
import AppBar from "./base/AppBar/AppBar";

export default function Header() {
    const session = useReduxSelector((state) => state.auth.session);
    const { userCounts } = useSocket();
    const { usdValue } = useWalletBalance();
    const logout = useLogout();
    const walletActionModal = useWalletActionModal();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node))
                setMenuOpen(false);
        };
        if (menuOpen) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [menuOpen]);

    const avatarLetter = session?.username?.[0]?.toUpperCase() ?? "?";

    return (
        <AppBar customClass="appbar">
            <Box customClass="appbar-right">
                <Box customClass="appbar-online">
                    <span className="live-dot" />
                    {userCounts.active.toLocaleString()} {appbarOnlineSuffix}
                </Box>
                <Box customClass="appbar-balance-group">
                    <Box customClass="appbar-balance">
                        <DollarSign size={14} className="appbar-balance-icon" />
                        {formateAmount(usdValue, "USD")}
                    </Box>
                    <Button
                        variant="primary"
                        size="sm"
                        customClass="appbar-deposit-btn-mobile"
                        aria-label={appbarDepositButton}
                        onClick={walletActionModal.openDeposit}
                    >
                        <Plus size={14} strokeWidth={2.5} />
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        customClass="appbar-deposit-btn-desktop"
                        onClick={walletActionModal.openDeposit}
                    >
                        {appbarDepositButton}
                        <Plus size={14} strokeWidth={2.5} />
                    </Button>
                </Box>
                <Box customClass="appbar-avatar-menu" ref={menuRef}>
                    <Button
                        type="button"
                        variant="ghost"
                        customClass="appbar-avatar-trigger"
                        onClick={() => setMenuOpen((v) => !v)}
                    >
                        <Avatar
                            letter={avatarLetter}
                            src={getAvatarUrl(session?.avatar_seed)}
                            size="sm"
                            variant="neutral"
                        />
                    </Button>
                    {menuOpen && (
                        <Box customClass="appbar-dropdown">
                            <Box customClass="appbar-dropdown-head">
                                <Avatar
                                    letter={avatarLetter}
                                    src={getAvatarUrl(session?.avatar_seed)}
                                    size="sm"
                                    variant="neutral"
                                />
                                <Box customClass="appbar-dropdown-id">
                                    <span className="appbar-dropdown-name">
                                        {session?.username}
                                    </span>
                                    {session?.elo_rating != null && (
                                        <span className="appbar-dropdown-elo">
                                            {session.elo_rating} ELO
                                        </span>
                                    )}
                                </Box>
                            </Box>
                            <Link
                                to="/profile"
                                className="appbar-dropdown-item"
                                onClick={() => setMenuOpen(false)}
                            >
                                <User size={15} strokeWidth={2} />
                                {appBarViewProfile}
                            </Link>
                            <Link
                                to="/wallet"
                                className="appbar-dropdown-item"
                                onClick={() => setMenuOpen(false)}
                            >
                                <Wallet size={15} strokeWidth={2} />
                                {appBarWalletHistory}
                            </Link>
                            <button
                                type="button"
                                className="appbar-dropdown-item danger"
                                onClick={() => {
                                    setMenuOpen(false);
                                    logout();
                                }}
                            >
                                <LogOut size={15} strokeWidth={2} />
                                {appBarLogout}
                            </button>
                        </Box>
                    )}
                </Box>
            </Box>
        </AppBar>
    );
}
