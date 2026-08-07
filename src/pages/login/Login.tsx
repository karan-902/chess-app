import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import { ShatranjLogo } from "@/components/constants";
import LoginForm from "./LoginForm";
import {
    authLoginTitle,
    authLoginSubtitle,
    authLoginNoAccountPrompt,
    authLoginCreateOneLink,
} from "@/constants/messages";
import { Link } from "react-router";

export default function LoginPage() {
    return (
        <Box customClass="auth-page">
            <Box customClass="auth-brand">
                <ShatranjLogo size={22} showText={true} />
            </Box>
            <Box customClass="auth-heading">
                <Text component="h1" customClass="auth-title">
                    {authLoginTitle}
                </Text>
                <Text component="p" customClass="auth-subtitle">
                    {authLoginSubtitle}
                </Text>
            </Box>
            <LoginForm />
            <Text customClass="auth-footer">
                {authLoginNoAccountPrompt}{" "}
                <Link to="/register">{authLoginCreateOneLink}</Link>
            </Text>
        </Box>
    );
}
