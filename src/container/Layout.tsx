import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { NAV_ITEMS, PATH_TITLE } from "@/constants/config";
import Box from "@/components/base/Box/Box";
import AppBar from "@/components/base/AppBar/AppBar";
import BottomNav from "@/components/base/BottomNav/BottomNav";
import SidebarNav from "@/components/base/SidebarNav/SidebarNav";
import { setPageTitle } from "@/components/constants";

export function usePageTitle(title: string) {
    useEffect(() => {
        setPageTitle(title);
    }, [title, setPageTitle]);
}

export default function Layout() {
    return <Outlet />;
}
