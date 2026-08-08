import * as yup from "yup";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useFormik } from "formik";
import { toast } from "sonner";
import Box from "@/components/base/Box/Box";
import Label from "@/components/base/Label/Label";
import Input from "@/components/base/Input/Input";
import Button from "@/components/base/Button/Button";
import AuthLayout from "@/container/AuthLayout";
import { callAPIInterface } from "@/utils";
import type { IResetPasswordBody } from "@/types/index";
import type { IMessageResponse } from "@/types/utils";
import {
    authBackToSignIn,
    authPasswordPlaceholder,
    authConfirmPasswordLabel,
    authValidationPasswordRequired,
    authValidationPasswordMinLength,
    authValidationConfirmPasswordRequired,
    authValidationPasswordsMustMatch,
    authResetPasswordInvalidLinkTitle,
    authResetPasswordInvalidLinkDescription,
    authResetPasswordRequestNewLink,
    authResetPasswordTitle,
    authResetPasswordDescription,
    authResetPasswordNewPasswordLabel,
    authResetPasswordResetButton,
    authResetPasswordLinkInvalidOrExpired,
} from "@/constants/messages";

const resetSchema = yup.object({
    password: yup
        .string()
        .required(authValidationPasswordRequired)
        .min(8, authValidationPasswordMinLength),
    confirm: yup
        .string()
        .required(authValidationConfirmPasswordRequired)
        .oneOf([yup.ref("password")], authValidationPasswordsMustMatch),
});

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [invalid, setInvalid] = useState(!token);

    const formik = useFormik({
        initialValues: { password: "", confirm: "" },
        validationSchema: resetSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const res = await callAPIInterface<
                    IResetPasswordBody,
                    IMessageResponse
                >("POST", "/reset-password", {
                    reset_token: token!,
                    new_password: values.password,
                });
                toast.success(res.message);
                navigate("/login", { replace: true });
            } catch {
                toast.error(authResetPasswordLinkInvalidOrExpired);
                setInvalid(true);
            } finally {
                setSubmitting(false);
            }
        },
    });

    if (invalid) {
        return (
            <AuthLayout
                title={authResetPasswordInvalidLinkTitle}
                subtitle={authResetPasswordInvalidLinkDescription}
                footer={<Link to="/login">{authBackToSignIn}</Link>}
            >
                <Link to="/forgot-password" style={{ display: "block" }}>
                    <Button
                        component="span"
                        variant="contained"
                        fullWidth
                        customClass="auth-submit-btn"
                    >
                        {authResetPasswordRequestNewLink}
                    </Button>
                </Link>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title={authResetPasswordTitle}
            subtitle={authResetPasswordDescription}
            footer={<Link to="/login">{authBackToSignIn}</Link>}
        >
            <Box
                customClass="auth-form"
                component="form"
                onSubmit={formik.handleSubmit as any}
            >
                <Box customClass="auth-field">
                    <Label htmlFor="password">
                        {authResetPasswordNewPasswordLabel}
                    </Label>
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
                        isError={
                            formik.touched.confirm && !!formik.errors.confirm
                        }
                        helperText={formik.errors.confirm}
                        customClass="auth-input-underline"
                        fullWidth
                    />
                </Box>

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    customClass="auth-submit-btn"
                    disabled={formik.isSubmitting}
                    isLoading={formik.isSubmitting}
                >
                    {authResetPasswordResetButton}
                </Button>
            </Box>
        </AuthLayout>
    );
}
