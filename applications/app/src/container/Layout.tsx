import { useEffect } from "react";
import {
 Navigate,
 Outlet,
 useLocation,
 useNavigate,
 useSearchParams,
} from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { setNavigator } from "@gopvp/common/src/util/navigationService";
import Box from "@gopvp/common/src/components/Box/Box";
import BackdropLoader from "@gopvp/app/src/components/common/BackdropLoader/BackdropLoader";
import Notification from "@gopvp/app/src/components/common/Notification/Notification";
import {
 useReduxDispatch,
 useReduxSelector,
} from "@gopvp/app/src/redux/hooks";
import { setLaunchParams } from "@gopvp/app/src/redux/speed/slice";
import { setEnteredGame } from "@gopvp/app/src/redux/game/slice";
import { fetchGameDetails } from "@gopvp/app/src/redux/game/thunk";
import { GAMES, GAME_PAGE_TITLES } from "@gopvp/app/src/constants/config";
import { getGameFromPath, isGameSlug } from "@gopvp/app/src/utils";

const APP_NAME = "GoPVP";

const PAGE_TITLES: Record<string, string> = {
 "/login": "Sign in",
 "/register": "Register",
 // "/approve-device": "Approve device",
 "/wallet": "Wallet",
 "/profile": "Profile",
};

export default function Layout() {
 const location = useLocation();
 const navigate = useNavigate();
 const dispatch = useReduxDispatch();
 const [params] = useSearchParams();
 const code = params.get("code");
 const state = params.get("state");
 const acct = params.get("acct");
 const { enteredGame, requestedSlug, details } = useReduxSelector(
  (state) => state.game,
 );
 const gameSlug = getGameFromPath(location.pathname) ?? enteredGame;
 const isGameLoading = !!gameSlug && details?.slug !== gameSlug;

 const isRegister = state?.startsWith("register") ?? false;

 useEffect(() => {
  if (gameSlug && gameSlug !== requestedSlug)
   dispatch(fetchGameDetails(gameSlug));
 }, [gameSlug, requestedSlug, dispatch]);

 useEffect(() => {
  setNavigator(navigate);
 }, [navigate]);

 useEffect(() => {
  if (!acct) return;
  const balBtc = params.get("bal_btc");
  const balUsdt = params.get("bal_usdt");
  dispatch(
   setLaunchParams({
    acct,
    lang: params.get("lang"),
    balBtc: balBtc === null ? null : Number(balBtc),
    balUsdt: balUsdt === null ? null : Number(balUsdt),
    lightningAddress: params.get("p_add"),
   }),
  );
 }, [acct, params, dispatch]);

 useEffect(() => {
  const [, gameSegment, gamePage] = location.pathname.split("/");
  if (isGameSlug(gameSegment)) dispatch(setEnteredGame(gameSegment));
  const titlePrefix = isGameSlug(gameSegment)
   ? GAMES[gameSegment].label
   : APP_NAME;
  const pageTitle = isGameSlug(gameSegment)
   ? GAME_PAGE_TITLES[gamePage]
   : PAGE_TITLES[location.pathname];
  document.title = pageTitle ? `${titlePrefix}: ${pageTitle}` : titlePrefix;
 }, [location.pathname, dispatch]);

 if (code && !isRegister && location.pathname !== "/login") {
  return <Navigate to={`/login?code=${code}`} replace />;
 }

 if (isGameLoading) {
  return (
   <>
    <Box customClass="gopvp-circular-loader">
     <CircularProgress />
    </Box>
    <Notification />
   </>
  );
 }

 return (
  <>
   <Outlet />
   <BackdropLoader />
   <Notification />
  </>
 );
}
