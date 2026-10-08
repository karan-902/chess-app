import * as yup from "yup";
import { useFormik } from "formik";
import Box from "@gopvp/common/src/components/Box/Box";
import Input from "@gopvp/common/src/components/Input/Input";
import Button from "@gopvp/common/src/components/Button/Button";
import {
 callAPIInterface,
 showApiErrorToast,
} from "@gopvp/common/src/util/api";
import type { IRegisterBody } from "@gopvp/common/src/types/payload";
import type { IRegisterResponse } from "@gopvp/common/src/types/response";
import {
 emailText,
 enterEmailText,
 passwordText,
 enterPasswordText,
 registerText,
} from "@gopvp/app/src/constants/message";
import type { IEmailFormScreenProps } from "@gopvp/common/src/types/component";
import { ENDPOINTS } from "@gopvp/common/src/constants/endpoint";
import { formSubmitHandler } from "@gopvp/common/src/util/form";
import {
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
  onSubmit: async (values, { setSubmitting }) => {
   try {
    await callAPIInterface<IRegisterResponse, IRegisterBody>(
     "POST",
     ENDPOINTS.REGISTER,
     {
      username: values.username,
      email: values.email,
      password: values.password,
      country: values.country,
     },
    );
    onRegistered(values.email, values.password);
   } catch (err) {
    showApiErrorToast(err);
   } finally {
    setSubmitting(false);
   }
  },
 });

 return (
  <Box
   customClass="gopvp-signup-form"
   component="form"
   onSubmit={formSubmitHandler(formik.handleSubmit)}
  >
   <UsernameField formik={formik} customClass="form-input gold-foil" />

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
    customClass="form-input gold-foil"
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
    customClass="form-input gold-foil"
    fullWidth
   />

   <CountrySelect formik={formik} customClass="gold-foil" />

   <Button
    type="submit"
    variant="contained"
    fullWidth
    endIcon="arrowForward"
    customClass="auth-submit-btn auth-submit-btn-arrow gold-foil shine"
    disabled={!formik.dirty || !formik.isValid || formik.isSubmitting}
    isLoading={formik.isSubmitting}
   >
    {registerText}
   </Button>
  </Box>
 );
}
