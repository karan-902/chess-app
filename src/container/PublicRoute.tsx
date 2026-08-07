import { Navigate, Outlet } from "react-router";
import { useReduxSelector } from "@/redux/hooks";

function PublicRoute() {
    const isLoggedIn = useReduxSelector((state) => state.auth.isLoggedIn);
    if (isLoggedIn) return <Navigate to="/play" replace />;
    return <Outlet />;
}

export default PublicRoute;
