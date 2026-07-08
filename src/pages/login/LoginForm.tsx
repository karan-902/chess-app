import { useState } from "react";
import { useFormik } from "formik";
import { object, string } from "yup";
import { Link, useNavigate } from "react-router";
import Box from "../../components/base/Box/Box";
import Button from "../../components/base/Button/Button";
import Label from "../../components/base/Label/Label";
import Input from "../../components/base/Input/Input";
import Text from "../../components/base/Text/Text";
import GoogleIcon from "../../components/icons/GoogleIcon";
import { callAPIInterface } from "../../utils";
import sessionService from "../../store/sessionService";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import type { ILoginBody, IVerifyUserBody } from "../../types/index";
import type { ILoginResponse, IVerifyUserResponse } from "../../types/utils";

export default function LoginForm() {
    const [step, setStep] = useState<"email" | "password">("email");
    const [verifiedEmail, setVerifiedEmail] = useState("");
    const navigate = useNavigate();
    const { googleLogin } = useGoogleAuth("/sso-login", "login");

    // ── Step 1: email ──
    const emailFormik = useFormik({
        initialValues: { email: "" },
        validationSchema: object({
            email: string()
                .required("Email is required")
                .email("Enter a valid email"),
        }),
        onSubmit: async ({ email }, { setSubmitting, setFieldError }) => {
            try {
                const res = await callAPIInterface<
                    IVerifyUserBody,
                    IVerifyUserResponse
                >("POST", "/verify-user", { email });
                if (res.signup_method === "google") {
                    googleLogin();
                } else {
                    setVerifiedEmail(email);
                    setStep("password");
                }
            } catch {
                setFieldError("email", "No account found with this email");
            } finally {
                setSubmitting(false);
            }
        },
    });

    // ── Step 2: password ──
    const passwordFormik = useFormik({
        initialValues: { password: "" },
        validationSchema: object({
            password: string().required("Password is required"),
        }),
        onSubmit: async ({ password }, { setSubmitting, setFieldError }) => {
            try {
                const res = await callAPIInterface<
                    ILoginBody,
                    ILoginResponse
                >("POST", "/login", { email: verifiedEmail, password });
                await sessionService.saveSession(res);
                navigate("/lobby");
            } catch {
                setFieldError("password", "Incorrect password");
            } finally {
                setSubmitting(false);
            }
        },
    });

    if (step === "password") {
        return (
            <form className="auth-form" onSubmit={passwordFormik.handleSubmit}>
                <button
                    type="button"
                    className="reg-back-link"
                    onClick={() => setStep("email")}
                >
                    ← Back
                </button>

                <Box customClass="auth-verified-email">
                    <Text as="span" customClass="auth-verified-email-text">
                        {verifiedEmail}
                    </Text>
                </Box>

                <Box customClass="auth-field">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        name="password"
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        value={passwordFormik.values.password}
                        onChange={passwordFormik.handleChange}
                        onBlur={passwordFormik.handleBlur}
                        isError={
                            passwordFormik.touched.password &&
                            Boolean(passwordFormik.errors.password)
                        }
                        helperText={
                            passwordFormik.touched.password
                                ? passwordFormik.errors.password
                                : undefined
                        }
                        fullWidth
                    />
                </Box>

                <Box customClass="auth-forgot">
                    <Link to="/forgot-password">Forgot password?</Link>
                </Box>

                <Button
                    type="submit"
                    customClass="auth-submit-btn"
                    disabled={
                        !passwordFormik.isValid ||
                        !passwordFormik.dirty ||
                        passwordFormik.isSubmitting
                    }
                >
                    {passwordFormik.isSubmitting ? "Signing in…" : "Sign In"}
                </Button>
            </form>
        );
    }

    return (
        <Box customClass="login-form-wrap">
            <form className="auth-form" onSubmit={emailFormik.handleSubmit}>
                <Box customClass="auth-field">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        name="email"
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        value={emailFormik.values.email}
                        onChange={emailFormik.handleChange}
                        onBlur={emailFormik.handleBlur}
                        isError={
                            emailFormik.touched.email &&
                            Boolean(emailFormik.errors.email)
                        }
                        helperText={
                            emailFormik.touched.email
                                ? emailFormik.errors.email
                                : undefined
                        }
                        fullWidth
                    />
                </Box>

                <Button
                    type="submit"
                    customClass="auth-submit-btn"
                    disabled={
                        !emailFormik.isValid ||
                        !emailFormik.dirty ||
                        emailFormik.isSubmitting
                    }
                >
                    {emailFormik.isSubmitting ? "Checking…" : "Continue"}
                </Button>
            </form>

            <Box customClass="auth-divider">
                <Text as="span" customClass="auth-divider-text">
                    or
                </Text>
            </Box>

            <button
                className="auth-google-btn"
                type="button"
                onClick={() => googleLogin()}
            >
                <GoogleIcon size={18} />
                <Text as="span" customClass="auth-google-btn-label">
                    Continue with Google
                </Text>
            </button>
        </Box>
    );
}
