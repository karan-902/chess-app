import * as yup from "yup";
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useFormik, type FormikProps } from "formik";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Label from "@/components/base/Label/Label";
import Input from "@/components/base/Input/Input";
import Button from "@/components/base/Button/Button";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useDeviceApprovalPoll } from "@/hooks/useDeviceApprovalPoll";
import SelectCountryScreen from "@/pages/select-country/SelectCountryScreen";
import { callAPIInterface } from "@/utils";
import { useReduxDispatch } from "@/redux/hooks";
import { login } from "@/redux/thunks";
import { showLoader, hideLoader } from "@/redux/loader.slice";
import { showToast } from "@/redux/toast.slice";
import type { IVerifyUserBody } from "@/types/index";
import type { ILoginResponse, IVerifyUserResponse } from "@/types/utils";
import { SignupMethod } from "@/types/utils";
import {
    authEmailLabel,
    authEmailPlaceholder,
    authPasswordLabel,
    authPasswordPlaceholder,
    authOr,
    authContinueWithGoogle,
    authValidationEmailRequired,
    authValidationEmailInvalid,
    authValidationPasswordRequired,
    authLoginNoAccountFound,
    authLoginBack,
    authLoginForgotPassword,
    authLoginContinueButton,
    authLoginSignInButton,
    authLoginEmailNotVerified,
    authDeviceApprovalTitle,
    authDeviceApprovalDescription,
    authDeviceApprovalBack,
} from "@/constants/messages";
import { GoogleIcon } from "@/components/constants";

const emailSchema = yup.object({
    email: yup
        .string()
        .email(authValidationEmailInvalid)
        .required(authValidationEmailRequired),
});

const passwordSchema = yup.object({
    password: yup.string().required(authValidationPasswordRequired),
});

interface IEmailValues {
    email: string;
}

interface IEmailScreenProps {
    formik: FormikProps<IEmailValues>;
    error: string | null;
    isGoogleProcessing: boolean;
    onGoogleLogin: () => void;
}

function EmailScreen({
    formik,
    error,
    isGoogleProcessing,
    onGoogleLogin,
}: IEmailScreenProps) {
    return (
        <Box
            customClass="auth-form"
            component="form"
            onSubmit={formik.handleSubmit as any}
        >
            <Box customClass="auth-field">
                <Label htmlFor="email">{authEmailLabel}</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={authEmailPlaceholder}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    isError={formik.touched.email && !!formik.errors.email}
                    helperText={formik.errors.email}
                    customClass="auth-input-underline"
                    fullWidth
                />
            </Box>

            {error && (
                <Text customClass="auth-error">
                    {error}
                </Text>
            )}

            <Box customClass="auth-actions">
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    customClass="auth-submit-btn"
                    disabled={!formik.dirty || formik.isSubmitting}
                    isLoading={formik.isSubmitting}
                >
                    {authLoginContinueButton}
                </Button>

                <Box customClass="auth-divider">
                    <span>{authOr}</span>
                </Box>

                <Button
                    type="button"
                    startIcon={<GoogleIcon size={20} />}
                    variant="outlined"
                    fullWidth
                    customClass="auth-google-btn"
                    onClick={onGoogleLogin}
                    disabled={isGoogleProcessing}
                >
                    {authContinueWithGoogle}
                </Button>
            </Box>
        </Box>
    );
}

interface IPasswordValues {
    password: string;
}

interface IPasswordScreenProps {
    verifiedEmail: string;
    formik: FormikProps<IPasswordValues>;
    error: string | null;
    onChangeEmail: () => void;
}

function PasswordScreen({
    verifiedEmail,
    formik,
    error,
    onChangeEmail,
}: IPasswordScreenProps) {
    return (
        <Box
            customClass="auth-form"
            component="form"
            onSubmit={formik.handleSubmit as any}
        >
            <Button
                type="button"
                startIcon={<ArrowLeft size={16} />}
                customClass="auth-back-btn"
                onClick={onChangeEmail}
            >
                {authLoginBack}
            </Button>

            <Box customClass="auth-field">
                <Label htmlFor="verified-email">{authEmailLabel}</Label>
                <Input
                    id="verified-email"
                    value={verifiedEmail}
                    disabled
                    readOnly
                    customClass="auth-input-underline"
                    fullWidth
                />
            </Box>

            <Box customClass="auth-field">
                <Label htmlFor="password">{authPasswordLabel}</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder={authPasswordPlaceholder}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isError={
                        formik.touched.password && !!formik.errors.password
                    }
                    helperText={formik.errors.password}
                    customClass="auth-input-underline"
                    fullWidth
                />
                <Link to="/forgot-password" className="auth-forgot-link">
                    {authLoginForgotPassword}
                </Link>
            </Box>

            {error && (
                <Text customClass="auth-error">
                    {error}
                </Text>
            )}

            <Box customClass="auth-actions">
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    customClass="auth-submit-btn"
                    disabled={!formik.dirty || formik.isSubmitting}
                    isLoading={formik.isSubmitting}
                >
                    {authLoginSignInButton}
                </Button>
            </Box>
        </Box>
    );
}

