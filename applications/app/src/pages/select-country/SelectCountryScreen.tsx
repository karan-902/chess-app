import * as yup from "yup";
import { useFormik } from "formik";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import CustomLabel from "@gopvp/common/src/components/Label/Label";
import CustomSelect from "@gopvp/common/src/components/Select/Select";
import Button from "@gopvp/common/src/components/Button/Button";
import {
 callAPIInterface,
 showApiErrorToast,
} from "@gopvp/common/src/util/api";
import sessionService from "@gopvp/common/src/util/sessionService";
import { COUNTRY_OPTIONS } from "@gopvp/app/src/constants/option";
import type { IUpdateProfileBody } from "@gopvp/common/src/types/payload";
import type {
 ILoginResponse,
 IProfileResponse,
} from "@gopvp/common/src/types/response";
import type { ISelectCountryScreenProps } from "@gopvp/common/src/types/component";
import {
 selectYourCountryText,
 continueText,
 countryRequiredText,
 countryText,
 selectCountryText,
 searchCountryText,
} from "@gopvp/app/src/constants/message";
import { ENDPOINTS } from "@gopvp/common/src/constants/endpoint";
import { formSubmitHandler } from "@gopvp/common/src/util/form";

const schema = yup.object({
 country: yup.string().required(countryRequiredText),
});

export default function SelectCountryScreen({
 showHeading = true,
 onSelected,
}: ISelectCountryScreenProps) {
 const formik = useFormik({
  initialValues: { country: "" },
  validationSchema: schema,
  onSubmit: async (values, { setSubmitting }) => {
   try {
    const updated = await callAPIInterface<
     IProfileResponse,
     IUpdateProfileBody
    >("PATCH", ENDPOINTS.PROFILE, { country: values.country });
    await sessionService.updateSession<ILoginResponse>(updated);
    onSelected?.();
   } catch (err) {
    showApiErrorToast(err);
   } finally {
    setSubmitting(false);
   }
  },
 });

 return (
  <Box
   customClass="auth-form"
   component="form"
   onSubmit={formSubmitHandler(formik.handleSubmit)}
  >
   {showHeading && (
    <Box customClass="auth-heading">
     <Text component="h1" customClass="auth-title">
      {selectYourCountryText}
     </Text>
    </Box>
   )}

   <Box customClass="form-field">
    <CustomLabel htmlFor="country">{countryText}</CustomLabel>
    <CustomSelect
     value={formik.values.country}
     onChange={(v) => {
      formik.setFieldValue("country", v);
      formik.setFieldTouched("country", true, false);
     }}
     onBlur={() => formik.setFieldTouched("country", true)}
     options={COUNTRY_OPTIONS}
     searchable
     disabled={formik.isSubmitting}
     placeholder={selectCountryText}
     searchPlaceholder={searchCountryText}
     isError={formik.touched.country && !!formik.errors.country}
     helperText={formik.errors.country}
    />
   </Box>

   <Button
    type="submit"
    variant="contained"
    fullWidth
    customClass="auth-submit-btn"
    disabled={formik.isSubmitting}
    isLoading={formik.isSubmitting}
   >
    {continueText}
   </Button>
  </Box>
 );
}
