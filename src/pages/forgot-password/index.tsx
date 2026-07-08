import { useState } from "react";
import { Link } from "react-router";
import { useFormik } from "formik";
import { object, string } from "yup";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import Button from "../../components/base/Button/Button";
import Label from "../../components/base/Label/Label";
import Input from "../../components/base/Input/Input";
import { callAPIInterface } from "../../utils";
import type { IForgotPasswordBody } from "../../types/index";
import type { IMessageResponse } from "../../types/utils";

export default function ForgotPassword() {
    const [sent, setSent] = useState(false);

    const formik = useFormik({
        initialValues: { email: "" },
        validationSchema: object({
            email: string().required("Email is required").email("Enter a valid email"),
        }),
        onSubmit: async ({ email }, { setSubmitting }) => {
            try {
                await callAPIInterface<IForgotPasswordBody, IMessageResponse>(
                    "POST",
                    "/forgot-password",
                    { email },
                );
                setSent(true);
            } catch {
                setSent(true);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Box customClass="auth-page auth-page--centered">
            <Box customClass="auth-right">
                <Box customClass="auth-card">
                    <Box customClass="auth-heading">
                        <Text as="h1" customClass="auth-title">Forgot Password</Text>
                        <Text as="p" customClass="auth-subtitle">
                            {sent
                                ? "Check your inbox for a reset link."
                                : "Enter your email and we'll send you a reset link."}
                        </Text>
                    </Box>

                    {!sent && (
                        <form className="auth-form" onSubmit={formik.handleSubmit}>
                            <Box customClass="auth-field">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    name="email"
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isError={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email ? formik.errors.email : undefined}
                                    fullWidth
                                />
                            </Box>

                            <Button
                                type="submit"
                                customClass="auth-submit-btn"
                                disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
                            >
                                {formik.isSubmitting ? "Sending…" : "Send Reset Link"}
                            </Button>
                        </form>
                    )}

                    <Text as="p" customClass="auth-footer-text">
                        <Link to="/login">← Back to Sign In</Link>
                    </Text>
                </Box>
            </Box>
        </Box>
    );
}
