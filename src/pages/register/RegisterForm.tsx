import * as yup from "yup";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Mail, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useFormik } from "formik";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Label from "@/components/base/Label/Label";
import Input from "@/components/base/Input/Input";
import Button from "@/components/base/Button/Button";
import Card from "@/components/base/Card/Card";
import Select from "@/components/base/Select/Select";
import VerifyEmailForm from "@/pages/verify-email/VerifyEmailForm";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { callAPIInterface } from "@/utils";
import { useReduxDispatch } from "@/redux/hooks";
import { login } from "@/redux/thunks";
import { showLoader, hideLoader } from "@/redux/loader.slice";
import { GoogleIcon } from "@/components/constants";
import { COUNTRY_OPTIONS } from "@/constants/config";
import type { IRegisterEmailBody } from "@/types/index";
import type { IRegisterResponse } from "@/types/utils";
import {
    authLoginBack,
    authEmailLabel,
    authEmailPlaceholder,
    authPasswordLabel,
    authPasswordPlaceholder,
    authConfirmPasswordLabel,
    authValidationEmailRequired,
    authValidationEmailInvalid,
    authValidationPasswordRequired,
    authValidationPasswordMinLength,
    authValidationConfirmPasswordRequired,
    authValidationPasswordsMustMatch,
    authValidationFirstNameRequired,
    authValidationLastNameRequired,
    authValidationCountryRequired,
    authRegisterEmailMethodTitle,
    authRegisterEmailMethodSub,
    authRegisterGoogleMethodTitle,
    authRegisterGoogleMethodSub,
    authRegisterFirstNameLabel,
    authRegisterFirstNamePlaceholder,
    authRegisterLastNameLabel,
    authRegisterLastNamePlaceholder,
    authRegisterCountryLabel,
    authRegisterCreateAccountButton,
    authRegisterRegistrationFailed,
    countrySelectSearchPlaceholder,
    countrySelectSelectPlaceholder,
} from "@/constants/messages";
import { IEmailFormScreenProps, IEmailFormValues } from "@/types/components";

const registerSchema = yup.object({
    first_name: yup.string().required(authValidationFirstNameRequired),
    last_name: yup.string().required(authValidationLastNameRequired),
    email: yup
        .string()
        .email(authValidationEmailInvalid)
        .required(authValidationEmailRequired),
    password: yup
        .string()
        .required(authValidationPasswordRequired)
        .min(8, authValidationPasswordMinLength),
    confirm: yup
        .string()
        .required(authValidationConfirmPasswordRequired)
        .oneOf([yup.ref("password")], authValidationPasswordsMustMatch),
    country: yup.string().required(authValidationCountryRequired),
});

interface IMethodScreenProps {
    onEmailSelected: () => void;
    onGoogleSelected: () => void;
    isGoogleProcessing: boolean;
}

function MethodScreen({
    onEmailSelected,
    onGoogleSelected,
    isGoogleProcessing,
}: IMethodScreenProps) {
    return (
        <Box customClass="reg-method-list">
            <Card customClass="reg-method-row" onClick={onEmailSelected}>
                <Box customClass="reg-method-icon">
                    <Mail size={18} />
                </Box>
                <Box customClass="reg-method-text">
                    <Text component="span" customClass="reg-method-title">
                        {authRegisterEmailMethodTitle}
                    </Text>
                    <Text component="span" customClass="reg-method-sub">
                        {authRegisterEmailMethodSub}
                    </Text>
                </Box>
                <ChevronRight size={16} className="reg-method-arrow" />
            </Card>

            <Card
                customClass="reg-method-row"
                onClick={isGoogleProcessing ? undefined : onGoogleSelected}
            >
                <Box customClass="reg-method-icon">
                    <GoogleIcon size={18} />
                </Box>
                <Box customClass="reg-method-text">
                    <Text component="span" customClass="reg-method-title">
                        {authRegisterGoogleMethodTitle}
                    </Text>
                    <Text component="span" customClass="reg-method-sub">
                        {authRegisterGoogleMethodSub}
                    </Text>
                </Box>
                <ChevronRight size={16} className="reg-method-arrow" />
            </Card>
        </Box>
    );
}

