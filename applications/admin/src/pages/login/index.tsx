import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Box from "@gopvp/common/src/components/Box/Box";
import Card from "@gopvp/common/src/components/Card/Card";
import Text from "@gopvp/common/src/components/Text/Text";
import Input from "@gopvp/common/src/components/Input/Input";
import Button from "@gopvp/common/src/components/Button/Button";
import OTPInput from "@gopvp/common/src/components/OtpInput/OtpInput";
import { getDeviceFingerprint } from "@gopvp/common/src/util/api";
import {
 ADMIN_API_STATUS,
 ADMIN_ENDPOINTS,
} from "@gopvp/admin/src/constants/endpoint";
import { ADMIN_LOGO_PATH } from "@gopvp/admin/src/constants/asset";
import { ADMIN_OTP_LENGTH } from "@gopvp/admin/src/constants/limit";
import { ROUTES } from "@gopvp/admin/src/constants/route";
import {
 adminSignInHintText,
 adminSignInText,
 backToSignInText,
 brandAltText,
 checkEmailText,
 codeSentToText,
 emailText,
 passwordText,
 signInText,
 verifyText,
 waitingApprovalHintText,
 waitingApprovalText,
} from "@gopvp/admin/src/constants/message";
import { adminApiCall, getApiErrorMessage } from "@gopvp/admin/src/utils/api";
import { saveAdminSession } from "@gopvp/admin/src/utils/session";
import { useToast } from "@gopvp/admin/src/context/ToastContext";
import type {
 TAdminLoginBody,
 TAdminOtpRequiredResponse,
 TAdminVerifyOtpBody,
 TAdminVerifyOtpResponse,
} from "@gopvp/admin/src/types";

type TLoginStep = "credentials" | "otp" | "pending";

export default function Login() {
 const navigate = useNavigate();
 const showToast = useToast();
 const [searchParams, setSearchParams] = useSearchParams();
 const ticket = searchParams.get("ticket") ?? "";
 const [step, setStep] = useState<TLoginStep>(
  ticket ? "otp" : "credentials"
 );
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [otp, setOtp] = useState("");
 const [isLoading, setIsLoading] = useState(false);

 const resetToCredentials = () => {
  setSearchParams({}, { replace: true });
  setStep("credentials");
  setOtp("");
 };

 const handleCredentials = async (event: FormEvent) => {
  event.preventDefault();
  if (isLoading) return;
  setIsLoading(true);
  try {
   const response = await adminApiCall<
    TAdminOtpRequiredResponse,
    TAdminLoginBody
   >("POST", ADMIN_ENDPOINTS.LOGIN, { email, password });
   setSearchParams({ ticket: response.ticket });
   setStep("otp");
  } catch (requestError) {
   showToast({
    toastMessage: getApiErrorMessage(requestError),
    toastVariant: "error",
   });
  } finally {
   setIsLoading(false);
  }
 };

 const handleOtp = async (event?: FormEvent) => {
  event?.preventDefault();
  if (isLoading || otp.length !== ADMIN_OTP_LENGTH) return;
  setIsLoading(true);
  try {
   const fingerprint = await getDeviceFingerprint();
   const response = await adminApiCall<
    TAdminVerifyOtpResponse,
    TAdminVerifyOtpBody
   >("POST", ADMIN_ENDPOINTS.VERIFY_OTP, { ticket, otp, fingerprint });
   if (
    "status" in response &&
    response.status === ADMIN_API_STATUS.DEVICE_PENDING
   ) {
    setStep("pending");
    return;
   }
   if (!("status" in response)) {
    saveAdminSession(response);
    navigate(ROUTES.DASHBOARD, { replace: true });
   }
  } catch (requestError) {
   showToast({
    toastMessage: getApiErrorMessage(requestError),
    toastVariant: "error",
   });
  } finally {
   setIsLoading(false);
  }
 };

 return (
  <Box customClass="admin-auth">
   <Card customClass="admin-auth-card">
    <Box customClass="admin-auth-brand">
     <img src={ADMIN_LOGO_PATH} alt={brandAltText} />
    </Box>

    {step === "credentials" && (
     <>
      <Box customClass="admin-auth-head">
       <Text component="h1" customClass="admin-page-title">
        {adminSignInText}
       </Text>
       <Text customClass="color-muted">{adminSignInHintText}</Text>
      </Box>
      <form onSubmit={handleCredentials}>
       <Input
        id="admin-email"
        type="email"
        autoComplete="username"
        label={emailText}
        customClass="admin-input"
        labelClassName="admin-input-label"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        fullWidth
       />
       <Input
        id="admin-password"
        type="password"
        autoComplete="current-password"
        label={passwordText}
        customClass="admin-input"
        labelClassName="admin-input-label"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        fullWidth
       />
       <Button
        type="submit"
        customClass="admin-btn primary"
        fullWidth
        isLoading={isLoading}
       >
        {signInText}
       </Button>
      </form>
     </>
    )}

    {step === "otp" && (
     <>
      <Box customClass="admin-auth-head">
       <Text component="h1" customClass="admin-page-title">
        {checkEmailText}
       </Text>
       <Text customClass="color-muted">{codeSentToText(email)}</Text>
      </Box>
      <form onSubmit={handleOtp}>
       <OTPInput length={ADMIN_OTP_LENGTH} value={otp} onChange={setOtp} />
       <Button
        type="submit"
        customClass="admin-btn primary"
        fullWidth
        isLoading={isLoading}
        disabled={otp.length !== ADMIN_OTP_LENGTH}
       >
        {verifyText}
       </Button>
       <Button customClass="admin-btn" fullWidth onClick={resetToCredentials}>
        {backToSignInText}
       </Button>
      </form>
     </>
    )}

    {step === "pending" && (
     <>
      <Box customClass="admin-auth-head">
       <Text component="h1" customClass="admin-page-title">
        {waitingApprovalText}
       </Text>
       <Text customClass="color-muted">{waitingApprovalHintText}</Text>
      </Box>
      <Button customClass="admin-btn" fullWidth onClick={resetToCredentials}>
       {backToSignInText}
      </Button>
     </>
    )}
   </Card>
  </Box>
 );
}
