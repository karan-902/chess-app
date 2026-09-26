import * as yup from "yup";
import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import Box from "@/components/base/Box/Box";
import CustomLabel from "@/components/base/Label/Label";
import Text from "@/components/base/Text/Text";
import Input from "@/components/base/Input/Input";
import Button from "@/components/base/Button/Button";
import CustomChip from "@/components/base/Chip/Chip";
import CustomSelect from "@/components/base/Select/Select";
import CustomIconButton from "@/components/base/IconButton/IconButton";
import Skeleton from "@/components/base/Skeleton/Skeleton";
import CustomMenu from "@/components/base/Menu/Menu";
import CustomMenuItem from "@/components/base/MenuItem/MenuItem";
import { callAPIInterface, showApiErrorToast } from "@/utils";
import { useReduxDispatch } from "@/redux/hooks";
import { login } from "@/redux/auth/thunk";
import { showLoader, hideLoader, showToast } from "@/redux/common/slice";
import { COUNTRY_OPTIONS } from "@/constants/config";
import type { IRegisterEmailBody } from "@/types/index";
import type { IRegisterResponse, IRandomNameResponse } from "@/types/utils";
import {
 authEmailLabel,
 authEmailPlaceholder,
 authPasswordLabel,
 authPasswordPlaceholder,
 authValidationEmailRequired,
 authValidationEmailInvalid,
 authValidationPasswordRequired,
 authValidationPasswordMinLength,
 authValidationUsernameRequired,
 authValidationUsernameMinLength,
 authValidationUsernameMaxLength,
 authValidationCountryRequired,
 authRegisterUsernameLabel,
 authRegisterUsernamePlaceholder,
 authRegisterUsernameClearAriaLabel,
 authRegisterQuickNamesLabel,
 authRegisterCountryLabel,
 authRegisterCreateAccountButton,
 authRegisterRegistrationFailed,
 countrySelectSelectPlaceholder,
 authRegisterSuccess,
 usernameSuggestionsFailed,
 USERNAME_MAX_LENGTH,
} from "@/constants/messages";
import { IEmailFormScreenProps, IEmailFormValues } from "@/types/components";

const USERNAME_CHECK_DEBOUNCE_MS = 700;

const registerSchema = yup.object({
 username: yup
  .string()
  .trim()
  .min(3, authValidationUsernameMinLength)
  .max(USERNAME_MAX_LENGTH, authValidationUsernameMaxLength)
  .required(authValidationUsernameRequired),
 email: yup
  .string()
  .email(authValidationEmailInvalid)
  .required(authValidationEmailRequired),
 password: yup
  .string()
  .required(authValidationPasswordRequired)
  .min(8, authValidationPasswordMinLength),
 country: yup.string().required(authValidationCountryRequired),
});

function EmailFormScreen({ onRegistered }: IEmailFormScreenProps) {
 const dispatch = useReduxDispatch();
 const formik = useFormik<IEmailFormValues>({
  initialValues: {
   username: "",
   email: "",
   password: "",
   country: "",
  },
  validationSchema: registerSchema,
  onSubmit: async (values, { setSubmitting }) => {
   try {
    await callAPIInterface<IRegisterEmailBody, IRegisterResponse>(
     "POST",
     "/auth/register",
     {
      username: values.username,
      email: values.email,
      password: values.password,
      country: values.country,
     },
    );
    dispatch(
     showToast({
      isToastOpen: true,
      toastMessage: authRegisterSuccess,
      toastVariant: "success",
     }),
    );
    onRegistered(values.email, values.password);
   } catch (err) {
    showApiErrorToast(err, authRegisterRegistrationFailed);
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
 const [quickNameSuggestions, setQuickNameSuggestions] = useState<string[]>(
  [],
 );
 const [loadingQuickNames, setLoadingQuickNames] = useState(false);

 useEffect(() => {
  const loadQuickNames = async () => {
   setLoadingQuickNames(true);
   try {
    const res = await callAPIInterface<undefined, IRandomNameResponse>(
     "GET",
     "/auth/random-name",
    );
    setQuickNameSuggestions(res.usernames);
   } catch (err) {
    showApiErrorToast(err, usernameSuggestionsFailed);
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
    const res = await callAPIInterface<undefined, IRandomNameResponse>(
     "GET",
     `/auth/random-name?username=${encodeURIComponent(trimmed)}`,
    );
    setUsernameSuggestions(res.usernames);
   } catch (err) {
    showApiErrorToast(err, usernameSuggestionsFailed);
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
     label={authRegisterUsernameLabel}
     placeholder={authRegisterUsernamePlaceholder}
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
        aria-label={authRegisterUsernameClearAriaLabel}
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
      {authRegisterQuickNamesLabel}
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
     suggestionsMenuOpen && (loadingSuggestions || usernameSuggestions.length > 0)
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
    label={authEmailLabel}
    placeholder={authEmailPlaceholder}
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
    label={authPasswordLabel}
    placeholder={authPasswordPlaceholder}
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
    <CustomLabel htmlFor="country">{authRegisterCountryLabel}</CustomLabel>
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
     placeholder={countrySelectSelectPlaceholder}
     searchPlaceholder={countrySelectSelectPlaceholder}
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
    {authRegisterCreateAccountButton}
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
