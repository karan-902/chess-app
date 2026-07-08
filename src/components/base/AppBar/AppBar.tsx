import { useState, useRef, useEffect } from "react";
import { LogOut, User, Crown, MessageCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { NAV_ITEMS } from "@/constants/config";
import { callAPIInterface } from "@/utils";
import sessionService from "@/store/sessionService";
import { useReduxSelector } from "@/store/hooks";
import type { ILogoutBody } from "@/types/index";
import type { ILogoutResponse } from "@/types/utils";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import { useSocket } from "@/context/SocketContext";
import { disconnectSocket } from "@/lib/socket";
import "./appbar.scss";

function AppBar() {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const session = useReduxSelector((state) => state.auth.session);

    const activeNav = NAV_ITEMS.find((item) => item.path === pathname);
    const PageIcon = activeNav?.icon ?? Crown;
    const { userCounts } = useSocket();

    const userInitial = session?.first_name?.[0]?.toUpperCase() ?? "?";
    const fullName = session
        ? `${session.first_name} ${session.last_name}`.trim()
        : "";

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }
        if (open) document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    const handleLogout = async () => {
        try {
            if (session?.session_id) {
                await callAPIInterface<ILogoutBody, ILogoutResponse>(
                    "POST",
                    "/logout",
                    { session_id: session.session_id },
                );
            }
        } catch {
            // proceed to clear session even if API call fails
        } finally {
            disconnectSocket();
            await sessionService.deleteSession();
            navigate("/login");
        }
    };

    return (
        <Box as="header" customClass="appbar">
            <Box customClass="appbar-page-icon">
                <PageIcon size={20} strokeWidth={1.8} />
            </Box>

            <Box customClass="appbar-actions">
                {/* Active users */}
                <Box customClass="appbar-online-pill">
                    <Text as="span" customClass="appbar-online-dot" />
                    <Text as="span" customClass="appbar-online-count">
                        {userCounts.active >= 1000
                            ? `${(userCounts.active / 1000).toFixed(1)}K`
                            : userCounts.active}
                    </Text>
                    <Text as="span" customClass="appbar-online-label">
                        online
                    </Text>
                </Box>

                {/* Chat icon — mobile only (desktop uses sidebar) */}
                <Button
                    customClass="appbar-chat-btn"
                    variant={pathname === "/chat" ? "primary" : "ghost"}
                    onClick={() => navigate("/chat")}
                    aria-label="Messages"
                >
                    <MessageCircle
                        size={18}
                        strokeWidth={pathname === "/chat" ? 2 : 1.6}
                    />
                </Button>

                {/* Avatar + dropdown */}
                <Box customClass="appbar-avatar-wrap" ref={menuRef}>
                    <Button
                        customClass="appbar-avatar"
                        onClick={() => setOpen((v) => !v)}
                        aria-label="User menu"
                    >
                        {userInitial}
                    </Button>
                    {open && (
                        <Box customClass="appbar-dropdown">
                            {fullName && (
                                <Box customClass="appbar-dropdown-user">
                                    <User size={13} />
                                    <Text
                                        as="span"
                                        customClass="appbar-dropdown-name"
                                    >
                                        {fullName}
                                    </Text>
                                </Box>
                            )}
                            <Button
                                customClass="appbar-dropdown-item"
                                onClick={handleLogout}
                            >
                                <LogOut size={14} />
                                Logout
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default AppBar;
