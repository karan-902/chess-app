import { Outlet } from "react-router-dom";
import { useReduxSelector } from "@/redux/hooks";
import EnteredGameRedirect from "@/container/EnteredGameRedirect";

function PublicRoute() {
    const isLoggedIn = useReduxSelector((state) => state.auth.isLoggedIn);
    const country = useReduxSelector((state) => state.auth.session?.country);
    if (isLoggedIn && country) return <EnteredGameRedirect />;
    return <Outlet />;
}

export default PublicRoute;
