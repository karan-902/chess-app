import Box from "@/components/base/Box/Box";
import Header from "@/components/Header";
import DepositModal from "@/components/DepositModal";
import WithdrawModal from "@/components/WithdrawModal";
import { Navigate, Outlet } from "react-router";
import { useReduxSelector } from "@/redux/hooks";

function PrivateRoute() {
    const isLoggedIn = useReduxSelector((state) => state.auth.isLoggedIn);

    if (!isLoggedIn) return <Navigate to="/login" replace />;

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
