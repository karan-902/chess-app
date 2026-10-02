import { Outlet } from "react-router-dom";
import { useReduxSelector } from "@gopvp/app/src/redux/hooks";
import EnteredGameRedirect from "@gopvp/app/src/container/EnteredGameRedirect";

function PublicRoute() {
 const isLoggedIn = useReduxSelector((state) => state.auth.isLoggedIn);
 const country = useReduxSelector((state) => state.auth.session?.country);
 if (isLoggedIn && country) return <EnteredGameRedirect />;
 return <Outlet />;
}

export default PublicRoute;
