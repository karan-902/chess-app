import AuthLayout from "@/container/AuthLayout";
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
        <AuthLayout
            title={authRegisterTitle}
            subtitle={authRegisterSubtitle}
            footer={
                <>
                    {authRegisterHaveAccountPrompt}{" "}
                    <Link to="/login">{authRegisterSignInLink}</Link>
                </>
            }
        >
            <RegisterForm />
        </AuthLayout>
    );
}
