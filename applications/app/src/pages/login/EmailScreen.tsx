import { NavLink } from "react-router-dom";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Input from "@gopvp/common/src/components/Input/Input";
import Button from "@gopvp/common/src/components/Button/Button";
import { formSubmitHandler } from "@gopvp/common/src/util/form";
import type { IEmailScreenProps } from "@gopvp/common/src/types/component";
import {
 emailText,
 enterEmailText,
 passwordText,
 enterPasswordText,
 forgotPasswordText,
 nextText,
 orText,
 continueWithGoogleText,
} from "@gopvp/app/src/constants/message";
import { ROUTES } from "@gopvp/app/src/constants/route";

export default function EmailScreen({
 formik,
 isGoogleProcessing,
 onGoogleLogin,
}: IEmailScreenProps) {
 return (
  <Box
   customClass="gopvp-email-form"
   component="form"
   onSubmit={formSubmitHandler(formik.handleSubmit)}
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
    isError={formik.touched.email && !!formik.errors.email}
    helperText={formik.errors.email}
    customClass="form-input"
    fullWidth
   />

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
    isError={formik.touched.password && !!formik.errors.password}
    helperText={formik.errors.password}
    customClass="form-input"
    fullWidth
   />

   <Text customClass="auth-forgot-row">
    <NavLink to={ROUTES.FORGOT_PASSWORD} className="auth-link">
     {forgotPasswordText}
    </NavLink>
   </Text>

   <Button
    type="submit"
    variant="contained"
    fullWidth
    customClass="auth-submit-btn"
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
     variant="contained"
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
