import * as yup from "yup";
import { useState } from "react";
// import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";
import { useFormik } from "formik";
import AuthLayout from "@gopvp/app/src/container/AuthLayout";
import { useGoogleAuth } from "@gopvp/app/src/hooks/useGoogleAuth";
// import { useDeviceApprovalPoll } from "@gopvp/app/src/hooks/useDeviceApprovalPoll";
import SelectCountryScreen from "@gopvp/app/src/pages/select-country/SelectCountryScreen";
import OtpScreen from "@gopvp/app/src/components/common/OtpScreen";
import { showToastMessage } from "@gopvp/common/src/util/injectStore";
import { callAPIInterface } from "@gopvp/common/src/util/api";
import sessionService from "@gopvp/common/src/util/sessionService";
import { ENDPOINTS } from "@gopvp/common/src/constants/endpoint";
import type {
 IApiErrorInfo,
 ILoginResponse,
 IOtpRequiredResponse,
} from "@gopvp/common/src/types/response";
import { useReduxDispatch } from "@gopvp/app/src/redux/hooks";
import { login } from "@gopvp/app/src/redux/auth/thunk";
import { showLoader, hideLoader } from "@gopvp/app/src/redux/common/slice";
import type {
 ILoginBody,
 IVerifyCodeBody,
} from "@gopvp/common/src/types/payload";
// import type { ILoginResponse } from "@gopvp/common/src/types/response";
// import type { IPasswordValues } from "@gopvp/common/src/types/component";
import type { LoginStep } from "@gopvp/common/src/types/component";
import {
 // forgotYourPasswordText,
 // resetNowText,
 // verifyEmailToContinueText,
 // newDeviceDetectedText,
 // approveSignInEmailedText,
 // backToLoginText,
 welcomeBackText,
 rivalsWaitingText,
 noAccountText,
 signUpText,
 wherePlayingFromText,
 pickCountryToFinishText,
 signingInText,
 checkYourEmailText,
 codeSentToText,
} from "@gopvp/app/src/constants/message";
import { ROUTES } from "@gopvp/app/src/constants/route";
import { emailRule, passwordRule } from "@gopvp/app/src/utils/validation";
import EmailScreen from "@gopvp/app/src/pages/login/EmailScreen";
// import PasswordScreen from "@gopvp/app/src/pages/login/PasswordScreen";

const loginSchema = yup.object({ email: emailRule, password: passwordRule });

// const passwordSchema = yup.object({ password: passwordRule });

// function WaitingApprovalScreen({ onBack }: IWaitingApprovalScreenProps) {
//  return (
//   <Box customClass="auth-form">
//    <Button
//     type="button"
//     startIcon={<ArrowLeft size={16} />}
//     customClass="auth-back-btn"
//     onClick={onBack}
//    >
//     {backToLoginText}
//    </Button>
//
//    <Box customClass="auth-heading">
//     <Text component="h1" customClass="auth-title">
//      {newDeviceDetectedText}
//     </Text>
//     <Text component="p" customClass="page-subtitle">
//      {approveSignInEmailedText}
//     </Text>
//    </Box>
//   </Box>
//  );
// }

