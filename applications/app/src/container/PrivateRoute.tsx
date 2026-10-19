import { useEffect } from "react";
import Box from "@gopvp/common/src/components/Box/Box";
import Header from "@gopvp/app/src/components/common/Header";
import DepositSheet from "@gopvp/app/src/components/common/DepositSheet";
import WithdrawSheet from "@gopvp/app/src/components/common/WithdrawSheet";
import { Navigate, Outlet, useLocation, useMatch } from "react-router-dom";
import { useReduxDispatch, useReduxSelector } from "@gopvp/app/src/redux/hooks";
import { fetchWalletBalance } from "@gopvp/app/src/redux/wallet/thunk";
import { setWalletDoc } from "@gopvp/app/src/redux/wallet/slice";
import { useWalletModal } from "@gopvp/app/src/context/WalletModalContext";
import { subscribeWallet } from "@gopvp/app/src/utils/matchResult";
import { ROUTES } from "@gopvp/app/src/constants/route";

function PrivateRoute() {
 const isLoggedIn = useReduxSelector((state) => state.auth.isLoggedIn);
 const country = useReduxSelector((state) => state.auth.session?.country);
 const location = useLocation();
 const userId = useReduxSelector((state) => state.auth.session?.id);
 const dispatch = useReduxDispatch();
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

 useEffect(
  () =>
   subscribeWallet(userId, (walletDoc) => dispatch(setWalletDoc(walletDoc))),
  [userId, dispatch],
 );

 if (!isLoggedIn) return <Navigate to={ROUTES.LOGIN} replace />;
 if (!country) return <Navigate to={`${ROUTES.LOGIN}?step=country`} replace />;

 const renderLayout = () => {
  return (
   <Box className="app-root container">
    {!isInGameRoom && !isPickGamePage && <Header />}
    <Box className="app-wrapper">
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
