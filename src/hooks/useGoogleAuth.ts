import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { callAPIInterface } from "@/utils";
import { getDeviceFingerprint } from "@/utils/fingerprint";
import sessionService from "@/store/sessionService";
import type { ISSOBody } from "@/types/index";
import type { ILoginResponse } from "@/types/utils";

export function useGoogleAuth(
    endpoint: "/sso-login" | "/sso-register",
    state: "login" | "register",
) {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(
        () => Boolean(new URLSearchParams(window.location.search).get("code")),
    );

    const processCode = useCallback(async (code: string) => {
        setIsProcessing(true);
        try {
            const fingerprint = await getDeviceFingerprint();
            const res = await callAPIInterface<ISSOBody, ILoginResponse>("POST", endpoint, {
                signup_method: "google",
                google_token: code,
                redirect_uri: window.location.origin,
                fingerprint,
            });
            await sessionService.saveSession(res);
            setIsProcessing(false);
            navigate(res.skill_level === null ? "/skill-level" : "/lobby");
        } catch (err: any) {
            // Google auth codes are single-use, so a device conflict here
            // can't be resolved by silently retrying the same code (unlike
            // the email/password flow) — the user has to run Google sign-in
            // again once they've decided to switch devices.
            if (err?.response?.data?.type === "device_conflict") {
                toast.error(
                    `You're logged in on ${err.response.data.existing_device}. Sign in with Google again to switch to this device.`,
                );
            }
            console.error(err);
            setIsProcessing(false);
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

    return { googleLogin, isProcessing };
}
