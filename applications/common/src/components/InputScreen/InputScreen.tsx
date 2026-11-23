import Box from "@gopvp/common/src/components/Box/Box";
import Input from "@gopvp/common/src/components/Input/Input";
import Button from "@gopvp/common/src/components/Button/Button";
import { formSubmitHandler } from "@gopvp/common/src/util/form";
import type { IInputScreenProps } from "@gopvp/common/src/types/component";

export default function InputScreen<
 TValues extends { [K in keyof TValues]: string },
>({
 formik,
 name,
 type = "text",
 label,
 placeholder,
 submitText,
 customClass,
 top,
 children,
}: IInputScreenProps<TValues>) {
 return (
  <Box
   customClass={customClass}
   component="form"
   onSubmit={formSubmitHandler(formik.handleSubmit)}
  >
   {top}
   <Input
    id={name}
    name={name}
    type={type}
    label={label}
    placeholder={placeholder}
    value={formik.values[name]}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    disabled={formik.isSubmitting}
    isError={formik.touched[name] && !!formik.errors[name]}
    helperText={formik.errors[name] as string | undefined}
    customClass="form-input"
    fullWidth
   />
   <Button
    type="submit"
    variant="contained"
    fullWidth
    customClass="auth-submit-btn"
    disabled={!formik.dirty || formik.isSubmitting}
    isLoading={formik.isSubmitting}
   >
    {submitText}
   </Button>
   {children}
  </Box>
 );
}
