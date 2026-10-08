import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Input from "@gopvp/common/src/components/Input/Input";
import Button from "@gopvp/common/src/components/Button/Button";
import type { IEmailScreenProps } from "@gopvp/common/src/types/component";
import {
 emailText,
 enterEmailText,
 orText,
 continueWithGoogleText,
 nextText,
} from "@gopvp/app/src/constants/message";
import { formSubmitHandler } from "@gopvp/common/src/util/form";

export default function EmailScreen({
 formik,
 error,
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
    isError={(formik.touched.email && !!formik.errors.email) || !!error}
    helperText={
     (formik.touched.email && formik.errors.email) || error || undefined
    }
    customClass="form-input gold-foil"
    fullWidth
   />

   <Button
    type="submit"
    variant="contained"
    fullWidth
    endIcon="arrowForward"
    customClass="auth-submit-btn auth-submit-btn-arrow gold-foil"
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
     customClass="auth-google-btn gold-foil"
     onClick={onGoogleLogin}
     disabled={isGoogleProcessing}
    >
     {continueWithGoogleText}
    </Button>
   </Box>
  </Box>
 );
}
