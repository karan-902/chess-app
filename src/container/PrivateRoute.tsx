import { AnimatePresence } from "motion/react";
import BottomNav from "@/components/BottomNav";
import Box from "@/components/base/Box/Box";
import Header from "@/components/Header";
import SidebarNav from "@/components/SidebarNav";
import DepositModal from "@/pages/wallet/DepositModal";
import WithdrawModal from "@/pages/wallet/WithdrawModal";
import { NAV_ITEMS } from "@/constants/config";

import { useCallback, useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { useReduxSelector, useReduxDispatch } from "@/store/hooks";
import { updateSession } from "@/store/persisted/auth.slice";
import { callAPIInterface } from "@/utils";
import { initiateDeposit, requestWithdraw, useWalletBalance } from "@/hooks/useWallet";
import { useWalletActionModal } from "@/context/WalletActionModalContext";
import type { IProfileResponse } from "@/types/utils";

function PrivateRoute() {
    const dispatch = useReduxDispatch();
    const isLoggedIn = useReduxSelector((state) => state.auth.isLoggedIn);
    const session = useReduxSelector((state) => state.auth.session);
    const navigate = useNavigate();
    const walletActionModal = useWalletActionModal();
    const { withdrawableUsd } = useWalletBalance();

    // Fetches the latest elo/streak from GET /profile once per login session and
    // syncs it into the Redux session, so the AppBar and SidebarNav (which just
    // read state.auth.session) always show numbers fresher than whatever was
    // baked in at login time.
    useEffect(() => {
        if (!isLoggedIn) return;

        callAPIInterface<undefined, IProfileResponse>("GET", "/profile")
            .then((data) => {
                dispatch(
                    updateSession({
                        elo_rating: data.elo_rating,
                        current_streak: data.current_streak,
                        best_streak: data.best_streak,
                        skill_level: data.skill_level,
                    }),
                );
            })
            .catch(() => {
                // session values from login stand in until the next successful fetch
            });
    }, [isLoggedIn, dispatch]);

    const { pathname } = useLocation();
    const activeId =
        NAV_ITEMS.find((item) => item.path === pathname)?.id ?? "play";
    const hideChrome = pathname === "/play" || pathname === "/skill-level";

    const handleNavSelect = useCallback(
        (id: string) => {
            const item = NAV_ITEMS.find((i) => i.id === id);
            if (item) navigate(item.path);
        },
        [navigate],
    );

    if (!isLoggedIn) return <Navigate to="/login" replace />;

    if (session?.elo_rating != null && pathname === "/skill-level")
        return <Navigate to="/lobby" replace />;

    if (session?.elo_rating === null && pathname !== "/skill-level")
        return <Navigate to="/skill-level" replace />;

    const renderLayout = () => {
        return (
            <Box customClass="app-shell">
                {!hideChrome && <Header />}
                <Box customClass="app-body">
                    {!hideChrome && (
                        <SidebarNav
                            items={NAV_ITEMS}
                            activeId={activeId}
                            onSelect={handleNavSelect}
                        />
                    )}
                    <Box as="main" customClass="app-content">
                        <Outlet />
                    </Box>
                </Box>
                {!hideChrome && (
                    <BottomNav
                        items={NAV_ITEMS}
                        activeId={activeId}
                        onSelect={handleNavSelect}
                    />
                )}
                <AnimatePresence>
                    {walletActionModal.openModal === "deposit" && (
                        <DepositModal
                            key="global-deposit-modal"
                            onClose={walletActionModal.close}
                            onDeposit={initiateDeposit}
                        />
                    )}
                    {walletActionModal.openModal === "withdraw" && (
                        <WithdrawModal
                            key="global-withdraw-modal"
                            onClose={walletActionModal.close}
                            onWithdraw={requestWithdraw}
                            withdrawableUsd={withdrawableUsd}
                        />
                    )}
                </AnimatePresence>
            </Box>
        );
    };
    return <>{renderLayout()}</>;
}

export default PrivateRoute;
