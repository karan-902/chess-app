import { NavLink } from "react-router-dom";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Input from "@gopvp/common/src/components/Input/Input";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomAvatar from "@gopvp/common/src/components/Avatar/Avatar";
import type { IPasswordScreenProps } from "@gopvp/common/src/types/component";
import {
 passwordText,
 enterPasswordText,
 changeText,
 loginText,
 forgotYourPasswordText,
 resetNowText,
} from "@gopvp/app/src/constants/message";
import { formSubmitHandler } from "@gopvp/common/src/util/form";

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
  <Box
   customClass="gopvp-login-form auth-password-stage"
   component="form"
   onSubmit={formSubmitHandler(formik.handleSubmit)}
  >
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

   <Box customClass="auth-actions">
    <Button
     type="submit"
     variant="contained"
     fullWidth
     customClass="auth-submit-btn"
     disabled={!formik.dirty || formik.isSubmitting}
     isLoading={formik.isSubmitting}
    >
     {loginText}
    </Button>
   </Box>

   <Text customClass="auth-forgot-row">
    {forgotYourPasswordText}
    <NavLink to="/forgot-password" className="auth-forgot-link">
     {resetNowText}
    </NavLink>
   </Text>
  </Box>
 );
}
