import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { object, string, ref } from "yup";
import { Mail, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import Box from "../../components/base/Box/Box";
import Card from "../../components/base/Card/Card";
import Button from "../../components/base/Button/Button";
import { Label } from "../../components/base/Label/label";
import Input from "../../components/base/Input/Input";
import Text from "../../components/base/Text/Text";
import Select from "@/components/base/Select/Select";
import { GoogleIcon } from "@/components/constants";
import { COUNTRY_OPTIONS } from "@/constants/config";

import { callAPIInterface } from "../../utils";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import sessionService from "../../store/sessionService";
import { useReduxDispatch } from "../../store/hooks";
import { showLoader, hideLoader } from "../../store/loader.slice";
import type { IRegisterEmailBody, ILoginBody } from "../../types/index";
import type { IRegisterResponse, ILoginResponse } from "../../types/utils";
import { useNavigate } from "react-router";
import EmailVerificationScreen from "./EmailVerificationScreen";
import {
    authBackLink,
    authConfirmPasswordLabel,
    authEmailLabel,
    authEmailPlaceholder,
    authPasswordLabel,
    authPasswordPlaceholder,
    authRegisterCountryLabel,
    authRegisterCreateAccountButton,
    authRegisterEmailMethodSub,
    authRegisterEmailMethodTitle,
    authRegisterFirstNameLabel,
    authRegisterFirstNamePlaceholder,
    authRegisterGoogleMethodSub,
    authRegisterGoogleMethodTitle,
    authRegisterLastNameLabel,
    authRegisterLastNamePlaceholder,
    authRegisterRegistrationFailed,
    authValidationConfirmPasswordRequired,
    authValidationCountryRequired,
    authValidationEmailInvalid,
    authValidationEmailRequired,
    authValidationFirstNameRequired,
    authValidationLastNameRequired,
    authValidationPasswordMinLength,
    authValidationPasswordRequired,
    authValidationPasswordsMustMatch,
    countrySelectSelectPlaceholder,
    countrySelectSearchPlaceholder,
} from "@/components/messages";

const emailSchema = object({
    first_name: string().required(authValidationFirstNameRequired),
    last_name: string().required(authValidationLastNameRequired),
    email: string()
        .required(authValidationEmailRequired)
        .email(authValidationEmailInvalid),
    password: string()
        .required(authValidationPasswordRequired)
        .min(8, authValidationPasswordMinLength),
    confirm: string()
        .required(authValidationConfirmPasswordRequired)
        .oneOf([ref("password")], authValidationPasswordsMustMatch),
    country: string().required(authValidationCountryRequired),
});

function EmailRegisterForm({
    onBack,
    onRegistered,
}: {
    onBack: () => void;
    onRegistered: (email: string, password: string) => void;
}) {
    const {
        handleSubmit,
        handleChange,
        handleBlur,
        setFieldValue,
        setFieldTouched,
        values,
        touched,
        errors,
        isSubmitting,
        isValid,
        dirty,
    } = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            confirm: "",
            country: "",
        },
        validationSchema: emailSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const payload: IRegisterEmailBody = {
                    first_name: values.first_name,
                    last_name: values.last_name,
                    email: values.email,
                    password: values.password,
                    country: values.country,
                };
                await callAPIInterface<IRegisterEmailBody, IRegisterResponse>(
                    "POST",
                    "/register",
                    payload,
                );
                onRegistered(values.email, values.password);
            } catch (err: any) {
                const msg =
                    err?.response?.data?.message ??
                    authRegisterRegistrationFailed;
                toast.error(msg);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const field = (name: keyof typeof values) => ({
        name,
        id: name,
        value: values[name],
        onChange: handleChange,
        onBlur: handleBlur,
        isError: touched[name] && Boolean(errors[name]),
        helperText: touched[name] ? errors[name] : undefined,
        fullWidth: true as const,
    });

    return (
        <Box
            as="form"
            customClass="auth-form"
            onSubmit={handleSubmit as React.FormEventHandler<HTMLElement>}
        >
            <Button
                type="button"
                variant="ghost"
                customClass="reg-back-link"
                onClick={onBack}
            >
                {authBackLink}
            </Button>

            <Box customClass="auth-field">
                <Label htmlFor="first_name">{authRegisterFirstNameLabel}</Label>
                <Input
                    {...field("first_name")}
                    placeholder={authRegisterFirstNamePlaceholder}
                />
            </Box>

            <Box customClass="auth-field">
                <Label htmlFor="last_name">{authRegisterLastNameLabel}</Label>
                <Input
                    {...field("last_name")}
                    placeholder={authRegisterLastNamePlaceholder}
                />
            </Box>

            <Box customClass="auth-field">
                <Label htmlFor="email">{authEmailLabel}</Label>
                <Input
                    {...field("email")}
                    type="email"
                    placeholder={authEmailPlaceholder}
                />
            </Box>

            <Box customClass="auth-field">
                <Label htmlFor="password">{authPasswordLabel}</Label>
                <Input
                    {...field("password")}
                    type="password"
                    placeholder={authPasswordPlaceholder}
                />
                {/* <PasswordStrength password={values.password} /> */}
            </Box>

            <Box customClass="auth-field">
                <Label htmlFor="confirm">{authConfirmPasswordLabel}</Label>
                <Input
                    {...field("confirm")}
                    type="password"
                    placeholder={authPasswordPlaceholder}
                />
            </Box>

            <Box customClass="auth-field">
                <Label htmlFor="country">{authRegisterCountryLabel}</Label>
                <Select
                    value={values.country}
                    onChange={(v) => {
                        setFieldValue("country", v);
                        setFieldTouched("country", true, false);
                    }}
                    options={COUNTRY_OPTIONS}
                    searchable
                    placeholder={countrySelectSelectPlaceholder}
                    searchPlaceholder={countrySelectSearchPlaceholder}
                    isError={touched.country && Boolean(errors.country)}
                />
                {touched.country && errors.country && (
                    <Text as="span" customClass="input-helper-text">
                        {errors.country}
                    </Text>
                )}
            </Box>

            <Button
                customClass="auth-submit-btn"
                fullWidth
                type="submit"
                isLoading={isSubmitting}
                disabled={!isValid || !dirty}
            >
                {authRegisterCreateAccountButton}
            </Button>
        </Box>
    );
}

