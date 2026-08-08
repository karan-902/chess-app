import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import { ShatranjLogo } from "@/components/constants";
import RegisterForm from "./RegisterForm";
import {
    authRegisterTitle,
    authRegisterSubtitle,
    authRegisterHaveAccountPrompt,
    authRegisterSignInLink,
} from "@/constants/messages";
import { Link } from "react-router";

export default function RegisterPage() {
    return (
        <Box customClass="auth-page">
            <Box customClass="auth-brand">
                <ShatranjLogo size={22} showText={true} />
            </Box>
            <Box customClass="auth-heading">
                <Text component="h1" customClass="auth-title">
                    {authRegisterTitle}
                </Text>
                <Text component="p" customClass="auth-subtitle">
                    {authRegisterSubtitle}
                </Text>
            </Box>
            <RegisterForm />
            <Text customClass="auth-footer">
                {authRegisterHaveAccountPrompt}{" "}
                <Link to="/login">{authRegisterSignInLink}</Link>
            </Text>
        </Box>
    );
}
