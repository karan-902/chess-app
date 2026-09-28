import Box from "@gopvp/common/src/components/Box/Box";
import CustomLabel from "@gopvp/common/src/components/Label/Label";
import CustomSelect from "@gopvp/common/src/components/Select/Select";
import { COUNTRY_OPTIONS } from "@gopvp/app/src/constants/option";
import {
 countryText,
 searchCountryText,
 selectCountryText,
} from "@gopvp/app/src/constants/message";
import type { ICountrySelectProps } from "@gopvp/app/src/types/component";

export default function CountrySelect<TValues extends { country: string }>({
 formik,
}: ICountrySelectProps<TValues>) {
 const { value, error, touched } = formik.getFieldMeta<string>("country");

 return (
  <Box customClass="form-field">
   <CustomLabel htmlFor="country">{countryText}</CustomLabel>
   <CustomSelect
    value={value}
    onChange={(country) => {
     formik.setFieldValue("country", country);
     formik.setFieldTouched("country", true, false);
    }}
    onBlur={() => formik.setFieldTouched("country", true)}
    options={COUNTRY_OPTIONS}
    searchable
    disabled={formik.isSubmitting}
    placeholder={selectCountryText}
    searchPlaceholder={searchCountryText}
    isError={touched && !!error}
    helperText={error}
   />
  </Box>
 );
}
