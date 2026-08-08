import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { OTPInput, type SlotProps } from "input-otp";
import { toast } from "sonner";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import { callAPIInterface } from "@/utils";
import type { IVerifyEmailBody, IResendOtpBody } from "@/types/index";
import type { IMessageResponse } from "@/types/utils";
import {
    authLoginBack,
    authEmailVerificationTitle,
    authEmailVerificationSentCodeTo,
    authEmailVerificationVerifiedSuccess,
    authEmailVerificationInvalidCode,
    authEmailVerificationResentSuccess,
    authEmailVerificationResendFailed,
    authEmailVerificationExpired,
    authEmailVerificationExpiresIn,
    authEmailVerificationVerifyButton,
    authEmailVerificationResendWithCooldown,
    authEmailVerificationResendButton,
} from "@/constants/messages";

export const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 10 * 60;
const RESEND_COOLDOWN_SECONDS = 30;

function OtpSlot({ char, isActive, hasFakeCaret }: SlotProps) {
    return (
        <div className={`otp-slot${isActive ? " otp-slot--active" : ""}`}>
            {char}
            {hasFakeCaret && <div className="otp-slot-caret" />}
        </div>
    );
}

function formatMMSS(totalSeconds: number): string {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
}

interface IVerifyEmailFormProps {
    email: string;
    autoSend?: boolean;
    showHeading?: boolean;
    onVerified: () => void;
    onBack?: () => void;
}

export default function VerifyEmailForm({
    email,
    autoSend = false,
    showHeading = true,
    onVerified,
    onBack,
}: IVerifyEmailFormProps) {
    const [otp, setOtp] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);
    const [expirySeconds, setExpirySeconds] = useState(OTP_EXPIRY_SECONDS);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setExpirySeconds((s) => Math.max(0, s - 1));
            setCooldown((s) => Math.max(0, s - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const expired = expirySeconds <= 0;

    const handleVerify = async () => {
        if (otp.length !== OTP_LENGTH || verifying) return;
        setVerifying(true);
        try {
            await callAPIInterface<IVerifyEmailBody, IMessageResponse>(
                "POST",
                "/verify-email",
                { email, otp },
            );
            toast.success(authEmailVerificationVerifiedSuccess);
            onVerified();
        } catch (err: any) {
            if (err?.response?.status !== 429) {
                toast.error(
                    err?.response?.data?.message ??
                        authEmailVerificationInvalidCode,
                );
            }
            setOtp("");
        } finally {
            setVerifying(false);
        }
    };

    const handleResend = async () => {
        if (resending || cooldown > 0) return;
        setResending(true);
        try {
            await callAPIInterface<IResendOtpBody, IMessageResponse>(
                "POST",
                "/resend-otp",
                { email },
            );
            toast.success(authEmailVerificationResentSuccess);
            setOtp("");
            setExpirySeconds(OTP_EXPIRY_SECONDS);
            setCooldown(RESEND_COOLDOWN_SECONDS);
        } catch (err: any) {
            if (err?.response?.status !== 429) {
                toast.error(authEmailVerificationResendFailed);
            }
        } finally {
            setResending(false);
        }
    };

    useEffect(() => {
        if (autoSend) handleResend();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box customClass="auth-form">
            {onBack && (
                <Button
                    type="button"
                    startIcon={<ArrowLeft size={16} />}
                    customClass="auth-back-btn"
                    onClick={onBack}
                >
                    {authLoginBack}
                </Button>
            )}

            {showHeading && (
                <Box customClass="otp-heading">
                    <Text component="h2" customClass="otp-title">
                        {authEmailVerificationTitle}
                    </Text>
                    <Text component="p" customClass="otp-subtitle">
                        {authEmailVerificationSentCodeTo(OTP_LENGTH)}{" "}
                        <strong>{email}</strong>
                    </Text>
                </Box>
            )}

            <OTPInput
                maxLength={OTP_LENGTH}
                value={otp}
                onChange={setOtp}
                onComplete={handleVerify}
                containerClassName="otp-input-row"
                render={({ slots }) => (
                    <>
                        {slots.map((slot, i) => (
                            <OtpSlot key={i} {...slot} />
                        ))}
                    </>
                )}
            />

            <Text component="p" customClass="otp-expiry">
                {expired
                    ? authEmailVerificationExpired
                    : authEmailVerificationExpiresIn(formatMMSS(expirySeconds))}
            </Text>

            <Box customClass="auth-actions">
                <Button
                    type="button"
                    variant="contained"
                    fullWidth
                    customClass="auth-submit-btn"
                    isLoading={verifying}
                    disabled={otp.length !== OTP_LENGTH || expired}
                    onClick={handleVerify}
                >
                    {authEmailVerificationVerifyButton}
                </Button>

                <Button
                    type="button"
                    fullWidth
                    customClass="auth-submit-btn"
                    isLoading={resending}
                    disabled={cooldown > 0}
                    onClick={handleResend}
                >
                    {cooldown > 0
                        ? authEmailVerificationResendWithCooldown(cooldown)
                        : authEmailVerificationResendButton}
                </Button>
            </Box>
        </Box>
    );
}
