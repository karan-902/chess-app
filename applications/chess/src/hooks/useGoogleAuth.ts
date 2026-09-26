import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useReduxDispatch } from "@gopvp/chess/src/redux/hooks";
import { googleLogin as googleLoginThunk } from "@gopvp/chess/src/redux/auth/thunk";
import { showLoader, hideLoader, showToast } from "@gopvp/chess/src/redux/common/slice";

// const CONFIRM_SWITCH_KEY = "ks_sso_confirm_device_switch";

export function useGoogleAuth(hint?: string) {
 const navigate = useNavigate();
 const dispatch = useReduxDispatch();
 const [isProcessing, setIsProcessing] = useState(() =>
  Boolean(new URLSearchParams(window.location.search).get("code")),
 );
 // const [pendingApprovalToken, setPendingApprovalToken] = useState<
 //     string | null
 // >(null);

 const processCode = useCallback(
  async (code: string) => {
   setIsProcessing(true);
   dispatch(showLoader({ text: "Signing in..." }));

   try {
    await dispatch(
     googleLoginThunk({
      code,
      redirect_uri: window.location.origin,
     }),
    ).unwrap();
    // if ("status" in res) {
    //     setPendingApprovalToken(res.approval_token);
    //     return;
    // }
    navigate("/");
   } catch (err: any) {
    if (!err?.isNetworkError && err?.status !== 429 && err?.message) {
     dispatch(
      showToast({
       isToastOpen: true,
       toastMessage: err.message,
       toastVariant: "error",
      }),
     );
    }
    // if (err?.type === "device_conflict") {
    //     sessionStorage.setItem(CONFIRM_SWITCH_KEY, "1");
    //     dispatch(
    //         showToast({
    //             isToastOpen: true,
    //             toastMessage: `You're logged in on ${err.existing_device}. Sign in with Google again to switch to this device.`,
    //             toastVariant: "error",
    //         }),
    //     );
    // }
    console.error(err);
   } finally {
    setIsProcessing(false);
    dispatch(hideLoader());
   }
  },
  [navigate, dispatch],
 );

 useEffect(() => {
  const code = new URLSearchParams(window.location.search).get("code");
  if (!code) return;
  window.history.replaceState({}, "", window.location.pathname);
  processCode(code);
 }, [processCode]);

 useEffect(() => {
  const handlePageShow = (e: PageTransitionEvent) => {
   if (e.persisted) dispatch(hideLoader());
  };
  window.addEventListener("pageshow", handlePageShow);
  return () => window.removeEventListener("pageshow", handlePageShow);
 }, [dispatch]);

 const triggerGoogleLogin = useGoogleLogin({
  flow: "auth-code",
  ux_mode: "redirect",
  redirect_uri: window.location.origin,
  state: hint ? `login:${hint}` : "login",
  hint: hint || undefined,
  onError: () => {
   dispatch(hideLoader());
   console.error("Google login failed");
  },
 });

 const googleLogin = () => {
  dispatch(showLoader());
  triggerGoogleLogin();
 };

 return { googleLogin, isProcessing /* , pendingApprovalToken */ };
}
