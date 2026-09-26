import * as yup from "yup";
import { useFormik } from "formik";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import CustomLabel from "@/components/base/Label/Label";
import CustomSelect from "@/components/base/Select/Select";
import Button from "@/components/base/Button/Button";
import { callAPIInterface, showApiErrorToast } from "@/utils";
import sessionService from "@gopvp/common/src/util/sessionService";
import { COUNTRY_OPTIONS } from "@/constants/config";
import type {
    ILoginResponse,
    IUpdateProfileBody,
    IUpdateProfileResponse,
} from "@/types/utils";
import type { ISelectCountryScreenProps } from "@/types/components";
import {
 selectYourCountryText,
 continueText,
 countryRequiredText,
 countryText,
 selectCountryText,
 searchCountryText,
} from "@/constants/messages";

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
                    IUpdateProfileBody,
                    IUpdateProfileResponse
                >("PUT", "/profile", { country: values.country });
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
            onSubmit={formik.handleSubmit as any}
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
