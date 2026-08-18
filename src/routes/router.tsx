import { createBrowserRouter, Navigate } from "react-router";
import Layout from "@/container/Layout";
import PrivateRoute from "@/container/PrivateRoute";
import PublicRoute from "@/container/PublicRoute";
import Login from "@/pages/login";
import Register from "@/pages/register";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import VerifyEmail from "@/pages/verify-email";
import ApproveDevice from "@/pages/approve-device";
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
                    { path: "/forgot-password", element: <ForgotPassword /> },
                    { path: "/reset-password", element: <ResetPassword /> },
                    { path: "/verify-email", element: <VerifyEmail /> },
                ],
            },
            { path: "/approve-device", element: <ApproveDevice /> },
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
