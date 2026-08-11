import { useEffect } from "react";
import Box from "@/components/base/Box/Box";
import Header from "@/components/Header";
import DepositModal from "@/components/DepositModal";
import WithdrawModal from "@/components/WithdrawModal";
import { Navigate, Outlet, useLocation } from "react-router";
import { useReduxSelector } from "@/redux/hooks";
import { useWalletActionModal } from "@/context/WalletActionModalContext";

function PrivateRoute() {
    const isLoggedIn = useReduxSelector((state) => state.auth.isLoggedIn);
    const country = useReduxSelector((state) => state.auth.session?.country);
    const location = useLocation();
    const { close } = useWalletActionModal();

    useEffect(() => {
        close();
    }, [location.pathname]);

    if (!isLoggedIn) return <Navigate to="/login" replace />;
    if (!country) return <Navigate to="/login?step=country" replace />;

    const renderLayout = () => {
        return (
            <Box customClass="app-shell">
                <Header />
                <Box customClass="app-body">
                    <Box component="main" customClass="app-content">
                        <Outlet />
                    </Box>
                </Box>
                <DepositModal />
                <WithdrawModal />
            </Box>
        );
    };
    return <>{renderLayout()}</>;
}

export default PrivateRoute;
