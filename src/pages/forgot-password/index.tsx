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
import { useReduxDispatch } from "@/redux/hooks";
import { showToast } from "@/redux/common/common.slice";
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
    const dispatch = useReduxDispatch();
    const [sent, setSent] = useState(false);

    const formik = useFormik({
        initialValues: { email: "" },
        validationSchema: emailSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await callAPIInterface<IForgotPasswordBody, IMessageResponse>(
                    "POST",
                    "/forgot-password",
                    { email: values.email },
                );
                setSent(true);
            } catch (err: any) {
                dispatch(
                    showToast({
                        message:
                            err?.response?.data?.message ??
                            authForgotPasswordFailed,
                        severity: "error",
                    }),
                );
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
                                formik.touched.email && !!formik.errors.email
                            }
                            helperText={formik.errors.email}
                            customClass="auth-input-underline"
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
