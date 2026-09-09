import * as yup from "yup";
import { useState } from "react";
import { Link } from "react-router";
import { useFormik } from "formik";
import Box from "@/components/base/Box/Box";
import Label from "@/components/base/Label/Label";
import Input from "@/components/base/Input/Input";
import Button from "@/components/base/Button/Button";
import AuthLayout from "@/container/AuthLayout";
import { callAPIInterface } from "@/utils";
import type { IForgotPasswordBody } from "@/types/index";
import type { IMessageResponse } from "@/types/utils";
import {
    authBackToSignIn,
    authEmailLabel,
    authEmailPlaceholder,
    authValidationEmailRequired,
    authValidationEmailInvalid,
    authForgotPasswordTitle,
    authForgotPasswordDescription,
    authForgotPasswordSentDescription,
    authForgotPasswordSendButton,
    authForgotPasswordFailed,
} from "@/constants/messages";

const emailSchema = yup.object({
    email: yup
        .string()
        .email(authValidationEmailInvalid)
        .required(authValidationEmailRequired),
});

export default function ForgotPassword() {
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formik = useFormik({
        initialValues: { email: "" },
        validationSchema: emailSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setError(null);
            try {
                await callAPIInterface<IForgotPasswordBody, IMessageResponse>(
                    "POST",
                    "/forgot-password",
                    { email: values.email },
                );
                setSent(true);
            } catch (err: any) {
                if (err?.response) {
                    setError(
                        err.response.data?.message ?? authForgotPasswordFailed,
                    );
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <AuthLayout
            title={authForgotPasswordTitle}
            subtitle={
                sent
                    ? authForgotPasswordSentDescription
                    : authForgotPasswordDescription
            }
            footer={<Link to="/login">{authBackToSignIn}</Link>}
        >
            {!sent && (
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
                            onBlur={formik.handleBlur}
                            isError={
                                (formik.touched.email &&
                                    !!formik.errors.email) ||
                                !!error
                            }
                            helperText={
                                (formik.touched.email && formik.errors.email) ||
                                error ||
                                undefined
                            }
                            customClass="auth-input"
                            fullWidth
                        />
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        customClass="auth-submit-btn"
                        disabled={!formik.dirty || formik.isSubmitting}
                        isLoading={formik.isSubmitting}
                    >
                        {authForgotPasswordSendButton}
                    </Button>
                </Box>
            )}
        </AuthLayout>
    );
}
