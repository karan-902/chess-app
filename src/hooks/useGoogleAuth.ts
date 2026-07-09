import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useGoogleLogin } from "@react-oauth/google";
import { callAPIInterface } from "@/utils";
import sessionService from "@/store/sessionService";
import type { ISSOBody } from "@/types/index";
import type { ILoginResponse } from "@/types/utils";

export function useGoogleAuth(
    endpoint: "/sso-login" | "/sso-register",
    state: "login" | "register",
) {
    const navigate = useNavigate();

    const processCode = useCallback(async (code: string) => {
        try {
            const res = await callAPIInterface<ISSOBody, ILoginResponse>("POST", endpoint, {
                signup_method: "google",
                google_token: code,
                redirect_uri: window.location.origin,
            });
            await sessionService.saveSession(res);
            navigate("/lobby");
        } catch (err) {
            console.error(err);
        }
    }, [endpoint, navigate]);

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get("code");
        if (!code) return;
        window.history.replaceState({}, "", window.location.pathname);
        processCode(code);
    }, [processCode]);

    const googleLogin = useGoogleLogin({
        flow: "auth-code",
        ux_mode: "redirect",
        redirect_uri: window.location.origin,
        state,
        onError: () => console.error(`Google ${state} failed`),
    });

    return { googleLogin };
}
