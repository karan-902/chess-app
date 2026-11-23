import * as yup from "yup";
import {
 countryRequiredText,
 emailRequiredText,
 enterValidEmailText,
 passwordRequiredText,
 passwordTooLongText,
 usernameMaxLengthText,
 usernameMinLengthText,
 usernameRequiredText,
 weakPasswordText,
} from "@gopvp/app/src/constants/message";
import {
 PASSWORD_MAX_BYTES,
 PASSWORD_MIN_LENGTH,
 USERNAME_MAX_LENGTH,
 USERNAME_MIN_LENGTH,
} from "@gopvp/app/src/constants/limit";

export const PASSWORD_CHAR_PATTERNS = {
 lower: /[a-z]/,
 upper: /[A-Z]/,
 digit: /\d/,
 symbol: /[-#!$@£%^&*()_+|~=`{}[\]:";'<>?,./\\ ]/,
};

export const emailRule = yup
 .string()
 .email(enterValidEmailText)
 .required(emailRequiredText);

export const passwordRule = yup.string().required(passwordRequiredText);

export const newPasswordRule = passwordRule
 .min(PASSWORD_MIN_LENGTH, weakPasswordText)
 .matches(PASSWORD_CHAR_PATTERNS.lower, weakPasswordText)
 .matches(PASSWORD_CHAR_PATTERNS.upper, weakPasswordText)
 .matches(PASSWORD_CHAR_PATTERNS.digit, weakPasswordText)
 .matches(PASSWORD_CHAR_PATTERNS.symbol, weakPasswordText)
 .test(
  "max-bytes",
  passwordTooLongText(PASSWORD_MAX_BYTES),
  (password = "") =>
   new TextEncoder().encode(password).length <= PASSWORD_MAX_BYTES,
 );

export const usernameRule = yup
 .string()
 .trim()
 .required(usernameRequiredText)
 .min(USERNAME_MIN_LENGTH, usernameMinLengthText)
 .max(USERNAME_MAX_LENGTH, usernameMaxLengthText);

export const countryRule = yup.string().required(countryRequiredText);
