import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { useGoogleLogin } from "@react-oauth/google";
import { useReduxDispatch } from "@/redux/hooks";
import { googleLogin as googleLoginThunk } from "@/redux/thunks";
import { showLoader, hideLoader } from "@/redux/loader.slice";
import { showToast } from "@/redux/toast.slice";

const CONFIRM_SWITCH_KEY = "ks_sso_confirm_device_switch";

export function useGoogleAuth(
    endpoint: "/sso-login" | "/sso-register",
    state: "login" | "register",
    hint?: string,
) {
    const navigate = useNavigate();
    const dispatch = useReduxDispatch();
    const [isProcessing, setIsProcessing] = useState(() =>
        Boolean(new URLSearchParams(window.location.search).get("code")),
    );

    const processCode = useCallback(
        async (code: string) => {
            setIsProcessing(true);
            dispatch(showLoader({ text: "Signing in..." }));

            try {
                const res = await dispatch(
                    googleLoginThunk({
                        endpoint,
                        body: {
                            signup_method: "google",
                            google_token: code,
                            redirect_uri: window.location.origin,
                        },
                    }),
                ).unwrap();
                navigate(res.skill_level === null ? "/skill-level" : "/play");
            } catch (err: any) {
                if (err?.type === "device_conflict") {
                    sessionStorage.setItem(CONFIRM_SWITCH_KEY, "1");
                    dispatch(
                        showToast({
                            message: `You're logged in on ${err.existing_device}. Sign in with Google again to switch to this device.`,
                            severity: "error",
                        }),
                    );
                }
                console.error(err);
            } finally {
                setIsProcessing(false);
                dispatch(hideLoader());
            }
        },
        [endpoint, navigate, dispatch],
    );

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get("code");
        if (!code) return;
        window.history.replaceState({}, "", window.location.pathname);
        processCode(code);
    }, [processCode]);

    const triggerGoogleLogin = useGoogleLogin({
        flow: "auth-code",
        ux_mode: "redirect",
        redirect_uri: window.location.origin,
        state: hint ? `${state}:${hint}` : state,
        hint: hint || undefined,
        onError: () => {
            dispatch(hideLoader());
            console.error(`Google ${state} failed`);
        },
    });

    const googleLogin = () => {
        dispatch(showLoader());
        triggerGoogleLogin();
    };

    return { googleLogin, isProcessing };
}
