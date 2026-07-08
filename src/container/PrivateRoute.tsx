import AppBar from "@/components/base/AppBar/AppBar";
import BottomNav from "@/components/base/BottomNav/BottomNav";
import Box from "@/components/base/Box/Box";
import SidebarNav from "@/components/base/SidebarNav/SidebarNav";
import { NAV_ITEMS, BOTTOM_NAV_ITEMS } from "@/constants/config";

import React, { useCallback } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { useReduxSelector } from "@/store/hooks";

function PrivateRoute() {
    const isLoggedIn = useReduxSelector((state) => state.auth.isLoggedIn);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const activeId =
        NAV_ITEMS.find((item) => item.path === pathname)?.id ?? "play";
    const isGameView = pathname === "/play";

    if (!isLoggedIn) return <Navigate to="/login" replace />;

    const handleNavSelect = useCallback(
        (id: string) => {
            const item = NAV_ITEMS.find((i) => i.id === id);
            if (item) navigate(item.path);
        },
        [navigate],
    );

    return (
        <Box customClass="app-shell">
            {!isGameView && <AppBar />}
            <Box customClass="app-body">
                {!isGameView && (
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
            {!isGameView && (
                <BottomNav
                    items={BOTTOM_NAV_ITEMS}
                    activeId={activeId}
                    onSelect={handleNavSelect}
                />
            )}
        </Box>
    );
}

export default PrivateRoute;
