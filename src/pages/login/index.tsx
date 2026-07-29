import { Link } from "react-router";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import AuthLeft from "../../container/AuthLeft";
import LoginForm from "./LoginForm";
import KingStakeLogo from "@/components/constants";
import { authLoginTitle, authLoginSubtitle, authLoginNoAccountPrompt, authLoginCreateOneLink } from "@/components/messages";

export default function Login() {
    return (
        <Box customClass="auth-page">
            <AuthLeft variant="login" />

            <Box customClass="auth-right">
                <Box customClass="auth-mobile-logo">
                    <KingStakeLogo size={32} />
                </Box>
                <Box customClass="auth-card">
                    <Box customClass="auth-heading">
                        <Text as="h1" customClass="auth-title">{authLoginTitle}</Text>
                        <Text as="p" customClass="auth-subtitle">{authLoginSubtitle}</Text>
                    </Box>

                    <LoginForm />

                    <Text as="p" customClass="auth-footer-text">
                        {authLoginNoAccountPrompt}{" "}
                        <Link to="/register">{authLoginCreateOneLink}</Link>
                    </Text>
                </Box>
            </Box>
        </Box>
    );
}
