import { createBrowserRouter, Navigate } from "react-router-dom";
import PrivateRoute from "@gopvp/admin/src/container/PrivateRoute";
import PublicRoute from "@gopvp/admin/src/container/PublicRoute";
import AdminLayout from "@gopvp/admin/src/container/AdminLayout";
import Login from "@gopvp/admin/src/pages/login";
import Dashboard from "@gopvp/admin/src/pages/dashboard";
import { ROUTES } from "@gopvp/admin/src/constants/route";

export const router = createBrowserRouter([
 {
  element: <PublicRoute />,
  children: [{ path: ROUTES.LOGIN, element: <Login /> }],
 },
 {
  element: <PrivateRoute />,
  children: [
   {
    element: <AdminLayout />,
    children: [{ index: true, element: <Dashboard /> }],
   },
  ],
 },
 { path: "*", element: <Navigate to={ROUTES.DASHBOARD} replace /> },
]);
