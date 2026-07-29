import { useState } from "react";
import { Link } from "react-router";
import { useFormik } from "formik";
import { object, string } from "yup";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import Button from "../../components/base/Button/Button";
import { Label } from "../../components/base/Label/label";
import Input from "../../components/base/Input/Input";
import KingStakeLogo from "@/components/constants";
import { callAPIInterface } from "../../utils";
import { authBackToSignIn, authEmailLabel, authEmailPlaceholder, authForgotPasswordDescription, authForgotPasswordSendButton, authForgotPasswordSentDescription, authForgotPasswordTitle, authValidationEmailInvalid, authValidationEmailRequired } from "@/components/messages";
import type { IForgotPasswordBody } from "../../types/index";
import type { IMessageResponse } from "../../types/utils";


export default function ForgotPassword() {
    const [sent, setSent] = useState(false);

    const formik = useFormik({
        initialValues: { email: "" },
        validationSchema: object({
            email: string().required(authValidationEmailRequired).email(authValidationEmailInvalid),
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
                    <Box customClass="auth-brand-mini">
                        <KingStakeLogo size={26} showText withCursor />
                    </Box>

                    <Box customClass="auth-heading">
                        <Text as="h1" customClass="auth-title">{authForgotPasswordTitle}</Text>
                        <Text as="p" customClass="auth-subtitle">
                            {sent
                                ? authForgotPasswordSentDescription
                                : authForgotPasswordDescription}
                        </Text>
                    </Box>

                    {!sent && (
                        <Box
                            as="form"
                            customClass="auth-form"
                            onSubmit={
                                formik.handleSubmit as React.FormEventHandler<HTMLElement>
                            }
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
                                fullWidth
                                customClass="auth-submit-btn"
                                isLoading={formik.isSubmitting}
                                disabled={!formik.isValid || !formik.dirty}
                            >
                                {authForgotPasswordSendButton}
                            </Button>
                        </Box>
                    )}

                    <Text as="p" customClass="auth-footer-text">
                        <Link to="/login">{authBackToSignIn}</Link>
                    </Text>
                </Box>
            </Box>
        </Box>
    );
}
