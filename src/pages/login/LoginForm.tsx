import { useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { useFormik } from "formik";
import { object, string } from "yup";
import { Link, useNavigate } from "react-router";
import Box from "../../components/base/Box/Box";
import Button from "../../components/base/Button/Button";
import { Label } from "../../components/base/Label/label";
import Input from "../../components/base/Input/Input";
import Text from "../../components/base/Text/Text";
import DeviceConflictModal from "@/components/DeviceConflictModal";

import { callAPIInterface } from "../../utils";
import { getDeviceFingerprint } from "@/utils/fingerprint";
import sessionService from "../../store/sessionService";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { useReduxDispatch } from "../../store/hooks";
import { showLoader, hideLoader } from "../../store/loader.slice";
import EmailVerificationScreen from "../register/EmailVerificationScreen";
import { useState } from "react";
import {
    authBackLink,
    authContinueWithGoogle,
    authEmailLabel,
    authEmailPlaceholder,
    authOr,
    authPasswordLabel,
    authPasswordPlaceholder,
    authLoginContinueButton,
    authLoginForgotPassword,
    authLoginIncorrectPassword,
    authLoginNoAccountFound,
    authLoginSignInButton,
    authValidationEmailInvalid,
    authValidationEmailRequired,
    authValidationPasswordRequired,
} from "@/components/messages";
import type { ILoginBody, IVerifyUserBody } from "../../types/index";
import type { ILoginResponse, IVerifyUserResponse } from "../../types/utils";
import { GoogleIcon } from "@/components/constants";

export default function LoginForm() {
    const [step, setStep] = useState<"email" | "password" | "verify-otp">(
        "email",
    );
    const [verifiedEmail, setVerifiedEmail] = useState("");
    const [deviceConflict, setDeviceConflict] = useState<{
        deviceName: string;
        password: string;
    } | null>(null);
    const [confirmingSwitch, setConfirmingSwitch] = useState(false);
    const navigate = useNavigate();
    const dispatch = useReduxDispatch();
    const { googleLogin, isProcessing } = useGoogleAuth("/sso-login", "login");

    const attemptLogin = async (password: string, confirmSwitch: boolean) => {
        const fingerprint = await getDeviceFingerprint();
        console.log(fingerprint);
        const res = await callAPIInterface<ILoginBody, ILoginResponse>(
            "POST",
            "/login",
            {
                email: verifiedEmail,
                password,
                fingerprint,
                confirm_device_switch: confirmSwitch,
            },
        );
        await sessionService.saveSession(res);
        navigate(res.skill_level === null ? "/skill-level" : "/lobby");
    };

    useEffect(() => {
        if (isProcessing)
            dispatch(showLoader({ text: "Signing in with Google..." }));
        else dispatch(hideLoader());
        return () => {
            dispatch(hideLoader());
        };
    }, [isProcessing]);

    // ── Step 1: email ──
    const emailFormik = useFormik({
        initialValues: { email: "" },
        validationSchema: object({
            email: string()
                .required(authValidationEmailRequired)
                .email(authValidationEmailInvalid),
        }),
        onSubmit: async ({ email }, { setSubmitting, setFieldError }) => {
            try {
                const res = await callAPIInterface<
                    IVerifyUserBody,
                    IVerifyUserResponse
                >("POST", "/verify-user", { email });
                setVerifiedEmail(email);
                if (res.signup_method === "google") {
                    googleLogin();
                } else if (!res.email_verified) {
                    setStep("verify-otp");
                } else {
                    setStep("password");
                }
            } catch {
                setFieldError("email", authLoginNoAccountFound);
            } finally {
                setSubmitting(false);
            }
        },
    });

    // ── Step 2: password ──
    const passwordFormik = useFormik({
        initialValues: { password: "" },
        validationSchema: object({
            password: string().required(authValidationPasswordRequired),
        }),
        onSubmit: async ({ password }, { setSubmitting, setFieldError }) => {
            dispatch(showLoader({ text: "Signing in..." }));
            try {
                await attemptLogin(password, false);
            } catch (err: any) {
                if (err?.response?.data?.type === "device_conflict") {
                    setDeviceConflict({
                        deviceName: err.response.data.existing_device,
                        password,
                    });
                } else {
                    setFieldError("password", authLoginIncorrectPassword);
                }
            } finally {
                dispatch(hideLoader());
                setSubmitting(false);
            }
        },
    });

    const handleConfirmDeviceSwitch = async () => {
        if (!deviceConflict) return;
        setConfirmingSwitch(true);
        try {
            await attemptLogin(deviceConflict.password, true);
        } catch {
            passwordFormik.setFieldError(
                "password",
                authLoginIncorrectPassword,
            );
        } finally {
            setConfirmingSwitch(false);
            setDeviceConflict(null);
        }
    };

    if (step === "verify-otp") {
        return (
            <EmailVerificationScreen
                email={verifiedEmail}
                onVerified={() => setStep("password")}
                onBack={() => setStep("email")}
            />
        );
    }

    if (step === "password") {
        return (
            <>
                <Box
                    as="form"
                    customClass="auth-form"
                    onSubmit={passwordFormik.handleSubmit}
                >
                    <Button
                        type="button"
                        variant="ghost"
                        customClass="reg-back-link"
                        onClick={() => setStep("email")}
                    >
                        {authBackLink}
                    </Button>

                    <Box customClass="auth-verified-email">
                        <Text as="span" customClass="auth-verified-email-text">
                            {verifiedEmail}
                        </Text>
                    </Box>

                    <Box customClass="auth-field">
                        <Label
                            htmlFor="password"
                            className="font-mono text-[11px] tracking-[0.08em] uppercase text-white/30"
                        >
                            {authPasswordLabel}
                        </Label>
                        <Input
                            name="password"
                            id="password"
                            type="password"
                            placeholder={authPasswordPlaceholder}
                            autoComplete="current-password"
                            value={passwordFormik.values.password}
                            onChange={passwordFormik.handleChange}
                            onBlur={passwordFormik.handleBlur}
                            isError={
                                passwordFormik.touched.password &&
                                Boolean(passwordFormik.errors.password)
                            }
                            helperText={
                                passwordFormik.touched.password
                                    ? passwordFormik.errors.password
                                    : undefined
                            }
                            fullWidth
                        />
                    </Box>

                    <Box customClass="auth-forgot">
                        <Link to="/forgot-password">
                            {authLoginForgotPassword}
                        </Link>
                    </Box>

                    <Button
                        type="submit"
                        fullWidth
                        customClass="auth-submit-btn"
                        isLoading={passwordFormik.isSubmitting}
                        disabled={
                            !passwordFormik.isValid || !passwordFormik.dirty
                        }
                    >
                        {authLoginSignInButton}
                    </Button>
                </Box>

                <AnimatePresence>
                    {deviceConflict && (
                        <DeviceConflictModal
                            key="device-conflict-modal"
                            deviceName={deviceConflict.deviceName}
                            confirming={confirmingSwitch}
                            onConfirm={handleConfirmDeviceSwitch}
                            onCancel={() => setDeviceConflict(null)}
                        />
                    )}
                </AnimatePresence>
            </>
        );
    }

    return (
        <Box customClass="login-form-wrap">
            <Box
                as="form"
                customClass="auth-form"
                onSubmit={emailFormik.handleSubmit}
            >
                <Box customClass="auth-field">
                    <Label
                        htmlFor="email"
                        className="font-mono text-[11px] tracking-[0.08em] uppercase text-white/30"
                    >
                        {authEmailLabel}
                    </Label>
                    <Input
                        name="email"
                        id="email"
                        type="email"
                        placeholder={authEmailPlaceholder}
                        autoComplete="email"
                        value={emailFormik.values.email}
                        onChange={emailFormik.handleChange}
                        onBlur={emailFormik.handleBlur}
                        isError={
                            emailFormik.touched.email &&
                            Boolean(emailFormik.errors.email)
                        }
                        helperText={
                            emailFormik.touched.email
                                ? emailFormik.errors.email
                                : undefined
                        }
                        fullWidth
                    />
                </Box>

                <Button
                    type="submit"
                    fullWidth
                    customClass="auth-submit-btn"
                    isLoading={emailFormik.isSubmitting}
                    disabled={!emailFormik.isValid || !emailFormik.dirty}
                >
                    {authLoginContinueButton}
                </Button>
            </Box>

            <Box customClass="auth-divider">
                <Text as="span" customClass="auth-divider-text">
                    {authOr}
                </Text>
            </Box>

            <Button
                type="button"
                fullWidth
                customClass="auth-google-btn"
                onClick={() => googleLogin()}
            >
                <GoogleIcon size={18} />
                <Text as="span" customClass="auth-google-btn-label">
                    {authContinueWithGoogle}
                </Text>
            </Button>
        </Box>
    );
}
