import { Navigate, Outlet } from "react-router-dom";
import { loadAdminSession } from "@gopvp/admin/src/utils/session";
import { ROUTES } from "@gopvp/admin/src/constants/route";

export default function PrivateRoute() {
 return loadAdminSession() ? (
  <Outlet />
 ) : (
  <Navigate to={ROUTES.LOGIN} replace />
 );
}
