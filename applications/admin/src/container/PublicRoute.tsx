import { Navigate, Outlet } from "react-router-dom";
import { loadAdminSession } from "@gopvp/admin/src/utils/session";
import { ROUTES } from "@gopvp/admin/src/constants/route";

export default function PublicRoute() {
 return loadAdminSession() ? (
  <Navigate to={ROUTES.DASHBOARD} replace />
 ) : (
  <Outlet />
 );
}