function EmailFormScreen({ onBack, onRegistered }: IEmailFormScreenProps) {
    const formik = useFormik<IEmailFormValues>({
        initialValues: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            confirm: "",
            country: "",
        },
        validationSchema: registerSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await callAPIInterface<IRegisterEmailBody, IRegisterResponse>(
                    "POST",
                    "/register",
                    {
                        first_name: values.first_name,
                        last_name: values.last_name,
                        email: values.email,
                        password: values.password,
                        country: values.country,
                    },
                );
                onRegistered(values.email, values.password);
            } catch (err: any) {
                toast.error(
                    err?.response?.data?.message ??
                        authRegisterRegistrationFailed,
                );
            } finally {
                setSubmitting(false);
            }
        },
    });

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
                onClick={onBack}
            >
                {authLoginBack}
            </Button>

            <Box customClass="auth-field">
                <Label htmlFor="first_name">{authRegisterFirstNameLabel}</Label>
                <Input
                    id="first_name"
                    name="first_name"
                    placeholder={authRegisterFirstNamePlaceholder}
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isError={
                        formik.touched.first_name && !!formik.errors.first_name
                    }
                    helperText={formik.errors.first_name}
                    customClass="auth-input-underline"
                    fullWidth
                />
            </Box>

            <Box customClass="auth-field">
                <Label htmlFor="last_name">{authRegisterLastNameLabel}</Label>
                <Input
                    id="last_name"
                    name="last_name"
                    placeholder={authRegisterLastNamePlaceholder}
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isError={
                        formik.touched.last_name && !!formik.errors.last_name
                    }
                    helperText={formik.errors.last_name}
                    customClass="auth-input-underline"
                    fullWidth
                />
            </Box>

            <Box customClass="auth-field">
                <Label htmlFor="email">{authEmailLabel}</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={authEmailPlaceholder}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isError={formik.touched.email && !!formik.errors.email}
                    helperText={formik.errors.email}
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
            </Box>

            <Box customClass="auth-field">
                <Label htmlFor="confirm">{authConfirmPasswordLabel}</Label>
                <Input
                    id="confirm"
                    name="confirm"
                    type="password"
                    placeholder={authPasswordPlaceholder}
                    value={formik.values.confirm}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isError={formik.touched.confirm && !!formik.errors.confirm}
                    helperText={formik.errors.confirm}
                    customClass="auth-input-underline"
                    fullWidth
                />
            </Box>

            <Box customClass="auth-field">
                <Label htmlFor="country">{authRegisterCountryLabel}</Label>
                <Select
                    value={formik.values.country}
                    onChange={(v) => {
                        formik.setFieldValue("country", v);
                        formik.setFieldTouched("country", true, false);
                    }}
                    options={COUNTRY_OPTIONS}
                    searchable
                    placeholder={countrySelectSelectPlaceholder}
                    searchPlaceholder={countrySelectSearchPlaceholder}
                    isError={formik.touched.country && !!formik.errors.country}
                />
                {formik.touched.country && formik.errors.country && (
                    <Text component="span" customClass="input-helper-text">
                        {formik.errors.country}
                    </Text>
                )}
            </Box>

            <Button
                type="submit"
                variant="contained"
                fullWidth
                customClass="auth-submit-btn"
                disabled={!formik.dirty || formik.isSubmitting}
                isLoading={formik.isSubmitting}
            >
                {authRegisterCreateAccountButton}
            </Button>
        </Box>
    );
}

type Step = "method" | "email" | "otp";

export default function RegisterForm() {
    const dispatch = useReduxDispatch();
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>("method");
    const [pending, setPending] = useState<{
        email: string;
        password: string;
    } | null>(null);

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
    }, [isProcessing, dispatch]);

    const handleVerified = async () => {
        if (!pending) return;
        dispatch(showLoader({ text: "Setting up your account..." }));
        try {
            await dispatch(
                login({ email: pending.email, password: pending.password }),
            ).unwrap();
        } catch {
            navigate("/login", { replace: true });
        } finally {
            dispatch(hideLoader());
            setPending(null);
        }
    };

    if (step === "otp" && pending) {
        return (
            <VerifyEmailForm
                email={pending.email}
                onVerified={handleVerified}
                onBack={() => setStep("email")}
            />
        );
    }

    if (step === "email") {
        return (
            <EmailFormScreen
                onBack={() => setStep("method")}
                onRegistered={(email, password) => {
                    setPending({ email, password });
                    setStep("otp");
                }}
            />
        );
    }

    return (
        <MethodScreen
            onEmailSelected={() => setStep("email")}
            onGoogleSelected={() => googleLogin()}
            isGoogleProcessing={isProcessing}
        />
    );
}
