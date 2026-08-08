import AuthLayout from "@/container/AuthLayout";
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
        <AuthLayout
            title={authLoginTitle}
            subtitle={authLoginSubtitle}
            footer={
                <>
                    {authLoginNoAccountPrompt}{" "}
                    <Link to="/register">{authLoginCreateOneLink}</Link>
                </>
            }
        >
            <LoginForm />
        </AuthLayout>
    );
}
