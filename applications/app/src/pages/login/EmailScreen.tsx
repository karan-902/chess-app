import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import InputScreen from "@gopvp/common/src/components/InputScreen/InputScreen";
import type { IEmailScreenProps } from "@gopvp/common/src/types/component";
import {
 emailText,
 enterEmailText,
 orText,
 continueWithGoogleText,
 nextText,
} from "@gopvp/app/src/constants/message";

export default function EmailScreen({
 formik,
 isGoogleProcessing,
 onGoogleLogin,
}: IEmailScreenProps) {
 return (
  <InputScreen
   formik={formik}
   name="email"
   type="email"
   label={emailText}
   placeholder={enterEmailText}
   submitText={nextText}
   customClass="gopvp-email-form"
  >
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
  </InputScreen>
 );
}
