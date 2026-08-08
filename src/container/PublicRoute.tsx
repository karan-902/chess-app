import { Navigate, Outlet } from "react-router";
import { useReduxSelector } from "@/redux/hooks";

function PublicRoute() {
    const isLoggedIn = useReduxSelector((state) => state.auth.isLoggedIn);
    const country = useReduxSelector((state) => state.auth.session?.country);
    if (isLoggedIn && country) return <Navigate to="/play" replace />;
    return <Outlet />;
}

export default PublicRoute;
