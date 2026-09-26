import * as yup from "yup";
import { useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import Box from "@/components/base/Box/Box";
import Input from "@/components/base/Input/Input";
import Button from "@/components/base/Button/Button";
import AuthLayout from "@/container/AuthLayout";
import { callAPIInterface } from "@/utils";
import { useReduxDispatch } from "@/redux/hooks";
import { showToast } from "@/redux/common/slice";
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

export default function ResetPassword() {
    const dispatch = useReduxDispatch();
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
                dispatch(
                    showToast({ isToastOpen: true, toastMessage: res.message, toastVariant: "success" }),
                );
                navigate("/login", { replace: true });
            } catch {
                dispatch(
                    showToast({
                        isToastOpen: true,
                        toastMessage: authResetPasswordLinkInvalidOrExpired,
                        toastVariant: "error",
                    }),
                );
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
                footer={<NavLink to="/login">{authBackToSignIn}</NavLink>}
            >
                <NavLink to="/forgot-password" style={{ display: "block" }}>
                    <Button
                        component="span"
                        variant="contained"
                        fullWidth
                        customClass="auth-submit-btn"
                    >
                        {authResetPasswordRequestNewLink}
                    </Button>
                </NavLink>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title={authResetPasswordTitle}
            subtitle={authResetPasswordDescription}
            footer={<NavLink to="/login">{authBackToSignIn}</NavLink>}
        >
            <Box
                customClass="auth-form"
                component="form"
                onSubmit={formik.handleSubmit as any}
            >
                <Input
                    id="password"
                    name="password"
                    type="password"
                    label={authResetPasswordNewPasswordLabel}
                    placeholder={authPasswordPlaceholder}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                    isError={
                        formik.touched.password && !!formik.errors.password
                    }
                    helperText={formik.errors.password}
                    customClass="form-input"
                    fullWidth
                />

                <Input
                    id="confirm"
                    name="confirm"
                    type="password"
                    label={authConfirmPasswordLabel}
                    placeholder={authPasswordPlaceholder}
                    value={formik.values.confirm}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                    isError={
                        formik.touched.confirm && !!formik.errors.confirm
                    }
                    helperText={formik.errors.confirm}
                    customClass="form-input"
                    fullWidth
                />

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
