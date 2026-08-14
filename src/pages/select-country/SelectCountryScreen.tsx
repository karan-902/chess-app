import * as yup from "yup";
import { useFormik } from "formik";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Label from "@/components/base/Label/Label";
import Select from "@/components/base/Select/Select";
import Button from "@/components/base/Button/Button";
import { callAPIInterface } from "@/utils";
import { useReduxDispatch } from "@/redux/hooks";
import { updateSession } from "@/redux/persisted/auth.slice";
import { showToast } from "@/redux/common/common.slice";
import { COUNTRY_OPTIONS } from "@/constants/config";
import type { IUpdateProfileBody, IUpdateProfileResponse } from "@/types/utils";
import {
    selectCountryTitle,
    selectCountrySubtitle,
    selectCountryContinueButton,
    selectCountrySetFailed,
    authValidationCountryRequired,
    authRegisterCountryLabel,
    countrySelectSelectPlaceholder,
    countrySelectSearchPlaceholder,
} from "@/constants/messages";

const schema = yup.object({
    country: yup.string().required(authValidationCountryRequired),
});

interface ISelectCountryScreenProps {
    showHeading?: boolean;
    onSelected?: () => void;
}

export default function SelectCountryScreen({
    showHeading = true,
    onSelected,
}: ISelectCountryScreenProps) {
    const dispatch = useReduxDispatch();

    const formik = useFormik({
        initialValues: { country: "" },
        validationSchema: schema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const updated = await callAPIInterface<
                    IUpdateProfileBody,
                    IUpdateProfileResponse
                >("PUT", "/profile", { country: values.country });
                dispatch(updateSession(updated));
                onSelected?.();
            } catch {
                dispatch(
                    showToast({
                        message: selectCountrySetFailed,
                        severity: "error",
                    }),
                );
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
                        {selectCountryTitle}
                    </Text>
                    <Text component="p" customClass="auth-subtitle">
                        {selectCountrySubtitle}
                    </Text>
                </Box>
            )}

            <Box customClass="auth-field">
                <Label htmlFor="country">{authRegisterCountryLabel}</Label>
                <Select
                    value={formik.values.country}
                    onChange={(v) => {
                        formik.setFieldValue("country", v);
                        formik.setFieldTouched("country", true, false);
                    }}
                    options={COUNTRY_OPTIONS}
                    searchable
                    placeholder={countrySelectSelectPlaceholder}
                    searchPlaceholder={countrySelectSearchPlaceholder}
                    isError={formik.touched.country && !!formik.errors.country}
                />
                {formik.touched.country && formik.errors.country && (
                    <Text component="span" customClass="input-helper-text">
                        {formik.errors.country}
                    </Text>
                )}
            </Box>

            <Button
                type="submit"
                variant="contained"
                fullWidth
                customClass="auth-submit-btn"
                disabled={formik.isSubmitting}
                isLoading={formik.isSubmitting}
            >
                {selectCountryContinueButton}
            </Button>
        </Box>
    );
}
