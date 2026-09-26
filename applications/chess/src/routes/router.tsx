import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "@gopvp/chess/src/container/Layout";
import PrivateRoute from "@gopvp/chess/src/container/PrivateRoute";
import PublicRoute from "@gopvp/chess/src/container/PublicRoute";
import Login from "@gopvp/chess/src/pages/login";
import Register from "@gopvp/chess/src/pages/register";
// import ApproveDevice from "@gopvp/chess/src/pages/approve-device";
import MyMatches from "@gopvp/chess/src/pages/history";
import Leaderboard from "@gopvp/chess/src/pages/leaderboard";
import Rules from "@gopvp/chess/src/pages/rules";
import Wallet from "@gopvp/chess/src/pages/wallet";
import Profile from "@gopvp/chess/src/pages/profile";
import GameRoute from "@gopvp/chess/src/container/GameRoute";
import GamePlayPage from "@gopvp/chess/src/container/GamePlayPage";
import EnteredGameRedirect from "@gopvp/chess/src/container/EnteredGameRedirect";
import { GAME_PAGES } from "@gopvp/chess/src/constants/config";

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
                            { path: GAME_PAGES.PLAY, element: <GamePlayPage /> },
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
