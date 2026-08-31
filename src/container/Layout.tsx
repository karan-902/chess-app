import { useEffect } from "react";
import { Navigate, Outlet, useLocation, useSearchParams } from "react-router";
import BackdropLoader from "@/components/base/BackdropLoader/BackdropLoader";
import Notification from "@/components/base/Notification/Notification";

const APP_NAME = "Chess";

const PAGE_TITLES: Record<string, string> = {
    "/login": "Sign in",
    "/register": "Register",
    "/forgot-password": "Forgot password",
    "/reset-password": "Reset password",
    "/verify-email": "Verify email",
    "/approve-device": "Approve device",
    "/play": "Play",
    "/matches": "Matches",
    "/leaderboard": "Leaderboard",
    "/rules": "Rules",
    "/wallet": "Wallet",
    "/profile": "Profile",
};

export default function Layout() {
    const location = useLocation();
    const [params] = useSearchParams();
    const code = params.get("code");
    const state = params.get("state");

    const isRegister = state?.startsWith("register") ?? false;

    useEffect(() => {
        const pageTitle = PAGE_TITLES[location.pathname];
        document.title = pageTitle ? `${APP_NAME}: ${pageTitle}` : APP_NAME;
    }, [location.pathname]);

    if (code && !isRegister && location.pathname !== "/login") {
        return <Navigate to={`/login?code=${code}`} replace />;
    }

    return (
        <>
            <Outlet />
            <BackdropLoader />
            <Notification />
        </>
    );
}
