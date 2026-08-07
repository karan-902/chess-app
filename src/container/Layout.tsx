import { Navigate, Outlet, useLocation, useSearchParams } from "react-router";
import BackdropLoader from "@/components/base/BackdropLoader/BackdropLoader";

export default function Layout() {
    const location = useLocation();
    const [params] = useSearchParams();
    const code = params.get("code");
    const state = params.get("state");

    const isRegister = state?.startsWith("register") ?? false;

    if (code && isRegister && location.pathname !== "/register") {
        return <Navigate to={`/register?code=${code}`} replace />;
    }
    if (code && !isRegister && location.pathname !== "/login") {
        return <Navigate to={`/login?code=${code}`} replace />;
    }

    return (
        <>
            <Outlet />
            <BackdropLoader />
        </>
    );
}
