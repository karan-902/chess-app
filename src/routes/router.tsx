import { createBrowserRouter, Navigate } from "react-router";
import Layout from "@/container/Layout";
import PrivateRoute from "@/container/PrivateRoute";
import PublicRoute from "@/container/PublicRoute";
import Login from "@/pages/login/Login";
import Register from "@/pages/register/Register";
import PlayPage from "@/pages/play/PlayPage";
import MyMatches from "@/pages/history";
import Leaderboard from "@/pages/leaderboard";
import Rules from "@/pages/rules";
import Wallet from "@/pages/wallet";
import Profile from "@/pages/profile";

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
            {
                element: <PrivateRoute />,
                children: [
                    { path: "/play", element: <PlayPage /> },
                    { path: "/history", element: <MyMatches /> },
                    { path: "/leaderboard", element: <Leaderboard /> },
                    { path: "/rules", element: <Rules /> },
                    { path: "/wallet", element: <Wallet /> },
                    { path: "/profile", element: <Profile /> },
                    { index: true, element: <Navigate to="/play" replace /> },
                ],
            },
        ],
    },
]);
