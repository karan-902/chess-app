import * as yup from "yup";
import {
 countryRequiredText,
 emailRequiredText,
 enterValidEmailText,
 passwordMinLengthText,
 passwordRequiredText,
 usernameMaxLengthText,
 usernameMinLengthText,
 usernameRequiredText,
} from "@gopvp/app/src/constants/message";
import {
 PASSWORD_MIN_LENGTH,
 USERNAME_MAX_LENGTH,
 USERNAME_MIN_LENGTH,
} from "@gopvp/app/src/constants/limit";

export const emailRule = yup
 .string()
 .email(enterValidEmailText)
 .required(emailRequiredText);

export const passwordRule = yup.string().required(passwordRequiredText);

export const newPasswordRule = passwordRule.min(
 PASSWORD_MIN_LENGTH,
 passwordMinLengthText,
);

export const usernameRule = yup
 .string()
 .trim()
 .min(USERNAME_MIN_LENGTH, usernameMinLengthText)
 .max(USERNAME_MAX_LENGTH, usernameMaxLengthText)
 .required(usernameRequiredText);

export const countryRule = yup.string().required(countryRequiredText);
