import { createBrowserRouter } from "react-router-dom";
import Layout from "@gopvp/app/src/container/Layout";
import PrivateRoute from "@gopvp/app/src/container/PrivateRoute";
import PublicRoute from "@gopvp/app/src/container/PublicRoute";
import Login from "@gopvp/app/src/pages/login";
import Register from "@gopvp/app/src/pages/register";
// import ApproveDevice from "@gopvp/app/src/pages/approve-device";
import Wallet from "@gopvp/app/src/pages/wallet";
import Profile from "@gopvp/app/src/pages/profile";
import GameRoute from "@gopvp/app/src/container/GameRoute";
import EnteredGameRedirect from "@gopvp/app/src/container/EnteredGameRedirect";
import GamePicker from "@gopvp/app/src/pages/games";
import { ROUTES } from "@gopvp/app/src/constants/route";

export const router = createBrowserRouter([
 {
  element: <Layout />,
  children: [
   {
    element: <PublicRoute />,
    children: [
     { path: ROUTES.LOGIN, element: <Login /> },
     { path: ROUTES.REGISTER, element: <Register /> },
    ],
   },
   // { path: ROUTES.APPROVE_DEVICE, element: <ApproveDevice /> },
   {
    element: <PrivateRoute />,
    children: [
     { path: "/:game", element: <GameRoute /> },
     { path: ROUTES.WALLET, element: <Wallet /> },
     { path: ROUTES.PROFILE, element: <Profile /> },
     { path: ROUTES.PICK_GAME, element: <GamePicker /> },
     { index: true, element: <EnteredGameRedirect /> },
     { path: "*", element: <EnteredGameRedirect /> },
    ],
   },
  ],
 },
]);
