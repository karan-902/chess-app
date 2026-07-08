import { useState } from "react";
import { useFormik } from "formik";
import { object, string, ref } from "yup";
import { Mail, ChevronRight } from "lucide-react";
import Box from "../../components/base/Box/Box";
import Button from "../../components/base/Button/Button";
import Label from "../../components/base/Label/Label";
import Input from "../../components/base/Input/Input";
import Text from "../../components/base/Text/Text";
import GoogleIcon from "../../components/icons/GoogleIcon";
import { callAPIInterface } from "../../utils";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import type { IRegisterEmailBody } from "../../types/index";
import type { IRegisterResponse } from "../../types/utils";
import { useNavigate } from "react-router";

const emailSchema = object({
    first_name: string().required("First name is required"),
    last_name: string().required("Last name is required"),
    email: string().required("Email is required").email("Enter a valid email"),
    password: string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters"),
    confirm: string()
        .required("Please confirm your password")
        .oneOf([ref("password")], "Passwords do not match"),
    country: string().required("Country is required"),
});

function EmailRegisterForm({ onBack }: { onBack: () => void }) {
    const navigate = useNavigate();

    const {
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        errors,
        isSubmitting,
        isValid,
        dirty,
    } = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            confirm: "",
            country: "",
        },
        validationSchema: emailSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const payload: IRegisterEmailBody = {
                    first_name: values.first_name,
                    last_name: values.last_name,
                    email: values.email,
                    password: values.password,
                    country: values.country,
                };
                await callAPIInterface<IRegisterEmailBody, IRegisterResponse>(
                    "POST",
                    "/register",
                    payload,
                );
                navigate("/login");
            } catch (err) {
                console.error(err);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const field = (name: keyof typeof values) => ({
        name,
        id: name,
        value: values[name],
        onChange: handleChange,
        onBlur: handleBlur,
        isError: touched[name] && Boolean(errors[name]),
        helperText: touched[name] ? errors[name] : undefined,
        fullWidth: true as const,
    });

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <button type="button" className="reg-back-link" onClick={onBack}>
                ← Back
            </button>

            <Box customClass="auth-field">
                <Label htmlFor="first_name">First Name</Label>
                <Input {...field("first_name")} placeholder="Karan" />
            </Box>

            <Box customClass="auth-field">
                <Label htmlFor="last_name">Last Name</Label>
                <Input {...field("last_name")} placeholder="Dhakad" />
            </Box>

            <Box customClass="auth-field">
                <Label htmlFor="email">Email</Label>
                <Input
                    {...field("email")}
                    type="email"
                    placeholder="you@example.com"
                />
            </Box>

            <Box customClass="auth-field">
                <Label htmlFor="password">Password</Label>
                <Input
                    {...field("password")}
                    type="password"
                    placeholder="••••••••"
                />
            </Box>

            <Box customClass="auth-field">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input
                    {...field("confirm")}
                    type="password"
                    placeholder="••••••••"
                />
            </Box>

            <Box customClass="auth-field">
                <Label htmlFor="country">Country</Label>
                <Input {...field("country")} placeholder="India" />
            </Box>

            <Button
                customClass="auth-submit-btn"
                type="submit"
                disabled={!isValid || !dirty || isSubmitting}
            >
                {isSubmitting ? "Creating account…" : "Create Account"}
            </Button>
        </form>
    );
}

export default function RegisterForm() {
    const [path, setPath] = useState<"email" | null>(null);
    const { googleLogin } = useGoogleAuth("/sso-register", "register");

    if (path === "email") {
        return <EmailRegisterForm onBack={() => setPath(null)} />;
    }

    return (
        <Box customClass="reg-method-list">
            <button className="reg-method-row" onClick={() => setPath("email")}>
                <Box customClass="reg-method-icon email-icon">
                    <Mail size={18} />
                </Box>
                <Box customClass="reg-method-text">
                    <Text as="span" customClass="reg-method-title">
                        Email
                    </Text>
                    <Text as="span" customClass="reg-method-sub">
                        Username · password
                    </Text>
                </Box>
                <ChevronRight size={16} className="reg-method-arrow" />
            </button>

            <button className="reg-method-row" onClick={() => googleLogin()}>
                <Box customClass="reg-method-icon google-icon">
                    <GoogleIcon size={18} />
                </Box>
                <Box customClass="reg-method-text">
                    <Text as="span" customClass="reg-method-title">
                        Google
                    </Text>
                    <Text as="span" customClass="reg-method-sub">
                        One-tap sign up
                    </Text>
                </Box>
                <ChevronRight size={16} className="reg-method-arrow" />
            </button>
        </Box>
    );
}
