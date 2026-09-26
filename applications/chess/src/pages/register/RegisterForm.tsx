import * as yup from "yup";
import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import Box from "@gopvp/common/src/components/Box/Box";
import CustomLabel from "@gopvp/common/src/components/Label/Label";
import Text from "@gopvp/common/src/components/Text/Text";
import Input from "@gopvp/common/src/components/Input/Input";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomChip from "@gopvp/common/src/components/Chip/Chip";
import CustomSelect from "@gopvp/common/src/components/Select/Select";
import CustomIconButton from "@gopvp/common/src/components/IconButton/IconButton";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
import CustomMenu from "@gopvp/common/src/components/Menu/Menu";
import CustomMenuItem from "@gopvp/common/src/components/MenuItem/MenuItem";
import { callAPIInterface, showApiErrorToast } from "@/utils";
import { useReduxDispatch } from "@/redux/hooks";
import { login } from "@/redux/auth/thunk";
import { showLoader, hideLoader } from "@/redux/common/slice";
import { COUNTRY_OPTIONS } from "@/constants/config";
import type { IRegisterBody } from "@gopvp/common/src/types/payload";
import type { IRegisterResponse, IRandomNameResponse } from "@gopvp/common/src/types/response";
import {
 emailText,
 enterEmailText,
 passwordText,
 enterPasswordText,
 emailRequiredText,
 enterValidEmailText,
 passwordRequiredText,
 passwordMinLengthText,
 usernameRequiredText,
 usernameMinLengthText,
 usernameMaxLengthText,
 countryRequiredText,
 usernameText,
 enterUsernameText,
 clearUsernameText,
 suggestionsText,
 countryText,
 registerText,
 selectCountryText,
 USERNAME_MAX_LENGTH,
} from "@/constants/messages";
import type { IEmailFormScreenProps } from "@gopvp/common/src/types/component";

const USERNAME_CHECK_DEBOUNCE_MS = 700;

const registerSchema = yup.object({
 username: yup
  .string()
  .trim()
  .min(3, usernameMinLengthText)
  .max(USERNAME_MAX_LENGTH, usernameMaxLengthText)
  .required(usernameRequiredText),
 email: yup.string().email(enterValidEmailText).required(emailRequiredText),
 password: yup
  .string()
  .required(passwordRequiredText)
  .min(8, passwordMinLengthText),
 country: yup.string().required(countryRequiredText),
});

