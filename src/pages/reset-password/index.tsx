import { useFormik } from "formik";
import { object, string, ref } from "yup";
import { Link, useNavigate, useSearchParams } from "react-router";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import Button from "../../components/base/Button/Button";
import Label from "../../components/base/Label/Label";
import Input from "../../components/base/Input/Input";
import { callAPIInterface } from "../../utils";
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
                .required("Password is required")
                .min(8, "Password must be at least 8 characters"),
            confirm: string()
                .required("Please confirm your password")
                .oneOf([ref("new_password")], "Passwords do not match"),
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
                setFieldError("new_password", "Reset link is invalid or has expired.");
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
                        <Box customClass="auth-heading">
                            <Text as="h1" customClass="auth-title">Invalid Link</Text>
                            <Text as="p" customClass="auth-subtitle">
                                This reset link is missing or invalid.
                            </Text>
                        </Box>
                        <Text as="p" customClass="auth-footer-text">
                            <Link to="/forgot-password">Request a new link</Link>
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
                    <Box customClass="auth-heading">
                        <Text as="h1" customClass="auth-title">Reset Password</Text>
                        <Text as="p" customClass="auth-subtitle">Choose a new password for your account.</Text>
                    </Box>

                    <form className="auth-form" onSubmit={formik.handleSubmit}>
                        <Box customClass="auth-field">
                            <Label htmlFor="new_password">New Password</Label>
                            <Input
                                name="new_password"
                                id="new_password"
                                type="password"
                                placeholder="••••••••"
                                value={formik.values.new_password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isError={formik.touched.new_password && Boolean(formik.errors.new_password)}
                                helperText={formik.touched.new_password ? formik.errors.new_password : undefined}
                                fullWidth
                            />
                        </Box>

                        <Box customClass="auth-field">
                            <Label htmlFor="confirm">Confirm Password</Label>
                            <Input
                                name="confirm"
                                id="confirm"
                                type="password"
                                placeholder="••••••••"
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
                            customClass="auth-submit-btn"
                            disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
                        >
                            {formik.isSubmitting ? "Resetting…" : "Reset Password"}
                        </Button>
                    </form>

                    <Text as="p" customClass="auth-footer-text">
                        <Link to="/login">← Back to Sign In</Link>
                    </Text>
                </Box>
            </Box>
        </Box>
    );
}
