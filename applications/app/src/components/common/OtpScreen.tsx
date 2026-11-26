import { useState } from "react";
import Box from "@gopvp/common/src/components/Box/Box";
import Button from "@gopvp/common/src/components/Button/Button";
import OTPInput from "@gopvp/common/src/components/OtpInput/OtpInput";
import { showApiErrorToast } from "@gopvp/common/src/util/api";
import { formSubmitHandler } from "@gopvp/common/src/util/form";
import { backText } from "@gopvp/common/src/constants/message";
import { verifyText } from "@gopvp/app/src/constants/message";
import { OTP_LENGTH } from "@gopvp/app/src/constants/limit";
import type { IOtpScreenProps } from "@gopvp/app/src/types/component";

export default function OtpScreen({ onVerify, onBack }: IOtpScreenProps) {
 const [otp, setOtp] = useState("");
 const [isVerifying, setIsVerifying] = useState(false);

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
  </Box>
 );
}
