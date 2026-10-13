import { useEffect, useRef, useState } from "react";
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
}: ICountrySelectProps<TValues>) {
 const { value, error, touched } = formik.getFieldMeta<string>("country");
 const [countries, setCountries] = useState<ISelectOption[]>([]);
 const [isLoading, setIsLoading] = useState(false);
 const isUnmountedRef = useRef(false);

 useEffect(() => {
  isUnmountedRef.current = false;
  return () => {
   isUnmountedRef.current = true;
  };
 }, []);

 const loadCountries = async () => {
  if (isLoading || countries.length > 0) return;
  setIsLoading(true);
  try {
   const res = await callAPIInterface<ICountriesResponse, undefined>(
    "GET",
    ENDPOINTS.COUNTRIES,
   );
   if (!isUnmountedRef.current)
    setCountries(
     res.countries.map(({ code, name }) => ({ value: code, label: name })),
    );
  } catch (err) {
   showApiErrorToast(err);
  } finally {
   if (!isUnmountedRef.current) setIsLoading(false);
  }
 };

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
    onOpen={loadCountries}
    loading={isLoading}
    options={countries}
    disabled={formik.isSubmitting}
    placeholder={selectCountryText}
    isError={touched && !!error}
    helperText={error}
   />
  </Box>
 );
}
