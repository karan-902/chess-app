import * as yup from "yup";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Check } from "lucide-react";
import { useFormik } from "formik";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Label from "@/components/base/Label/Label";
import Input from "@/components/base/Input/Input";
import Button from "@/components/base/Button/Button";
import Select from "@/components/base/Select/Select";
import VerifyEmailForm from "@/pages/verify-email/VerifyEmailForm";
import { callAPIInterface } from "@/utils";
import { useReduxDispatch } from "@/redux/hooks";
import { login } from "@/redux/thunks";
import { showLoader, hideLoader, showToast } from "@/redux/common/common.slice";
import { COUNTRY_OPTIONS } from "@/constants/config";
import type { IRegisterEmailBody } from "@/types/index";
import type {
    IRegisterResponse,
    IUsernameAvailableResponse,
} from "@/types/utils";
import {
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
    authValidationUsernameRequired,
    authValidationUsernameMinLength,
    authValidationUsernameTaken,
    authValidationCountryRequired,
    authRegisterUsernameLabel,
    authRegisterUsernamePlaceholder,
    authRegisterCountryLabel,
    authRegisterCreateAccountButton,
    authRegisterRegistrationFailed,
    countrySelectSearchPlaceholder,
    countrySelectSelectPlaceholder,
} from "@/constants/messages";
import {
    IEmailFormScreenProps,
    IEmailFormValues,
    UsernameCheckStatus,
} from "@/types/components";

const USERNAME_CHECK_DEBOUNCE_MS = 500;

const registerSchema = yup.object({
    username: yup
        .string()
        .trim()
        .min(3, authValidationUsernameMinLength)
        .required(authValidationUsernameRequired),
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

function EmailFormScreen({ onRegistered }: IEmailFormScreenProps) {
    const dispatch = useReduxDispatch();
    const formik = useFormik<IEmailFormValues>({
        initialValues: {
            username: "",
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
                        username: values.username,
                        email: values.email,
                        password: values.password,
                        country: values.country,
                    },
                );
                onRegistered(values.email, values.password);
            } catch (err: any) {
                dispatch(
                    showToast({
                        message:
                            err?.response?.data?.message ??
                            authRegisterRegistrationFailed,
                        severity: "error",
                    }),
                );
            } finally {
                setSubmitting(false);
            }
        },
    });

    const [usernameStatus, setUsernameStatus] =
        useState<UsernameCheckStatus>("idle");
    const usernameDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

    useEffect(() => {
        if (usernameDebounceRef.current)
            clearTimeout(usernameDebounceRef.current);

        const trimmed = formik.values.username.trim();
        if (trimmed.length < 3) {
            setUsernameStatus("idle");
            return;
        }

        setUsernameStatus("checking");
        usernameDebounceRef.current = setTimeout(async () => {
            try {
                const res = await callAPIInterface<
                    undefined,
                    IUsernameAvailableResponse
                >(
                    "GET",
                    `/username-available?username=${encodeURIComponent(trimmed)}`,
                );
                setUsernameStatus(res.available ? "available" : "taken");
            } catch {
                setUsernameStatus("idle");
            }
        }, USERNAME_CHECK_DEBOUNCE_MS);

        return () => {
            if (usernameDebounceRef.current)
                clearTimeout(usernameDebounceRef.current);
        };
    }, [formik.values.username]);

    return (
        <Box
            customClass="auth-form"
            component="form"
            onSubmit={formik.handleSubmit as any}
        >
            <Box customClass="auth-field">
                <Label htmlFor="username">{authRegisterUsernameLabel}</Label>
                <Input
                    id="username"
                    name="username"
                    placeholder={authRegisterUsernamePlaceholder}
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isError={
                        (formik.touched.username && !!formik.errors.username) ||
                        usernameStatus === "taken"
                    }
                    helperText={
                        formik.touched.username && formik.errors.username
                            ? formik.errors.username
                            : usernameStatus === "taken"
                              ? authValidationUsernameTaken
                              : undefined
                    }
                    endIcon={
                        usernameStatus === "available" ? (
                            <Check
                                size={16}
                                strokeWidth={2.5}
                                className="input-check-icon"
                            />
                        ) : undefined
                    }
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
                disabled={
                    !formik.dirty ||
                    !formik.isValid ||
                    formik.isSubmitting ||
                    usernameStatus === "taken" ||
                    usernameStatus === "checking"
                }
                isLoading={formik.isSubmitting}
            >
                {authRegisterCreateAccountButton}
            </Button>
        </Box>
    );
}

export default function RegisterForm() {
    const dispatch = useReduxDispatch();
    const navigate = useNavigate();
    const [pending, setPending] = useState<{
        email: string;
        password: string;
    } | null>(null);

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

    if (pending) {
        return (
            <VerifyEmailForm
                email={pending.email}
                onVerified={handleVerified}
                onBack={() => setPending(null)}
            />
        );
    }

    return (
        <EmailFormScreen
            onRegistered={(email, password) => setPending({ email, password })}
        />
    );
}
