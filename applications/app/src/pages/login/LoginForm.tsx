import * as yup from "yup";
import { useState, useEffect, useRef } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";
import { useFormik } from "formik";
import AuthLayout from "@gopvp/app/src/container/AuthLayout";
import { useGoogleAuth } from "@gopvp/app/src/hooks/useGoogleAuth";
// import { useDeviceApprovalPoll } from "@gopvp/app/src/hooks/useDeviceApprovalPoll";
import SelectCountryScreen from "@gopvp/app/src/pages/select-country/SelectCountryScreen";
import {
 callAPIInterface,
 getApiErrorResponse,
} from "@gopvp/common/src/util/api";
import type { IApiErrorInfo } from "@gopvp/common/src/types/response";
import { useReduxDispatch } from "@gopvp/app/src/redux/hooks";
import { login } from "@gopvp/app/src/redux/auth/thunk";
import { showLoader, hideLoader } from "@gopvp/app/src/redux/common/slice";
import type { IVerifyUserBody } from "@gopvp/common/src/types/payload";
import type { IVerifyUserResponse } from "@gopvp/common/src/types/response";
// import type { ILoginResponse } from "@gopvp/common/src/types/response";
import type {
 IPasswordValues,
 LoginStep,
} from "@gopvp/common/src/types/component";
import {
 // forgotYourPasswordText,
 // resetNowText,
 verifyEmailToContinueText,
 // newDeviceDetectedText,
 // approveSignInEmailedText,
 // backToLoginText,
 welcomeBackText,
 jumpBackIntoGameText,
 enterYourPasswordText,
 nextMatchOneStepAwayText,
 noAccountPromptText,
 signUpText,
 wherePlayingFromText,
 pickCountryToFinishText,
 signingInText,
} from "@gopvp/app/src/constants/message";
import { ROUTES } from "@gopvp/app/src/constants/route";
import { ENDPOINTS } from "@gopvp/common/src/constants/endpoint";
import { emailRule, passwordRule } from "@gopvp/app/src/utils/validation";
import EmailScreen from "@gopvp/app/src/pages/login/EmailScreen";
import PasswordScreen from "@gopvp/app/src/pages/login/PasswordScreen";

const emailSchema = yup.object({ email: emailRule });

const passwordSchema = yup.object({ password: passwordRule });

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
 const [verifiedEmail, setVerifiedEmail] = useState("");
 const [verifiedUsername, setVerifiedUsername] = useState("");
 const [error, setError] = useState<string | null>(null);
 // const devicePoll = useDeviceApprovalPoll();

 // const handleApproved = (res: ILoginResponse) => {
 //  if (!res.country) {
 //   setStep("country");
 //   return;
 //  }
 //  navigate(res.skill_level === null ? "/skill-level" : "/play");
 // };

 const emailFormik = useFormik({
  initialValues: { email: "" },
  validationSchema: emailSchema,
  onSubmit: async (values, { setSubmitting }) => {
   setError(null);
   try {
    const res = await callAPIInterface<IVerifyUserResponse, IVerifyUserBody>(
     "POST",
     ENDPOINTS.VERIFY_USER,
     { email: values.email },
    );

    if (res.signup_method === "GOOGLE") {
     googleLogin();
     return;
    }

    if (!res.is_verified) {
     setError(verifyEmailToContinueText);
     // dispatch(
     //  showToast({
     //   isToastOpen: true,
     //   toastMessage: verifyEmailToContinueText,
     //   toastVariant: "error",
     //  }),
     // );
     // navigate(`/verify-email?email=${encodeURIComponent(values.email)}`);
     return;
    }

    setVerifiedEmail(values.email);
    setVerifiedUsername(res.username);
    setStep("password");
   } catch (err) {
    const response = getApiErrorResponse(err);
    if (response) setError(response.data?.message ?? "");
   } finally {
    setSubmitting(false);
   }
  },
 });

 const { googleLogin, isProcessing } = useGoogleAuth(emailFormik.values.email);

 // useEffect(() => {
 //  if (!pendingApprovalToken) return;
 //  setStep("waiting-approval");
 //  devicePoll.start(pendingApprovalToken, handleApproved);
 // }, [pendingApprovalToken]);

 const focusEmailRef = useRef(false);

 useEffect(() => {
  if (step !== "email" || !focusEmailRef.current) return;
  document.getElementById("email")?.focus();
  focusEmailRef.current = false;
 }, [step]);

 const passwordFormik = useFormik<IPasswordValues>({
  initialValues: { password: "" },
  validationSchema: passwordSchema,
  onSubmit: async (values, { setSubmitting }) => {
   setError(null);
   dispatch(showLoader({ text: signingInText }));
   try {
    const res = await dispatch(
     login({ email: verifiedEmail, password: values.password }),
    ).unwrap();
    // if ("status" in res) {
    //  setStep("waiting-approval");
    //  devicePoll.start(res.approval_token, handleApproved);
    //  return;
    // }

    if (!res.country) setStep("country");
   } catch (err) {
    const { isNetworkError, message } = err as IApiErrorInfo;
    // if (err?.type === "account_not_verified") {
    //  dispatch(
    //   showToast({
    //    isToastOpen: true,
    //    toastMessage: verifyEmailToContinueText,
    //    toastVariant: "error",
    //   }),
    //  );
    //  navigate(`/verify-email?email=${encodeURIComponent(verifiedEmail)}`);
    //  return;
    // }
    if (!isNetworkError) setError(message ?? null);
   } finally {
    setSubmitting(false);
    dispatch(hideLoader());
   }
  },
 });

 const handleChangeEmail = () => {
  setError(null);
  passwordFormik.resetForm();
  focusEmailRef.current = true;
  setStep("email");
 };

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

 const loginFooter = (
  <>
   {noAccountPromptText} <NavLink to={ROUTES.REGISTER}>{signUpText}</NavLink>
  </>
 );

 // if (step === "waiting-approval") {
 //  return (
 //   <AuthLayout
 //    title={welcomeBackText}
 //    subtitle={jumpBackIntoGameText}
 //    footer={loginFooter}
 //   >
 //    <WaitingApprovalScreen onBack={handleBackFromApproval} />
 //   </AuthLayout>
 //  );
 // }

 if (step === "password") {
  return (
   <AuthLayout
    title={enterYourPasswordText}
    subtitle={nextMatchOneStepAwayText}
   >
    <PasswordScreen
     verifiedEmail={verifiedEmail}
     verifiedUsername={verifiedUsername}
     formik={passwordFormik}
     error={error}
     onChangeEmail={handleChangeEmail}
    />
   </AuthLayout>
  );
 }

 return (
  <AuthLayout
   title={welcomeBackText}
   subtitle={jumpBackIntoGameText}
   footer={loginFooter}
  >
   <EmailScreen
    formik={emailFormik}
    error={error}
    isGoogleProcessing={isProcessing}
    onGoogleLogin={() => googleLogin()}
   />
  </AuthLayout>
 );
}
