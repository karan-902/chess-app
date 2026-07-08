import { Navigate, Outlet } from "react-router";
import { useReduxSelector } from "@/store/hooks";

function PublicRoute() {
    const isLoggedIn = useReduxSelector((state) => state.auth.isLoggedIn);

    if (isLoggedIn) return <Navigate to="/lobby" replace />;

    return <Outlet />;
}

export default PublicRoute;
