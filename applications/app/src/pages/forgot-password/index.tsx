import * as yup from "yup";
import { useState } from "react";
import { useFormik } from "formik";
import AuthLayout from "@gopvp/app/src/container/AuthLayout";
import OtpScreen from "@gopvp/app/src/components/common/OtpScreen";
import InputScreen from "@gopvp/common/src/components/InputScreen/InputScreen";
import {
 callAPIInterface,
 getDeviceFingerprint,
 showApiErrorToast,
} from "@gopvp/common/src/util/api";
import sessionService from "@gopvp/common/src/util/sessionService";
import { ENDPOINTS } from "@gopvp/common/src/constants/endpoint";
import type {
 IForgotPasswordBody,
 IResetPasswordBody,
 IVerifyCodeBody,
} from "@gopvp/common/src/types/payload";
import type {
 ILoginResponse,
 IOtpRequiredResponse,
} from "@gopvp/common/src/types/response";
import {
 alreadyHaveAnAccount,
 checkYourEmailText,
 chooseNewPasswordText,
 codeSentToText,
 emailText,
 enterEmailForCodeText,
 enterEmailText,
 enterPasswordText,
 logInText,
 newPasswordText,
 resetPasswordText,
 sendCodeText,
} from "@gopvp/app/src/constants/message";
import { ROUTES } from "@gopvp/app/src/constants/route";
import { emailRule, newPasswordRule } from "@gopvp/app/src/utils/validation";

const emailSchema = yup.object({ email: emailRule });
const passwordSchema = yup.object({ password: newPasswordRule });

export default function ForgotPassword() {
 const [ticket, setTicket] = useState("");
 const [isCodeVerified, setIsCodeVerified] = useState(false);

 const emailFormik = useFormik({
  initialValues: { email: "" },
  validationSchema: emailSchema,
  onSubmit: async ({ email }) => {
   try {
    const fingerprint = await getDeviceFingerprint();
    const res = await callAPIInterface<
     IOtpRequiredResponse,
     IForgotPasswordBody
    >("POST", ENDPOINTS.FORGOT_PASSWORD, { email, fingerprint });
    setTicket(res.ticket);
   } catch (err) {
    showApiErrorToast(err);
   }
  },
 });

 const passwordFormik = useFormik({
  initialValues: { password: "" },
  validationSchema: passwordSchema,
  onSubmit: async ({ password }) => {
   try {
    const res = await callAPIInterface<ILoginResponse, IResetPasswordBody>(
     "POST",
     ENDPOINTS.RESET_PASSWORD,
     { ticket, password },
    );
    await sessionService.saveSession(res);
   } catch (err) {
    showApiErrorToast(err);
   }
  },
 });

 const handleVerifyCode = async (otp: string) => {
  await callAPIInterface<void, IVerifyCodeBody>(
   "POST",
   ENDPOINTS.VERIFY_RESET_CODE,
   { ticket, otp },
  );
  setIsCodeVerified(true);
 };

 const loginFooter = {
  title: alreadyHaveAnAccount,
  actionText: logInText,
  to: ROUTES.LOGIN,
 };

 if (isCodeVerified) {
  return (
   <AuthLayout
    title={newPasswordText}
    subtitle={chooseNewPasswordText}
    footerCard={loginFooter}
   >
    <InputScreen
     formik={passwordFormik}
     name="password"
     type="password"
     label={newPasswordText}
     placeholder={enterPasswordText}
     submitText={resetPasswordText}
     customClass="gopvp-email-form"
    />
   </AuthLayout>
  );
 }

 if (ticket) {
  return (
   <AuthLayout
    title={checkYourEmailText}
    subtitle={codeSentToText(emailFormik.values.email)}
    footerCard={loginFooter}
   >
    <OtpScreen onVerify={handleVerifyCode} onBack={() => setTicket("")} />
   </AuthLayout>
  );
 }

 return (
  <AuthLayout
   title={resetPasswordText}
   subtitle={enterEmailForCodeText}
   footerCard={loginFooter}
  >
   <InputScreen
    formik={emailFormik}
    name="email"
    type="email"
    label={emailText}
    placeholder={enterEmailText}
    submitText={sendCodeText}
    customClass="gopvp-email-form"
   />
  </AuthLayout>
 );
}
