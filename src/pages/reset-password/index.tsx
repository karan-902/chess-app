import { useFormik } from "formik";
import { object, string, ref } from "yup";
import { Link, useNavigate, useSearchParams } from "react-router";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import Button from "../../components/base/Button/Button";
import { Label } from "../../components/base/Label/label";
import Input from "../../components/base/Input/Input";
import KingStakeLogo from "@/components/constants";
import { callAPIInterface } from "../../utils";
import { authBackToSignIn, authConfirmPasswordLabel, authPasswordPlaceholder, authResetPasswordDescription, authResetPasswordInvalidLinkDescription, authResetPasswordInvalidLinkTitle, authResetPasswordLinkInvalidOrExpired, authResetPasswordNewPasswordLabel, authResetPasswordRequestNewLink, authResetPasswordResetButton, authResetPasswordTitle, authValidationConfirmPasswordRequired, authValidationPasswordMinLength, authValidationPasswordRequired, authValidationPasswordsMustMatch } from "@/components/messages";
import type { IResetPasswordBody } from "../../types/index";
import type { IMessageResponse } from "../../types/utils";


export default function ResetPassword() {
    const [params] = useSearchParams();
    const reset_token = params.get("token") ?? "";
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: { new_password: "", confirm: "" },
        validationSchema: object({
            new_password: string()
                .required(authValidationPasswordRequired)
                .min(8, authValidationPasswordMinLength),
            confirm: string()
                .required(authValidationConfirmPasswordRequired)
                .oneOf([ref("new_password")], authValidationPasswordsMustMatch),
        }),
        onSubmit: async ({ new_password }, { setSubmitting, setFieldError }) => {
            try {
                await callAPIInterface<IResetPasswordBody, IMessageResponse>(
                    "POST",
                    "/reset-password",
                    { reset_token, new_password },
                );
                navigate("/login", { replace: true });
            } catch {
                setFieldError("new_password", authResetPasswordLinkInvalidOrExpired);
            } finally {
                setSubmitting(false);
            }
        },
    });

    if (!reset_token) {
        return (
            <Box customClass="auth-page auth-page--centered">
                <Box customClass="auth-right">
                    <Box customClass="auth-card">
                        <Box customClass="auth-brand-mini">
                            <KingStakeLogo size={26} showText withCursor />
                        </Box>
                        <Box customClass="auth-heading">
                            <Text as="h1" customClass="auth-title">{authResetPasswordInvalidLinkTitle}</Text>
                            <Text as="p" customClass="auth-subtitle">
                                {authResetPasswordInvalidLinkDescription}
                            </Text>
                        </Box>
                        <Text as="p" customClass="auth-footer-text">
                            <Link to="/forgot-password">{authResetPasswordRequestNewLink}</Link>
                        </Text>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box customClass="auth-page auth-page--centered">
            <Box customClass="auth-right">
                <Box customClass="auth-card">
                    <Box customClass="auth-brand-mini">
                        <KingStakeLogo size={26} showText withCursor />
                    </Box>

                    <Box customClass="auth-heading">
                        <Text as="h1" customClass="auth-title">{authResetPasswordTitle}</Text>
                        <Text as="p" customClass="auth-subtitle">{authResetPasswordDescription}</Text>
                    </Box>

                    <Box
                        as="form"
                        customClass="auth-form"
                        onSubmit={
                            formik.handleSubmit as React.FormEventHandler<HTMLElement>
                        }
                    >
                        <Box customClass="auth-field">
                            <Label
                                htmlFor="new_password"
                                className="font-mono text-[11px] tracking-[0.08em] uppercase text-white/30"
                            >
                                {authResetPasswordNewPasswordLabel}
                            </Label>
                            <Input
                                name="new_password"
                                id="new_password"
                                type="password"
                                placeholder={authPasswordPlaceholder}
                                value={formik.values.new_password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isError={formik.touched.new_password && Boolean(formik.errors.new_password)}
                                helperText={formik.touched.new_password ? formik.errors.new_password : undefined}
                                fullWidth
                            />
                        </Box>

                        <Box customClass="auth-field">
                            <Label
                                htmlFor="confirm"
                                className="font-mono text-[11px] tracking-[0.08em] uppercase text-white/30"
                            >
                                {authConfirmPasswordLabel}
                            </Label>
                            <Input
                                name="confirm"
                                id="confirm"
                                type="password"
                                placeholder={authPasswordPlaceholder}
                                value={formik.values.confirm}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isError={formik.touched.confirm && Boolean(formik.errors.confirm)}
                                helperText={formik.touched.confirm ? formik.errors.confirm : undefined}
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
                            {authResetPasswordResetButton}
                        </Button>
                    </Box>

                    <Text as="p" customClass="auth-footer-text">
                        <Link to="/login">{authBackToSignIn}</Link>
                    </Text>
                </Box>
            </Box>
        </Box>
    );
}
