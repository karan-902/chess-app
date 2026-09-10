import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
import AuthLayout from "@/container/AuthLayout";
import VerifyEmailForm, { OTP_LENGTH } from "./VerifyEmailForm";
import {
    authBackToSignIn,
    authEmailVerificationTitle,
    authEmailVerificationSentCodeTo,
} from "@/constants/messages";

export default function VerifyEmail() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");

    if (!email) return <Navigate to="/login" replace />;

    return (
        <AuthLayout
            title={authEmailVerificationTitle}
            subtitle={
                <>
                    {authEmailVerificationSentCodeTo(OTP_LENGTH)}{" "}
                    <strong>{email}</strong>
                </>
            }
            footer={<Link to="/login">{authBackToSignIn}</Link>}
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
