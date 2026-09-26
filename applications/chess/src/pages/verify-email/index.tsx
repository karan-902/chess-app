import { NavLink, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "@/container/AuthLayout";
import VerifyEmailForm, { OTP_LENGTH } from "./VerifyEmailForm";
import {
 backToSignInText,
 verifyYourEmailText,
 sentCodeToText,
} from "@/constants/messages";

export default function VerifyEmail() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");

    if (!email) return <Navigate to="/login" replace />;

    return (
        <AuthLayout
            title={verifyYourEmailText}
            subtitle={
                <>
                    {sentCodeToText(OTP_LENGTH)}{" "}
                    <strong>{email}</strong>
                </>
            }
            footer={<NavLink to="/login">{backToSignInText}</NavLink>}
        >
            <VerifyEmailForm
                email={email}
                autoSend
                showHeading={false}
                onVerified={() => navigate("/login", { replace: true })}
            />
        </AuthLayout>
    );
}
