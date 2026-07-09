import { useState, useRef, useEffect } from "react";
import { LogOut, Crown, MessageCircle, ChevronDown, MoreHorizontal, Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import clsx from "clsx";
import { NAV_ITEMS } from "@/constants/config";
import { CURRENCY_META, CURRENCIES } from "@/constants/currencies";
import { callAPIInterface, getDisplayName } from "@/utils";
import sessionService from "@/store/sessionService";
import { useReduxSelector } from "@/store/hooks";
import { useCurrency } from "@/context/CurrencyContext";
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
    const [currencyOpen, setCurrencyOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const currencyRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const session = useReduxSelector((state) => state.auth.session);
    const { currency, setCurrency } = useCurrency();

    const activeNav = NAV_ITEMS.find((item) => item.path === pathname);
    const PageIcon = activeNav?.icon ?? Crown;
    const { userCounts } = useSocket();
    const currencyMeta = CURRENCY_META[currency];

    const userInitial = [session?.first_name?.[0], session?.last_name?.[0]]
        .filter(Boolean).join("").toUpperCase() || "?";
    const fullName = getDisplayName(session);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
            if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
                setCurrencyOpen(false);
            }
        }
        if (open || currencyOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open, currencyOpen]);

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

                {/* Currency inline picker */}
                <Box customClass="appbar-avatar-wrap" ref={currencyRef}>
                    <button
                        className={clsx("appbar-currency-badge", currencyOpen && "appbar-currency-badge--open")}
                        style={{ "--currency-color": currencyMeta.color } as React.CSSProperties}
                        onClick={() => setCurrencyOpen(v => !v)}
                        aria-label="Switch currency"
                    >
                        <currencyMeta.icon size={12} strokeWidth={2.5} />
                        <span className="appbar-currency-label">{currency}</span>
                        <ChevronDown size={10} strokeWidth={2.5} className="appbar-currency-chevron" />
                    </button>

                    {currencyOpen && (
                        <Box customClass="appbar-cs-dropdown">
                            <Box customClass="appbar-cs-list">
                                {CURRENCIES.map(c => {
                                    const meta = CURRENCY_META[c];
                                    const selected = c === currency;
                                    return (
                                        <button
                                            key={c}
                                            className={clsx("appbar-cs-option", selected && "appbar-cs-option--selected")}
                                            onClick={() => { setCurrency(c); setCurrencyOpen(false); }}
                                        >
                                            <meta.icon size={14} strokeWidth={2} style={{ color: meta.color, flexShrink: 0 }} />
                                            <span className="appbar-cs-option-code">{c}</span>
                                            <span className="appbar-cs-option-name">{meta.name}</span>
                                            {selected && <Check size={12} strokeWidth={2.5} />}
                                        </button>
                                    );
                                })}
                            </Box>
                        </Box>
                    )}
                </Box>

                {/* Chat icon — mobile only */}
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
                        variant="ghost"
                        customClass={clsx("appbar-menu-btn", open && "appbar-menu-btn--open")}
                        onClick={() => setOpen((v) => !v)}
                        aria-label="User menu"
                    >
                        <MoreHorizontal size={18} strokeWidth={1.8} />
                    </Button>
                    {open && (
                        <Box customClass="appbar-dropdown">
                            <button
                                className="appbar-dropdown-profile"
                                onClick={() => { setOpen(false); navigate("/profile"); }}
                            >
                                <Box customClass="appbar-dropdown-avatar">
                                    {userInitial}
                                </Box>
                                <Box customClass="appbar-dropdown-info">
                                    <Text as="span" customClass="appbar-dropdown-name">{fullName}</Text>
                                    <Text as="span" customClass="appbar-dropdown-hint">View profile →</Text>
                                </Box>
                            </button>
                            <Box customClass="appbar-dropdown-divider" />
                            <Button
                                variant="ghost"
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
