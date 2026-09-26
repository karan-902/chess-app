import { useState, useEffect } from "react";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import OTPInput from "@/components/base/OtpInput/OtpInput";
import { callAPIInterface, formatMMSS, showApiErrorToast } from "@/utils";
import { useReduxDispatch } from "@/redux/hooks";
import { showToast } from "@/redux/common/slice";
import type { IVerifyEmailBody, IResendOtpBody } from "@/types/index";
import type { IMessageResponse } from "@/types/utils";
import type { IVerifyEmailFormProps } from "@/types/components";
import {
 backText,
 verifyYourEmailText,
 sentCodeToText,
 codeExpiredText,
 codeExpiresInText,
 verifyEmailText,
 resendCodeCooldownText,
 resendOtpText,
} from "@/constants/messages";

export const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 10 * 60;
const RESEND_COOLDOWN_SECONDS = 30;


export default function VerifyEmailForm({
    email,
    autoSend = false,
    showHeading = true,
    onVerified,
    onBack,
}: IVerifyEmailFormProps) {
    const dispatch = useReduxDispatch();
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
            const res = await callAPIInterface<IVerifyEmailBody, IMessageResponse>(
                "POST",
                "/verify-email",
                { email, otp },
            );
            dispatch(showToast({ isToastOpen: true, toastMessage: res.message, toastVariant: "success" }));
            onVerified();
        } catch (err) {
            showApiErrorToast(err);
            setOtp("");
        } finally {
            setVerifying(false);
        }
    };

    const handleResend = async () => {
        if (resending || cooldown > 0) return;
        setResending(true);
        try {
            const res = await callAPIInterface<IResendOtpBody, IMessageResponse>(
                "POST",
                "/resend-otp",
                { email },
            );
            dispatch(showToast({ isToastOpen: true, toastMessage: res.message, toastVariant: "success" }));
            setOtp("");
            setExpirySeconds(OTP_EXPIRY_SECONDS);
            setCooldown(RESEND_COOLDOWN_SECONDS);
        } catch (err) {
            showApiErrorToast(err);
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
                    startIcon="arrowLeft"
                    customClass="auth-back-btn"
                    onClick={onBack}
                >
                    {backText}
                </Button>
            )}

            {showHeading && (
                <Box customClass="otp-heading">
                    <Text component="h2" customClass="otp-title">
                        {verifyYourEmailText}
                    </Text>
                    <Text component="p" customClass="otp-subtitle page-subtitle">
                        {sentCodeToText(OTP_LENGTH)}{" "}
                        <strong>{email}</strong>
                    </Text>
                </Box>
            )}

            <OTPInput
                length={OTP_LENGTH}
                value={otp}
                onChange={setOtp}
                onComplete={handleVerify}
            />

            <Text component="p" customClass="otp-expiry">
                {expired
                    ? codeExpiredText
                    : codeExpiresInText(formatMMSS(expirySeconds))}
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
                    {verifyEmailText}
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
                        ? resendCodeCooldownText(cooldown)
                        : resendOtpText}
                </Button>
            </Box>
        </Box>
    );
}
