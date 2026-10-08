import { useEffect, useState } from "react";
import Box from "@gopvp/common/src/components/Box/Box";
import CustomLabel from "@gopvp/common/src/components/Label/Label";
import CustomSelect, {
 type ISelectOption,
} from "@gopvp/common/src/components/Select/Select";
import {
 callAPIInterface,
 showApiErrorToast,
} from "@gopvp/common/src/util/api";
import { ENDPOINTS } from "@gopvp/common/src/constants/endpoint";
import type { ICountriesResponse } from "@gopvp/common/src/types/response";
import {
 countryText,
 selectCountryText,
} from "@gopvp/app/src/constants/message";
import type { ICountrySelectProps } from "@gopvp/app/src/types/component";

export default function CountrySelect<TValues extends { country: string }>({
 formik,
 customClass,
}: ICountrySelectProps<TValues>) {
 const { value, error, touched } = formik.getFieldMeta<string>("country");
 const [countries, setCountries] = useState<ISelectOption[]>([]);
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
  let isCancelled = false;
  const loadCountries = async () => {
   try {
    const res = await callAPIInterface<ICountriesResponse, undefined>(
     "GET",
     ENDPOINTS.COUNTRIES,
    );
    if (!isCancelled)
     setCountries(
      res.countries.map(({ code, name }) => ({ value: code, label: name })),
     );
   } catch (err) {
    showApiErrorToast(err);
   } finally {
    if (!isCancelled) setIsLoading(false);
   }
  };
  loadCountries();
  return () => {
   isCancelled = true;
  };
 }, []);

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
    options={countries}
    disabled={formik.isSubmitting}
    loading={isLoading}
    placeholder={selectCountryText}
    isError={touched && !!error}
    helperText={error}
    customClass={customClass}
   />
  </Box>
 );
}