interface IWaitingApprovalScreenProps {
    onBack: () => void;
}

function WaitingApprovalScreen({ onBack }: IWaitingApprovalScreenProps) {
    return (
        <Box customClass="auth-form">
            <Button
                type="button"
                startIcon={<ArrowLeft size={16} />}
                customClass="auth-back-btn"
                onClick={onBack}
            >
                {authDeviceApprovalBack}
            </Button>

            <Box customClass="auth-heading">
                <Text component="h1" customClass="auth-title">
                    {authDeviceApprovalTitle}
                </Text>
                <Text component="p" customClass="auth-subtitle">
                    {authDeviceApprovalDescription}
                </Text>
            </Box>
        </Box>
    );
}

export default function LoginForm() {
    const dispatch = useReduxDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [step, setStep] = useState<
        "email" | "password" | "country" | "waiting-approval"
    >(searchParams.get("step") === "country" ? "country" : "email");
    const [verifiedEmail, setVerifiedEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const devicePoll = useDeviceApprovalPoll();

    const handleApproved = (res: ILoginResponse) => {
        if (!res.country) {
            setStep("country");
            return;
        }
        navigate(res.skill_level === null ? "/skill-level" : "/play");
    };

    const emailFormik = useFormik({
        initialValues: { email: "" },
        validationSchema: emailSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setError(null);
            try {
                const res = await callAPIInterface<
                    IVerifyUserBody,
                    IVerifyUserResponse
                >("POST", "/verify-user", { email: values.email });

                if (res.signup_method === SignupMethod.GOOGLE) {
                    googleLogin();
                    return;
                }

                if (!res.email_verified) {
                    dispatch(
                        showToast({
                            message: authLoginEmailNotVerified,
                            severity: "error",
                        }),
                    );
                    navigate(
                        `/verify-email?email=${encodeURIComponent(values.email)}`,
                    );
                    return;
                }

                setVerifiedEmail(values.email);
                setStep("password");
            } catch (err: any) {
                setError(
                    err?.response?.data?.message ?? authLoginNoAccountFound,
                );
            } finally {
                setSubmitting(false);
            }
        },
    });

    const { googleLogin, isProcessing, pendingApprovalToken } = useGoogleAuth(
        "/sso-login",
        "login",
        emailFormik.values.email,
    );

    useEffect(() => {
        if (!pendingApprovalToken) return;
        setStep("waiting-approval");
        devicePoll.start(pendingApprovalToken, handleApproved);
    }, [pendingApprovalToken]);

    const passwordFormik = useFormik<IPasswordValues>({
        initialValues: { password: "" },
        validationSchema: passwordSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setError(null);
            dispatch(showLoader({ text: "Signing in..." }));
            try {
                const res = await dispatch(
                    login({ email: verifiedEmail, password: values.password }),
                ).unwrap();
                if ("status" in res) {
                    setStep("waiting-approval");
                    devicePoll.start(res.approval_token, handleApproved);
                    return;
                }
                if (!res.country) setStep("country");
            } catch (err: any) {
                if (err?.type === "email_not_verified") {
                    dispatch(
                        showToast({
                            message: authLoginEmailNotVerified,
                            severity: "error",
                        }),
                    );
                    navigate(
                        `/verify-email?email=${encodeURIComponent(verifiedEmail)}`,
                    );
                    return;
                }
                setError(
                    err?.message ??
                        "Unable to sign in. Check your details and try again.",
                );
            } finally {
                setSubmitting(false);
                dispatch(hideLoader());
            }
        },
    });

    const handleChangeEmail = () => {
        setError(null);
        passwordFormik.resetForm();
        setStep("email");
    };

    const handleBackFromApproval = () => {
        devicePoll.stop();
        setStep("email");
    };

    if (step === "country") {
        return <SelectCountryScreen />;
    }

    if (step === "waiting-approval") {
        return <WaitingApprovalScreen onBack={handleBackFromApproval} />;
    }

    if (step === "password") {
        return (
            <PasswordScreen
                verifiedEmail={verifiedEmail}
                formik={passwordFormik}
                error={error}
                onChangeEmail={handleChangeEmail}
            />
        );
    }

    return (
        <EmailScreen
            formik={emailFormik}
            error={error}
            isGoogleProcessing={isProcessing}
            onGoogleLogin={() => googleLogin()}
        />
    );
}
