import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "@gopvp/app/src/container/Layout";
import PrivateRoute from "@gopvp/app/src/container/PrivateRoute";
import PublicRoute from "@gopvp/app/src/container/PublicRoute";
import Login from "@gopvp/app/src/pages/login";
import Register from "@gopvp/app/src/pages/register";
// import ApproveDevice from "@gopvp/app/src/pages/approve-device";
import MyMatches from "@gopvp/app/src/pages/history";
import Leaderboard from "@gopvp/app/src/pages/leaderboard";
import Rules from "@gopvp/app/src/pages/rules";
import Wallet from "@gopvp/app/src/pages/wallet";
import Profile from "@gopvp/app/src/pages/profile";
import GameRoute from "@gopvp/app/src/container/GameRoute";
import PlayPage from "@gopvp/app/src/pages/play/PlayPage";
import EnteredGameRedirect from "@gopvp/app/src/container/EnteredGameRedirect";
import { GAME_PAGES } from "@gopvp/app/src/constants/config";

export const router = createBrowserRouter([
 {
  element: <Layout />,
  children: [
   {
    element: <PublicRoute />,
    children: [
     { path: "/login", element: <Login /> },
     { path: "/register", element: <Register /> },
    ],
   },
   // { path: "/approve-device", element: <ApproveDevice /> },
   {
    element: <PrivateRoute />,
    children: [
     {
      path: "/:game",
      element: <GameRoute />,
      children: [
       { index: true, element: <Navigate to={GAME_PAGES.PLAY} replace /> },
       { path: GAME_PAGES.PLAY, element: <PlayPage /> },
       { path: GAME_PAGES.MATCHES, element: <MyMatches /> },
       { path: GAME_PAGES.LEADERBOARD, element: <Leaderboard /> },
       { path: GAME_PAGES.RULES, element: <Rules /> },
      ],
     },
     { path: "/wallet", element: <Wallet /> },
     { path: "/profile", element: <Profile /> },
     { index: true, element: <EnteredGameRedirect /> },
     { path: "*", element: <EnteredGameRedirect /> },
    ],
   },
  ],
 },
]);
