import { useState, useEffect, useRef, useCallback } from "react";
import Box from "@gopvp/common/src/components/Box/Box";
import Input from "@gopvp/common/src/components/Input/Input";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomIconButton from "@gopvp/common/src/components/IconButton/IconButton";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
import {
 callAPIInterface,
 showApiErrorToast,
} from "@gopvp/common/src/util/api";
import type { IRandomNameResponse } from "@gopvp/common/src/types/response";
import {
 usernameText,
 enterUsernameText,
 clearUsernameText,
 usernameHintText,
 suggestionText,
 newSuggestionText,
} from "@gopvp/app/src/constants/message";
import {
 USERNAME_MIN_LENGTH,
 USERNAME_MAX_LENGTH,
 USERNAME_SUGGESTION_MAX_LENGTH,
 USERNAME_CHECK_DEBOUNCE_MS,
} from "@gopvp/app/src/constants/limit";
import { ENDPOINTS } from "@gopvp/common/src/constants/endpoint";
import type { IUsernameFieldProps } from "@gopvp/app/src/types/component";

export default function UsernameField<TValues extends { username: string }>({
 formik,
 inputRef,
 customClass,
 showHint = false,
 hideClear = false,
}: IUsernameFieldProps<TValues>) {
 const { value, error, touched, initialValue } =
  formik.getFieldMeta<string>("username");
 const [suggestions, setSuggestions] = useState<string[]>([]);
 const [suggestionIndex, setSuggestionIndex] = useState(0);
 const [loadingSuggestions, setLoadingSuggestions] = useState(false);
 const [showSuggestion, setShowSuggestion] = useState(false);
 const suggestionSelectedRef = useRef(false);
 const hasError = (touched || !!value) && !!error;
 const trimmed = value.trim();

 const fetchSuggestions = useCallback(async (username: string) => {
  setLoadingSuggestions(true);
  setShowSuggestion(true);
  try {
   const res = await callAPIInterface<IRandomNameResponse, undefined>(
    "GET",
    username
     ? `${ENDPOINTS.RANDOM_NAME}?username=${encodeURIComponent(username)}`
     : ENDPOINTS.RANDOM_NAME,
   );
   setSuggestions(res.usernames);
   setSuggestionIndex(0);
  } catch (err) {
   setShowSuggestion(false);
   showApiErrorToast(err);
  } finally {
   setLoadingSuggestions(false);
  }
 }, []);

 useEffect(() => {
  if (suggestionSelectedRef.current) {
   suggestionSelectedRef.current = false;
   return;
  }
  if (
   (trimmed && trimmed === initialValue) ||
   trimmed.length > USERNAME_SUGGESTION_MAX_LENGTH
  ) {
   setShowSuggestion(false);
   return;
  }
  const timer = setTimeout(
   () => fetchSuggestions(trimmed),
   USERNAME_CHECK_DEBOUNCE_MS,
  );
  return () => clearTimeout(timer);
 }, [trimmed, initialValue, fetchSuggestions]);

 const selectUsername = (name: string) => {
  suggestionSelectedRef.current = true;
  formik.setFieldValue("username", name);
  setShowSuggestion(false);
 };

 const showNextSuggestion = () =>
  suggestionIndex + 1 < suggestions.length
   ? setSuggestionIndex(suggestionIndex + 1)
   : fetchSuggestions(trimmed);

 return (
  <Box customClass="username-field">
   <Input
    id="username"
    name="username"
    ref={inputRef}
    label={usernameText}
    placeholder={enterUsernameText}
    value={value}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    disabled={formik.isSubmitting}
    isError={hasError}
    helperText={hasError ? error : undefined}
    endIcon={
     value && !hideClear ? (
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
    customClass={customClass}
    fullWidth
   />
   <Box customClass="username-message-slot">
    {showHint && !hasError && (
     <Text customClass="field-hint">
      {usernameHintText(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH)}
     </Text>
    )}
   </Box>
   <Text component="div" customClass="username-suggestion">
    {showSuggestion && (loadingSuggestions || suggestions.length > 0) && (
     <>
      {suggestionText}
      {loadingSuggestions ? (
       <Skeleton variant="rounded" customClass="username-suggestion-skeleton" />
      ) : (
       <Button
        type="button"
        variant="text"
        customClass="username-suggestion-btn"
        onClick={() => selectUsername(suggestions[suggestionIndex])}
       >
        {suggestions[suggestionIndex]}
       </Button>
      )}
      <CustomIconButton
       type="button"
       customClass="username-refresh-btn"
       aria-label={newSuggestionText}
       onClick={showNextSuggestion}
       disabled={loadingSuggestions}
       icon="rotateCw"
      />
     </>
    )}
   </Text>
  </Box>
 );
}
