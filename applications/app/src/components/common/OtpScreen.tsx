import { useState } from "react";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import OTPInput from "@gopvp/common/src/components/OtpInput/OtpInput";
import { useCountdown } from "@gopvp/common/src/hooks/useCountdown";
import { showApiErrorToast } from "@gopvp/common/src/util/api";
import { formSubmitHandler } from "@gopvp/common/src/util/form";
import { formatMMSS } from "@gopvp/common/src/util/format";
import { backText } from "@gopvp/common/src/constants/message";
import {
 resendCodeInText,
 resendCodeText,
 verifyText,
} from "@gopvp/app/src/constants/message";
import {
 OTP_LENGTH,
 OTP_RESEND_COOLDOWN_MS,
} from "@gopvp/app/src/constants/limit";
import type { IOtpScreenProps } from "@gopvp/app/src/types/component";

export default function OtpScreen({
 onVerify,
 onResend,
 onBack,
}: IOtpScreenProps) {
 const [otp, setOtp] = useState("");
 const [isVerifying, setIsVerifying] = useState(false);
 const [isResending, setIsResending] = useState(false);
 const [resendAt] = useState(() => Date.now() + OTP_RESEND_COOLDOWN_MS);
 const resendSecondsLeft = useCountdown(resendAt);

 const handleVerify = async () => {
  if (isVerifying || otp.length !== OTP_LENGTH) return;
  setIsVerifying(true);
  try {
   await onVerify(otp);
  } catch (err) {
   showApiErrorToast(err);
   setOtp("");
  } finally {
   setIsVerifying(false);
  }
 };

 const handleResend = async () => {
  setIsResending(true);
  try {
   await onResend();
  } finally {
   setIsResending(false);
  }
 };

 return (
  <Box
   customClass="gopvp-email-form"
   component="form"
   onSubmit={formSubmitHandler(handleVerify)}
  >
   <Button
    type="button"
    startIcon="arrowLeft"
    customClass="auth-back-btn"
    onClick={onBack}
    disabled={isVerifying}
   >
    {backText}
   </Button>
   <OTPInput
    length={OTP_LENGTH}
    value={otp}
    onChange={setOtp}
    customClass="auth-otp"
   />
   <Button
    type="submit"
    variant="contained"
    fullWidth
    customClass="auth-submit-btn"
    disabled={otp.length !== OTP_LENGTH}
    isLoading={isVerifying}
   >
    {verifyText}
   </Button>
   {resendSecondsLeft ? (
    <Text customClass="auth-resend-hint">
     {resendCodeInText(formatMMSS(resendSecondsLeft))}
    </Text>
   ) : (
    <Button
     type="button"
     variant="text"
     customClass="auth-resend-btn"
     onClick={handleResend}
     isLoading={isResending}
    >
     {resendCodeText}
    </Button>
   )}
  </Box>
 );
}
