import { useEffect, useRef } from "react";
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
import { SCROLLBAR_HIDE_DELAY_MS } from "@gopvp/app/src/constants/limit";

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
 const contentRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
  const content = contentRef.current;
  if (!content) return;
  let hideTimer: ReturnType<typeof setTimeout>;
  const showScrollbar = () => {
   content.classList.add("is-scrolling");
   clearTimeout(hideTimer);
   hideTimer = setTimeout(
    () => content.classList.remove("is-scrolling"),
    SCROLLBAR_HIDE_DELAY_MS,
   );
  };
  content.addEventListener("scroll", showScrollbar, { passive: true });
  return () => {
   clearTimeout(hideTimer);
   content.removeEventListener("scroll", showScrollbar);
  };
 }, [isAppReady]);

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
  socket.on(SOCKET_EVENTS.TRANSACTION_COMPLETED, refetchBalance);
  return () => {
   socket.off(SOCKET_EVENTS.WALLET_UPDATED, refetchBalance);
   socket.off(SOCKET_EVENTS.TRANSACTION_COMPLETED, refetchBalance);
  };
 }, [socket, dispatch]);

 if (!isLoggedIn) return <Navigate to={ROUTES.LOGIN} replace />;
 if (!country) return <Navigate to={`${ROUTES.LOGIN}?step=country`} replace />;

 const renderLayout = () => {
  return (
   <Box className="app-root container">
    {!isInGameRoom && !isPickGamePage && <Header />}
    <Box className="app-wrapper">
     <Box component="main" customClass="app-content" ref={contentRef}>
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
