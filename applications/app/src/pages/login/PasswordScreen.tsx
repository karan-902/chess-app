import { NavLink } from "react-router-dom";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomAvatar from "@gopvp/common/src/components/Avatar/Avatar";
import InputScreen from "@gopvp/common/src/components/InputScreen/InputScreen";
import type { IPasswordScreenProps } from "@gopvp/common/src/types/component";
import {
 passwordText,
 enterPasswordText,
 changeText,
 loginText,
 forgotYourPasswordText,
 resetNowText,
} from "@gopvp/app/src/constants/message";

export default function PasswordScreen({
 verifiedEmail,
 verifiedUsername,
 formik,
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
  <InputScreen
   formik={formik}
   name="password"
   type="password"
   label={passwordText}
   placeholder={enterPasswordText}
   submitText={loginText}
   customClass="gopvp-login-form auth-password-stage"
   top={
    <Box customClass="auth-account-card">
     <CustomAvatar letter={initials} customClass="account" />
     <Box customClass="auth-account-info">
      <Text customClass="auth-account-name">{verifiedUsername}</Text>
      <Text customClass="auth-account-email">{verifiedEmail}</Text>
     </Box>
     <Button
      type="button"
      size="small"
      variant="text"
      startIcon="pencil"
      customClass="auth-change-btn"
      onClick={onChangeEmail}
     >
      {changeText}
     </Button>
    </Box>
   }
  >
   <Text customClass="auth-forgot-row">
    {forgotYourPasswordText}
    <NavLink to="/forgot-password" className="auth-forgot-link">
     {resetNowText}
    </NavLink>
   </Text>
  </InputScreen>
 );
}
