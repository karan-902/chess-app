import { useEffect } from "react";
import Box from "@gopvp/common/src/components/Box/Box";
import Header from "@gopvp/app/src/components/common/Header";
import DepositModal from "@gopvp/app/src/components/common/DepositModal";
import WithdrawModal from "@gopvp/app/src/components/common/WithdrawModal";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useReduxDispatch, useReduxSelector } from "@gopvp/app/src/redux/hooks";
import { fetchWalletBalance } from "@gopvp/app/src/redux/wallet/thunk";
import { useWalletModal } from "@gopvp/app/src/context/WalletModalContext";
import { useSocket } from "@gopvp/app/src/context/SocketContext";

function PrivateRoute() {
 const isLoggedIn = useReduxSelector((state) => state.auth.isLoggedIn);
 const country = useReduxSelector((state) => state.auth.session?.country);
 const location = useLocation();
 const dispatch = useReduxDispatch();
 const { socket } = useSocket();
 const { close } = useWalletModal();
 const isAppReady = isLoggedIn && !!country;

 useEffect(() => {
  close();
 }, [location.pathname]);

 useEffect(() => {
  if (isAppReady) dispatch(fetchWalletBalance());
 }, [isAppReady, dispatch]);

 useEffect(() => {
  if (!socket) return;
  const refetchBalance = () => dispatch(fetchWalletBalance());
  socket.on("wallet:updated", refetchBalance);
  return () => {
   socket.off("wallet:updated", refetchBalance);
  };
 }, [socket, dispatch]);

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
