import { Link } from "react-router";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import AuthLeft from "../../container/AuthLeft";
import LoginForm from "./LoginForm";

export default function Login() {
    return (
        <Box customClass="auth-page">
            <AuthLeft variant="login" />

            <Box customClass="auth-right">
                <Box customClass="auth-card">
                    <Box customClass="auth-heading">
                        <Text as="h1" customClass="auth-title">Welcome Back</Text>
                        <Text as="p" customClass="auth-subtitle">Sign in to your KingStake account</Text>
                    </Box>

                    <LoginForm />

                    <Text as="p" customClass="auth-footer-text">
                        Don't have an account?{" "}
                        <Link to="/register">Create one</Link>
                    </Text>
                </Box>
            </Box>
        </Box>
    );
}
