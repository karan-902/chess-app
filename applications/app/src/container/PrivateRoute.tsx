import { useEffect } from "react";
import Box from "@gopvp/common/src/components/Box/Box";
import Header from "@gopvp/app/src/components/common/Header";
import DepositSheet from "@gopvp/app/src/components/common/DepositSheet";
import WithdrawSheet from "@gopvp/app/src/components/common/WithdrawSheet";
import { Navigate, Outlet, useLocation, useMatch } from "react-router-dom";
import { useReduxDispatch, useReduxSelector } from "@gopvp/app/src/redux/hooks";
import { fetchWalletBalance } from "@gopvp/app/src/redux/wallet/thunk";
import { useWalletModal } from "@gopvp/app/src/context/WalletModalContext";
import { useSocket } from "@gopvp/app/src/context/SocketContext";
import { ROUTES } from "@gopvp/app/src/constants/route";
import { SOCKET_EVENTS } from "@gopvp/common/src/constants/event";

function PrivateRoute() {
 const isLoggedIn = useReduxSelector((state) => state.auth.isLoggedIn);
 const country = useReduxSelector((state) => state.auth.session?.country);
 const location = useLocation();
 const dispatch = useReduxDispatch();
 const { socket } = useSocket();
 const { close } = useWalletModal();
 const isAppReady = isLoggedIn && !!country;
 const searchParams = new URLSearchParams(location.search);
 const isInGameRoom =
  searchParams.has("match_id") || searchParams.has("practice_id");
 const isPickGamePage = !!useMatch(ROUTES.PICK_GAME);

 useEffect(() => {
  close();
 }, [location.pathname, close]);

 useEffect(() => {
  if (isAppReady) dispatch(fetchWalletBalance());
 }, [isAppReady, dispatch]);

 useEffect(() => {
  if (!socket) return;
  const refetchBalance = () => dispatch(fetchWalletBalance());
  socket.on(SOCKET_EVENTS.WALLET_UPDATED, refetchBalance);
  return () => {
   socket.off(SOCKET_EVENTS.WALLET_UPDATED, refetchBalance);
  };
 }, [socket, dispatch]);

 if (!isLoggedIn) return <Navigate to={ROUTES.LOGIN} replace />;
 if (!country) return <Navigate to={`${ROUTES.LOGIN}?step=country`} replace />;

 const renderLayout = () => {
  return (
   <Box customClass="app-shell">
    {!isInGameRoom && !isPickGamePage && <Header />}
    <Box customClass="app-body">
     <Box component="main" customClass="app-content">
      <Outlet />
     </Box>
    </Box>
    <DepositSheet />
    <WithdrawSheet />
   </Box>
  );
 };
 return <>{renderLayout()}</>;
}

export default PrivateRoute;
