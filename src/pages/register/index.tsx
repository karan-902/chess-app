import { Link } from "react-router";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import AuthLeft from "../../container/AuthLeft";
import RegisterForm from "./RegisterForm";

export default function Register() {
    return (
        <Box customClass="auth-page">
            <AuthLeft variant="register" />
            <Box customClass="auth-right">
                <Box customClass="auth-card">
                    <Box customClass="auth-heading">
                        <Text as="h1" customClass="auth-title">
                            Create Account
                        </Text>
                        <Text as="p" customClass="auth-subtitle">
                            Choose how you want to join
                        </Text>
                    </Box>

                    <RegisterForm />

                    <Text as="p" customClass="auth-footer-text">
                        Already have an account?{" "}
                        <Link to="/login">Sign in</Link>
                    </Text>
                </Box>
            </Box>
        </Box>
    );
}
