import * as yup from "yup";
import { useState, useEffect, useRef } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";
import { useFormik } from "formik";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Input from "@/components/base/Input/Input";
import Button from "@/components/base/Button/Button";
import CustomAvatar from "@/components/base/Avatar/Avatar";
import AuthLayout from "@/container/AuthLayout";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
// import { useDeviceApprovalPoll } from "@/hooks/useDeviceApprovalPoll";
import SelectCountryScreen from "@/pages/select-country/SelectCountryScreen";
import { callAPIInterface } from "@/utils";
import { useReduxDispatch } from "@/redux/hooks";
import { login } from "@/redux/auth/thunk";
import { showLoader, hideLoader } from "@/redux/common/slice";
import type { IVerifyUserBody } from "@gopvp/common/src/types/payload";
import type { IVerifyUserResponse } from "@gopvp/common/src/types/response";
// import type { ILoginResponse } from "@gopvp/common/src/types/response";
import type { IEmailScreenProps, IPasswordValues, IPasswordScreenProps, LoginStep } from "@gopvp/common/src/types/component";
import {
 emailText,
 enterEmailText,
 passwordText,
 enterPasswordText,
 orText,
 continueWithGoogleText,
 emailRequiredText,
 enterValidEmailText,
 passwordRequiredText,
 changeText,
 // forgotYourPasswordText,
 // resetNowText,
 nextText,
 loginText,
 verifyEmailToContinueText,
 // newDeviceDetectedText,
 // approveSignInEmailedText,
 // backToLoginText,
 welcomeBackText,
 enterRegisteredEmailText,
 accessYourAccountText,
 enterPasswordToAccessText,
 noAccountPromptText,
 signUpText,
 selectYourCountryText,
} from "@/constants/messages";

const emailSchema = yup.object({
 email: yup.string().email(enterValidEmailText).required(emailRequiredText),
});

const passwordSchema = yup.object({
 password: yup.string().required(passwordRequiredText),
});

function EmailScreen({
 formik,
 error,
 isGoogleProcessing,
 onGoogleLogin,
}: IEmailScreenProps) {
 return (
  <Box
   customClass="gopvp-email-form"
   component="form"
   onSubmit={formik.handleSubmit as any}
  >
   <Input
    id="email"
    name="email"
    type="email"
    label={emailText}
    placeholder={enterEmailText}
    value={formik.values.email}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    disabled={formik.isSubmitting}
    isError={(formik.touched.email && !!formik.errors.email) || !!error}
    helperText={
     (formik.touched.email && formik.errors.email) || error || undefined
    }
    customClass="form-input"
    fullWidth
   />

   <Button
    type="submit"
    variant="contained"
    fullWidth
    endIcon="arrowForward"
    customClass="auth-submit-btn auth-submit-btn-arrow"
    disabled={!formik.dirty || formik.isSubmitting}
    isLoading={formik.isSubmitting}
   >
    {nextText}
   </Button>

   <Box customClass="auth-divider">
    <Text component="span">{orText}</Text>
   </Box>

   <Box customClass="social-stack">
    <Button
     type="button"
     startIcon="google"
     variant="outlined"
     fullWidth
     customClass="auth-google-btn"
     onClick={onGoogleLogin}
     disabled={isGoogleProcessing}
    >
     {continueWithGoogleText}
    </Button>
   </Box>
  </Box>
 );
}

function PasswordScreen({
 verifiedEmail,
 verifiedUsername,
 formik,
 error,
 onChangeEmail,
}: IPasswordScreenProps) {
 const initials = verifiedUsername
  .trim()
  .split(/\s+/)
  .map((part) => part.charAt(0))
  .join("")
  .slice(0, 2)
  .toUpperCase();

 return (
  <Box
   customClass="gopvp-login-form auth-password-stage"
   component="form"
   onSubmit={formik.handleSubmit as any}
  >
   <Box customClass="auth-account-card">
    <CustomAvatar letter={initials} customClass="md neutral" />
    <Box customClass="auth-account-info">
     <Text customClass="auth-account-name">{verifiedUsername}</Text>
     <Text customClass="auth-account-email">{verifiedEmail}</Text>
    </Box>
    <Button
     type="button"
     size="small"
     variant="outlined"
     startIcon="edit"
     customClass="auth-change-btn"
     onClick={onChangeEmail}
    >
     {changeText}
    </Button>
   </Box>

   <Input
    id="password"
    name="password"
    type="password"
    label={passwordText}
    placeholder={enterPasswordText}
    value={formik.values.password}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    disabled={formik.isSubmitting}
    isError={(formik.touched.password && !!formik.errors.password) || !!error}
    helperText={
     (formik.touched.password && formik.errors.password) || error || undefined
    }
    customClass="form-input"
    fullWidth
   />

   <Box customClass="auth-actions">
    <Button
     type="submit"
     variant="contained"
     fullWidth
     endIcon="arrowForward"
     customClass="auth-submit-btn auth-submit-btn-arrow"
     disabled={!formik.dirty || formik.isSubmitting}
     isLoading={formik.isSubmitting}
    >
     {loginText}
    </Button>
   </Box>

   {/* <Text customClass="auth-forgot-row">
    {forgotYourPasswordText}{" "}
    <NavLink to="/forgot-password" className="auth-forgot-link">
     {resetNowText}
    </NavLink>
   </Text> */}
  </Box>
 );
}

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
     "/auth/verify-user",
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
   } catch (err: any) {
    if (err?.response) {
     setError(err.response.data?.message ?? "");
    }
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
   dispatch(showLoader({ text: "Signing in..." }));
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
   } catch (err: any) {
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
    if (!err?.isNetworkError) setError(err.message);
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
   <AuthLayout title={selectYourCountryText}>
    <SelectCountryScreen showHeading={false} />
   </AuthLayout>
  );
 }

 const loginFooter = (
  <>
   {noAccountPromptText} <NavLink to="/register">{signUpText}</NavLink>
  </>
 );

 // if (step === "waiting-approval") {
 //  return (
 //   <AuthLayout
 //    title={welcomeBackText}
 //    subtitle={enterRegisteredEmailText}
 //    footer={loginFooter}
 //   >
 //    <WaitingApprovalScreen onBack={handleBackFromApproval} />
 //   </AuthLayout>
 //  );
 // }

 if (step === "password") {
  return (
   <AuthLayout
    title={accessYourAccountText}
    subtitle={enterPasswordToAccessText}
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
   subtitle={enterRegisteredEmailText}
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
