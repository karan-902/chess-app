import { useState, useEffect, useRef } from "react";
import { OTPInput, type SlotProps } from "input-otp";
import { toast } from "sonner";
import clsx from "clsx";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import { callAPIInterface } from "@/utils";
import { authBackLink, authEmailVerificationExpired, authEmailVerificationExpiresIn, authEmailVerificationInvalidCode, authEmailVerificationResendButton, authEmailVerificationResendFailed, authEmailVerificationResendWithCooldown, authEmailVerificationResentSuccess, authEmailVerificationSentCodeTo, authEmailVerificationTitle, authEmailVerificationVerifiedSuccess, authEmailVerificationVerifyButton } from "@/components/messages";
import type { IVerifyEmailBody, IResendOtpBody } from "@/types/index";
import type { IMessageResponse } from "@/types/utils";


const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 10 * 60;
const RESEND_COOLDOWN_SECONDS = 30;

interface IEmailVerificationScreenProps {
    email: string;
    onVerified: () => void;
    onBack: () => void;
}

function Slot({ char, isActive, hasFakeCaret }: SlotProps) {
    return (
        <div className={clsx("otp-slot", isActive && "otp-slot--active")}>
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

export default function EmailVerificationScreen({
    email,
    onVerified,
    onBack,
}: IEmailVerificationScreenProps) {
    const [otp, setOtp] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);
    const [expirySeconds, setExpirySeconds] = useState(OTP_EXPIRY_SECONDS);
    const [cooldown, setCooldown] = useState(0);
    const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        tickRef.current = setInterval(() => {
            setExpirySeconds((s) => Math.max(0, s - 1));
            setCooldown((s) => Math.max(0, s - 1));
        }, 1000);
        return () => {
            if (tickRef.current) clearInterval(tickRef.current);
        };
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
        } catch (err: unknown) {
            const status = (err as { response?: { status?: number } })?.response
                ?.status;
            if (status !== 429) {
                const message =
                    (err as { response?: { data?: { message?: string } } })
                        ?.response?.data?.message ??
                    authEmailVerificationInvalidCode;
                toast.error(message);
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
        } catch (err: unknown) {
            const status = (err as { response?: { status?: number } })?.response
                ?.status;
            if (status !== 429) {
                toast.error(authEmailVerificationResendFailed);
            }
        } finally {
            setResending(false);
        }
    };

    return (
        <Box customClass="auth-form">
            <Button customClass="reg-back-link" onClick={onBack}>
                {authBackLink}
            </Button>

            <Box customClass="otp-heading">
                <Text as="h2" customClass="otp-title">
                    {authEmailVerificationTitle}
                </Text>
                <Text as="p" customClass="otp-subtitle">
                    {authEmailVerificationSentCodeTo(OTP_LENGTH)}{" "}
                    <strong>{email}</strong>
                </Text>
            </Box>

            <OTPInput
                maxLength={OTP_LENGTH}
                value={otp}
                onChange={setOtp}
                onComplete={handleVerify}
                containerClassName="otp-input-row"
                render={({ slots }) => (
                    <>
                        {slots.map((slot, i) => (
                            <Slot key={i} {...slot} />
                        ))}
                    </>
                )}
            />

            <Text as="p" customClass="otp-expiry">
                {expired
                    ? authEmailVerificationExpired
                    : authEmailVerificationExpiresIn(formatMMSS(expirySeconds))}
            </Text>

            <Button
                type="button"
                customClass="auth-submit-btn"
                isLoading={verifying}
                disabled={otp.length !== OTP_LENGTH || expired}
                onClick={handleVerify}
            >
                {authEmailVerificationVerifyButton}
            </Button>

            <Button
                type="button"
                variant="ghost"
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
    );
}
