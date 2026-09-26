import { useEffect } from "react";
import Box from "@gopvp/common/src/components/Box/Box";
import Header from "@gopvp/chess/src/components/common/Header";
import DepositModal from "@gopvp/chess/src/components/common/DepositModal";
import WithdrawModal from "@gopvp/chess/src/components/common/WithdrawModal";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useReduxSelector } from "@gopvp/chess/src/redux/hooks";
import { useWalletActionModal } from "@gopvp/chess/src/context/WalletActionModalContext";

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
