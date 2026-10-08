import * as yup from "yup";
import { useFormik } from "formik";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import {
 callAPIInterface,
 showApiErrorToast,
} from "@gopvp/common/src/util/api";
import sessionService from "@gopvp/common/src/util/sessionService";
import type { IUpdateProfileBody } from "@gopvp/common/src/types/payload";
import type {
 ILoginResponse,
 IProfileResponse,
} from "@gopvp/common/src/types/response";
import type { ISelectCountryScreenProps } from "@gopvp/common/src/types/component";
import {
 wherePlayingFromText,
 continueText,
} from "@gopvp/app/src/constants/message";
import { ENDPOINTS } from "@gopvp/common/src/constants/endpoint";
import { formSubmitHandler } from "@gopvp/common/src/util/form";
import { countryRule } from "@gopvp/app/src/utils/validation";
import CountrySelect from "@gopvp/app/src/components/common/CountrySelect";

const schema = yup.object({ country: countryRule });

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
      {wherePlayingFromText}
     </Text>
    </Box>
   )}

   <CountrySelect formik={formik} customClass="gold-foil" />

   <Button
    type="submit"
    variant="contained"
    fullWidth
    customClass="auth-submit-btn gold-foil"
    disabled={formik.isSubmitting}
    isLoading={formik.isSubmitting}
   >
    {continueText}
   </Button>
  </Box>
 );
}
