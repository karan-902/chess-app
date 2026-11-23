import * as yup from "yup";
import { useFormik } from "formik";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Input from "@gopvp/common/src/components/Input/Input";
import Text from "@gopvp/common/src/components/Text/Text";
import { InfoCircle } from "@gopvp/common/src/components/images";
import Button from "@gopvp/common/src/components/Button/Button";
import {
 callAPIInterface,
 getApiErrorResponse,
 showApiErrorToast,
} from "@gopvp/common/src/util/api";
import { ERROR_TYPES } from "@gopvp/common/src/constants/mapper";
import type { IRegisterBody } from "@gopvp/common/src/types/payload";
import type { IRegisterResponse } from "@gopvp/common/src/types/response";
import {
 emailText,
 enterEmailText,
 passwordText,
 enterPasswordText,
 passwordStrengthText,
 passwordHintText,
 registerText,
} from "@gopvp/app/src/constants/message";
import {
 PASSWORD_MIN_LENGTH,
 PASSWORD_STRENGTH_LEVELS,
} from "@gopvp/app/src/constants/limit";
import type { IEmailFormScreenProps } from "@gopvp/common/src/types/component";
import { ENDPOINTS } from "@gopvp/common/src/constants/endpoint";
import { formSubmitHandler } from "@gopvp/common/src/util/form";
import { PASSWORD_STRENGTH_LABELS } from "@gopvp/app/src/constants/label";
import {
 PASSWORD_CHAR_PATTERNS,
 countryRule,
 emailRule,
 newPasswordRule,
 usernameRule,
} from "@gopvp/app/src/utils/validation";
import CountrySelect from "@gopvp/app/src/components/common/CountrySelect";
import UsernameField from "@gopvp/app/src/components/common/UsernameField";

const registerSchema = yup.object({
 username: usernameRule,
 email: emailRule,
 password: newPasswordRule,
 country: countryRule,
});

export default function EmailFormScreen({
 onRegistered,
}: IEmailFormScreenProps) {
 const formik = useFormik<IRegisterBody>({
  initialValues: {
   username: "",
   email: "",
   password: "",
   country: "",
  },
  validationSchema: registerSchema,
  onSubmit: async (values, { setSubmitting, setStatus }) => {
   try {
    const response = await callAPIInterface<IRegisterResponse, IRegisterBody>(
     "POST",
     ENDPOINTS.REGISTER,
     {
      username: values.username,
      email: values.email,
      password: values.password,
      country: values.country,
     },
    );
    onRegistered(values.email, values.password, response.message);
   } catch (err) {
    if (getApiErrorResponse(err)?.data?.type === ERROR_TYPES.USERNAME_TAKEN)
     setStatus({ takenUsername: values.username.trim() });
    else showApiErrorToast(err);
   } finally {
    setSubmitting(false);
   }
  },
 });
 const { password } = formik.values;
 const hasPasswordError = formik.touched.password && !!formik.errors.password;
 const { lower, upper, digit, symbol } = PASSWORD_CHAR_PATTERNS;
 const passwordScore =
  password.length < PASSWORD_MIN_LENGTH
   ? 1
   : 1 +
     [
      lower.test(password) && upper.test(password),
      digit.test(password),
      symbol.test(password),
     ].filter(Boolean).length;
 const passwordStrengthLabel = PASSWORD_STRENGTH_LABELS[passwordScore];

 return (
  <Box
   customClass="gopvp-signup-form"
   component="form"
   onSubmit={formSubmitHandler(formik.handleSubmit)}
  >
   <UsernameField formik={formik} customClass="form-input" showHint />

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

   <Box customClass="password-field">
    <Input
     id="password"
     name="password"
     type="password"
     label={
      <>
       {passwordText}
       <Text component="span" customClass="field-hint">
        <InfoCircle aria-hidden />
        {passwordHintText(PASSWORD_MIN_LENGTH)}
       </Text>
      </>
     }
     placeholder={enterPasswordText}
     value={password}
     onChange={formik.handleChange}
     onBlur={formik.handleBlur}
     disabled={formik.isSubmitting}
     isError={hasPasswordError}
     helperText={formik.errors.password}
     customClass="form-input"
     fullWidth
    />
    {password && (
     <Box
      customClass={classNames(
       "password-strength",
       `level-${passwordScore}`,
       hasPasswordError && "hidden",
      )}
      role="meter"
      aria-label={passwordStrengthText}
      aria-valuemin={1}
      aria-valuemax={PASSWORD_STRENGTH_LEVELS}
      aria-valuenow={passwordScore}
      aria-valuetext={passwordStrengthLabel}
     >
      {Array.from({ length: PASSWORD_STRENGTH_LEVELS }, (_, index) => (
       <span
        key={index}
        className={classNames("strength-bar", index < passwordScore && "filled")}
       />
      ))}
      <Text component="span" customClass="password-strength-label">
       {passwordStrengthLabel}
      </Text>
     </Box>
    )}
   </Box>

   <CountrySelect formik={formik} />

   <Button
    type="submit"
    variant="contained"
    fullWidth
    customClass="auth-submit-btn"
    disabled={!formik.dirty || !formik.isValid || formik.isSubmitting}
    isLoading={formik.isSubmitting}
   >
    {registerText}
   </Button>
  </Box>
 );
}
