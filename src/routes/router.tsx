import { createBrowserRouter, Navigate, useSearchParams } from "react-router";
import Layout from "@/container/Layout";
import PrivateRoute from "@/container/PrivateRoute";
import PublicRoute from "@/container/PublicRoute";
import Leaderboard from "@/pages/leaderboard";
import GameHistory from "@/pages/history";
import ChatPage from "@/pages/chat";
import Lobby from "@/pages/loby";
import Login from "@/pages/login";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import Matchmaking from "@/pages/matchmaking";
import Play from "@/pages/play";
import Register from "@/pages/register";
import Wallet from "@/pages/wallet";
import ProfilePage from "@/pages/profile";

function IndexRedirect() {
    const [params] = useSearchParams();
    const code = params.get("code");
    const state = params.get("state");

    if (code && state === "register") {
        return <Navigate to={`/register?code=${code}`} replace />;
    }
    if (code) {
        return <Navigate to={`/login?code=${code}`} replace />;
    }
    return <Navigate to="/login" replace />;
}

export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { index: true, element: <IndexRedirect /> },
            {
                element: <PublicRoute />,
                children: [
                    { path: "/login", element: <Login /> },
                    { path: "/register", element: <Register /> },
                    { path: "/forgot-password", element: <ForgotPassword /> },
                    { path: "/reset-password", element: <ResetPassword /> },
                ],
            },
            {
                element: <PrivateRoute />,
                children: [
                    { path: "/lobby",        element: <Lobby />       },
                    { path: "/matchmaking",  element: <Matchmaking /> },
                    { path: "/chat",         element: <ChatPage />    },
                    { path: "/history",      element: <GameHistory /> },
                    { path: "/wallet",       element: <Wallet />      },
                    { path: "/leaderboard",  element: <Leaderboard /> },
                    { path: "/play",         element: <Play />        },
                    { path: "/profile",      element: <ProfilePage /> },
                ],
            },
        ],
    },
]);
