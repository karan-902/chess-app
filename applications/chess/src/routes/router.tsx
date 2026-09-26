import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "@/container/Layout";
import PrivateRoute from "@/container/PrivateRoute";
import PublicRoute from "@/container/PublicRoute";
import Login from "@/pages/login";
import Register from "@/pages/register";
// import ApproveDevice from "@/pages/approve-device";
import MyMatches from "@/pages/history";
import Leaderboard from "@/pages/leaderboard";
import Rules from "@/pages/rules";
import Wallet from "@/pages/wallet";
import Profile from "@/pages/profile";
import GameRoute from "@/container/GameRoute";
import GamePlayPage from "@/container/GamePlayPage";
import EnteredGameRedirect from "@/container/EnteredGameRedirect";
import { GAME_PAGES } from "@/constants/config";

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