function EmailFormScreen({ onRegistered }: IEmailFormScreenProps) {
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
     "/auth/register",
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

 const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
 const [loadingSuggestions, setLoadingSuggestions] = useState(false);
 const suggestionsDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(
  null,
 );
 const suggestionSelectedRef = useRef(false);
 const usernameFieldRef = useRef<HTMLDivElement>(null);
 const suggestionsMenuPaperRef = useRef<HTMLDivElement | null>(null);
 const [suggestionsMenuOpen, setSuggestionsMenuOpen] = useState(false);
 const [quickNameSuggestions, setQuickNameSuggestions] = useState<string[]>([]);
 const [loadingQuickNames, setLoadingQuickNames] = useState(false);

 useEffect(() => {
  const loadQuickNames = async () => {
   setLoadingQuickNames(true);
   try {
    const res = await callAPIInterface<IRandomNameResponse, undefined>(
     "GET",
     "/auth/random-name",
    );
    setQuickNameSuggestions(res.usernames);
   } catch (err) {
    showApiErrorToast(err);
   } finally {
    setLoadingQuickNames(false);
   }
  };
  loadQuickNames();
 }, []);

 useEffect(() => {
  if (suggestionsDebounceRef.current)
   clearTimeout(suggestionsDebounceRef.current);

  if (suggestionSelectedRef.current) {
   suggestionSelectedRef.current = false;
   return;
  }

  const trimmed = formik.values.username.trim();
  if (!trimmed || trimmed.length > USERNAME_MAX_LENGTH) {
   setSuggestionsMenuOpen(false);
   return;
  }

  suggestionsDebounceRef.current = setTimeout(async () => {
   setLoadingSuggestions(true);
   setSuggestionsMenuOpen(true);
   try {
    const res = await callAPIInterface<IRandomNameResponse, undefined>(
     "GET",
     `/auth/random-name?username=${encodeURIComponent(trimmed)}`,
    );
    setUsernameSuggestions(res.usernames);
   } catch (err) {
    showApiErrorToast(err);
   } finally {
    setLoadingSuggestions(false);
   }
  }, USERNAME_CHECK_DEBOUNCE_MS);

  return () => {
   if (suggestionsDebounceRef.current)
    clearTimeout(suggestionsDebounceRef.current);
  };
 }, [formik.values.username]);

 useEffect(() => {
  if (!suggestionsMenuOpen) return;

  const handleClickAway = (event: MouseEvent) => {
   const target = event.target as Node;
   if (usernameFieldRef.current?.contains(target)) return;
   if (suggestionsMenuPaperRef.current?.contains(target)) return;
   setSuggestionsMenuOpen(false);
  };

  document.addEventListener("mousedown", handleClickAway);
  return () => document.removeEventListener("mousedown", handleClickAway);
 }, [suggestionsMenuOpen]);

 const suggestionsMenuSlotProps = useMemo(
  () => ({
   paper: {
    ref: suggestionsMenuPaperRef,
    style: { width: usernameFieldRef.current?.offsetWidth },
   },
   backdrop: { style: { pointerEvents: "none" as const } },
  }),
  [suggestionsMenuOpen],
 );

 return (
  <Box
   customClass="gopvp-signup-form"
   component="form"
   onSubmit={formik.handleSubmit as any}
  >
   <Box ref={usernameFieldRef}>
    <Input
     id="username"
     name="username"
     label={usernameText}
     placeholder={enterUsernameText}
     value={formik.values.username}
     onChange={formik.handleChange}
     onBlur={formik.handleBlur}
     disabled={formik.isSubmitting}
     isError={
      (formik.touched.username || !!formik.values.username) &&
      !!formik.errors.username
     }
     helperText={
      (formik.touched.username || formik.values.username) &&
      formik.errors.username
       ? formik.errors.username
       : undefined
     }
     endIcon={
      formik.values.username ? (
       <CustomIconButton
        type="button"
        className="input-password-toggle"
        customClass="username-clear-btn"
        aria-label={clearUsernameText}
        onClick={() => formik.setFieldValue("username", "")}
        tabIndex={-1}
        icon="close"
       />
      ) : undefined
     }
     customClass="form-input"
     fullWidth
    />
   </Box>

   {(loadingQuickNames || quickNameSuggestions.length > 0) && (
    <Box customClass="random-name-chips-block">
     <Text customClass="random-name-chips-label caption">
      {suggestionsText}
     </Text>
     <Box customClass="random-name-chips">
      {loadingQuickNames
       ? Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
           key={i}
           variant="rounded"
           customClass="random-name-chip-skeleton"
          />
         ))
       : quickNameSuggestions.map((name) => (
          <CustomChip
           key={name}
           label={name}
           clickable
           size="small"
           customClass="random-name-chip"
           onClick={() => {
            suggestionSelectedRef.current = true;
            formik.setFieldValue("username", name);
           }}
          />
         ))}
     </Box>
    </Box>
   )}

   <CustomMenu
    anchorEl={usernameFieldRef.current}
    open={
     suggestionsMenuOpen &&
     (loadingSuggestions || usernameSuggestions.length > 0)
    }
    onClose={() => setSuggestionsMenuOpen(false)}
    autoFocus={false}
    disableAutoFocus
    disableEnforceFocus
    disableRestoreFocus
    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    transformOrigin={{ vertical: "top", horizontal: "left" }}
    slotProps={suggestionsMenuSlotProps}
   >
    {loadingSuggestions
     ? Array.from({ length: 4 }).map((_, i) => (
        <CustomMenuItem key={i} disabled>
         <Skeleton
          variant="rounded"
          customClass="username-suggestion-skeleton"
         />
        </CustomMenuItem>
       ))
     : usernameSuggestions.map((name) => (
        <CustomMenuItem
         key={name}
         onClick={() => {
          suggestionSelectedRef.current = true;
          formik.setFieldValue("username", name);
          setSuggestionsMenuOpen(false);
         }}
        >
         {name}
        </CustomMenuItem>
       ))}
   </CustomMenu>

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
    customClass="form-input"
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
    customClass="form-input"
    fullWidth
   />

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
     searchPlaceholder={selectCountryText}
     isError={formik.touched.country && !!formik.errors.country}
     helperText={formik.errors.country}
    />
   </Box>

   <Button
    type="submit"
    variant="contained"
    fullWidth
    endIcon="arrowForward"
    customClass="auth-submit-btn auth-submit-btn-arrow"
    disabled={!formik.dirty || !formik.isValid || formik.isSubmitting}
    isLoading={formik.isSubmitting}
   >
    {registerText}
   </Button>
  </Box>
 );
}

export default function RegisterForm() {
 const dispatch = useReduxDispatch();
 const navigate = useNavigate();

 const handleRegistered = async (email: string, password: string) => {
  dispatch(showLoader({ text: "Setting up your account..." }));
  try {
   await dispatch(login({ email, password })).unwrap();
  } catch {
   navigate("/login", { replace: true });
  } finally {
   dispatch(hideLoader());
  }
 };

 return <EmailFormScreen onRegistered={handleRegistered} />;
}
