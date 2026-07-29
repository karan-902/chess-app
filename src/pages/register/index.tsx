import { Link } from "react-router";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import AuthLeft from "../../container/AuthLeft";
import RegisterForm from "./RegisterForm";
import KingStakeLogo from "@/components/constants";
import { authRegisterTitle, authRegisterSubtitle, authRegisterHaveAccountPrompt, authRegisterSignInLink } from "@/components/messages";

export default function Register() {
    return (
        <Box customClass="auth-page">
            <AuthLeft variant="register" />
            <Box customClass="auth-right">
                <Box customClass="auth-mobile-logo">
                    <KingStakeLogo size={32} />
                </Box>
                <Box customClass="auth-card">
                    <Box customClass="auth-heading">
                        <Text as="h1" customClass="auth-title">
                            {authRegisterTitle}
                        </Text>
                        <Text as="p" customClass="auth-subtitle">
                            {authRegisterSubtitle}
                        </Text>
                    </Box>

                    <RegisterForm />

                    <Text as="p" customClass="auth-footer-text">
                        {authRegisterHaveAccountPrompt}{" "}
                        <Link to="/login">{authRegisterSignInLink}</Link>
                    </Text>
                </Box>
            </Box>
        </Box>
    );
}