export default function RegisterForm() {
    const [path, setPath] = useState<"email" | null>(null);
    const [pending, setPending] = useState<{
        email: string;
        password: string;
    } | null>(null);
    const navigate = useNavigate();
    const dispatch = useReduxDispatch();
    const { googleLogin, isProcessing } = useGoogleAuth(
        "/sso-register",
        "register",
    );

    useEffect(() => {
        if (isProcessing)
            dispatch(showLoader({ text: "Signing in with Google..." }));
        else dispatch(hideLoader());
        return () => {
            dispatch(hideLoader());
        };
    }, [isProcessing]);

    const handleVerified = async () => {
        if (!pending) {
            navigate("/login");
            return;
        }
        dispatch(showLoader({ text: "Setting up your account..." }));
        try {
            const res = await callAPIInterface<ILoginBody, ILoginResponse>(
                "POST",
                "/login",
                { email: pending.email, password: pending.password },
            );
            await sessionService.saveSession(res);
            navigate(res.skill_level === null ? "/skill-level" : "/lobby", {
                replace: true,
            });
        } catch {
            navigate("/login", { replace: true });
        } finally {
            dispatch(hideLoader());
            setPending(null);
        }
    };

    if (pending) {
        return (
            <EmailVerificationScreen
                email={pending.email}
                onVerified={handleVerified}
                onBack={() => setPending(null)}
            />
        );
    }

    if (path === "email") {
        return (
            <EmailRegisterForm
                onBack={() => setPath(null)}
                onRegistered={(email, password) =>
                    setPending({ email, password })
                }
            />
        );
    }

    return (
        <Box customClass="reg-method-list">
            <Card customClass="reg-method-row" onClick={() => setPath("email")}>
                <Box customClass="reg-method-icon email-icon">
                    <Mail size={18} />
                </Box>
                <Box customClass="reg-method-text">
                    <Text as="span" customClass="reg-method-title">
                        {authRegisterEmailMethodTitle}
                    </Text>
                    <Text as="span" customClass="reg-method-sub">
                        {authRegisterEmailMethodSub}
                    </Text>
                </Box>
                <ChevronRight size={16} className="reg-method-arrow" />
            </Card>

            <Card customClass="reg-method-row" onClick={() => googleLogin()}>
                <Box customClass="reg-method-icon google-icon">
                    <GoogleIcon size={18} />
                </Box>
                <Box customClass="reg-method-text">
                    <Text as="span" customClass="reg-method-title">
                        {authRegisterGoogleMethodTitle}
                    </Text>
                    <Text as="span" customClass="reg-method-sub">
                        {authRegisterGoogleMethodSub}
                    </Text>
                </Box>
                <ChevronRight size={16} className="reg-method-arrow" />
            </Card>
        </Box>
    );
}