export default function LoginForm() {
 const dispatch = useReduxDispatch();
 // const navigate = useNavigate();
 const [searchParams] = useSearchParams();
 const [step, setStep] = useState<LoginStep>(
  searchParams.get("step") === "country" ? "country" : "email",
 );
 const [challenge, setChallenge] = useState<IOtpRequiredResponse | null>(
  null,
 );
 // const [verifiedEmail, setVerifiedEmail] = useState("");
 // const [verifiedUsername, setVerifiedUsername] = useState("");
 // const devicePoll = useDeviceApprovalPoll();

 // const handleApproved = (res: ILoginResponse) => {
 //  if (!res.country) {
 //   setStep("country");
 //   return;
 //  }
 //  navigate(res.skill_level === null ? "/skill-level" : "/play");
 // };

 const loginFormik = useFormik<ILoginBody>({
  initialValues: { email: "", password: "" },
  validationSchema: loginSchema,
  onSubmit: async ({ email, password }, { setSubmitting }) => {
   dispatch(showLoader({ text: signingInText }));
   try {
    const res = await dispatch(login({ email, password })).unwrap();
    if ("status" in res) setChallenge(res);
    else if (!res.country) setStep("country");
   } catch (err) {
    const { isNetworkError, status, message } = err as IApiErrorInfo;
    if (!isNetworkError && status !== 429 && message)
     showToastMessage({ toastMessage: message, toastVariant: "error" });
   } finally {
    setSubmitting(false);
    dispatch(hideLoader());
   }
  },
 });

 const { googleLogin, isProcessing } = useGoogleAuth(loginFormik.values.email);

 const handleVerifyCode = async (otp: string) => {
  if (!challenge) return;
  const res = await callAPIInterface<ILoginResponse, IVerifyCodeBody>(
   "POST",
   challenge.type === "NEW_DEVICE"
    ? ENDPOINTS.VERIFY_DEVICE
    : ENDPOINTS.VERIFY_EMAIL,
   { ticket: challenge.ticket, otp },
  );
  await sessionService.saveSession(res);
  if (!res.country) setStep("country");
 };

 // useEffect(() => {
 //  if (!pendingApprovalToken) return;
 //  setStep("waiting-approval");
 //  devicePoll.start(pendingApprovalToken, handleApproved);
 // }, [pendingApprovalToken]);

 // const focusEmailRef = useRef(false);
 //
 // useEffect(() => {
 //  if (step !== "email" || !focusEmailRef.current) return;
 //  document.getElementById("email")?.focus();
 //  focusEmailRef.current = false;
 // }, [step]);
 //
 // const passwordFormik = useFormik<IPasswordValues>({
 //  initialValues: { password: "" },
 //  validationSchema: passwordSchema,
 //  onSubmit: async (values, { setSubmitting }) => {
 //   dispatch(showLoader({ text: signingInText }));
 //   try {
 //    const res = await dispatch(
 //     login({ email: verifiedEmail, password: values.password }),
 //    ).unwrap();
 //    // if ("status" in res) {
 //    //  setStep("waiting-approval");
 //    //  devicePoll.start(res.approval_token, handleApproved);
 //    //  return;
 //    // }
 //
 //    if (!res.country) setStep("country");
 //   } catch (err) {
 //    const { isNetworkError, status, message } = err as IApiErrorInfo;
 //    // if (err?.type === "account_not_verified") {
 //    //  dispatch(
 //    //   showToast({
 //    //    isToastOpen: true,
 //    //    toastMessage: verifyEmailToContinueText,
 //    //    toastVariant: "error",
 //    //   }),
 //    //  );
 //    //  navigate(`/verify-email?email=${encodeURIComponent(verifiedEmail)}`);
 //    //  return;
 //    // }
 //    if (!isNetworkError && status !== 429 && message)
 //     showToastMessage({ toastMessage: message, toastVariant: "error" });
 //   } finally {
 //    setSubmitting(false);
 //    dispatch(hideLoader());
 //   }
 //  },
 // });
 //
 // const handleChangeEmail = () => {
 //  passwordFormik.resetForm();
 //  focusEmailRef.current = true;
 //  setStep("email");
 // };

 // const handleBackFromApproval = () => {
 //  devicePoll.stop();
 //  setStep("email");
 // };

 if (step === "country") {
  return (
   <AuthLayout title={wherePlayingFromText} subtitle={pickCountryToFinishText}>
    <SelectCountryScreen showHeading={false} />
   </AuthLayout>
  );
 }

 const loginFooter = {
  title: noAccountText,
  actionText: signUpText,
  to: ROUTES.REGISTER,
 };

 if (challenge) {
  return (
   <AuthLayout
    title={checkYourEmailText}
    subtitle={codeSentToText(loginFormik.values.email)}
   >
    <OtpScreen onVerify={handleVerifyCode} onBack={() => setChallenge(null)} />
   </AuthLayout>
  );
 }

 // if (step === "waiting-approval") {
 //  return (
 //   <AuthLayout
 //    title={welcomeBackText}
 //    titleAccent={championText}
 //    subtitle={logInFindRivalText}
 //    subtitleAccent={takeThePrizeText}
 //    footerCard={loginFooter}
 //   >
 //    <WaitingApprovalScreen onBack={handleBackFromApproval} />
 //   </AuthLayout>
 //  );
 // }

 // if (step === "password") {
 //  return (
 //   <AuthLayout title={welcomeBackText} subtitle={rivalsWaitingText}>
 //    <PasswordScreen
 //     verifiedEmail={verifiedEmail}
 //     verifiedUsername={verifiedUsername}
 //     formik={passwordFormik}
 //     onChangeEmail={handleChangeEmail}
 //    />
 //   </AuthLayout>
 //  );
 // }

 return (
  <AuthLayout
   title={welcomeBackText}
   subtitle={rivalsWaitingText}
   footerCard={loginFooter}
  >
   <EmailScreen
    formik={loginFormik}
    isGoogleProcessing={isProcessing}
    onGoogleLogin={() => googleLogin()}
   />
  </AuthLayout>
 );
}
