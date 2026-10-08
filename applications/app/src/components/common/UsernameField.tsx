import { useState, useEffect, useRef } from "react";
import Box from "@gopvp/common/src/components/Box/Box";
import Input from "@gopvp/common/src/components/Input/Input";
import CustomIconButton from "@gopvp/common/src/components/IconButton/IconButton";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
import CustomMenu from "@gopvp/common/src/components/Menu/Menu";
import CustomMenuItem from "@gopvp/common/src/components/MenuItem/MenuItem";
import {
 callAPIInterface,
 showApiErrorToast,
} from "@gopvp/common/src/util/api";
import type { IRandomNameResponse } from "@gopvp/common/src/types/response";
import {
 usernameText,
 enterUsernameText,
 clearUsernameText,
} from "@gopvp/app/src/constants/message";
import {
 USERNAME_SUGGESTION_MAX_LENGTH,
 USERNAME_CHECK_DEBOUNCE_MS,
} from "@gopvp/app/src/constants/limit";
import { ENDPOINTS } from "@gopvp/common/src/constants/endpoint";
import type { IUsernameFieldProps } from "@gopvp/app/src/types/component";

export default function UsernameField<TValues extends { username: string }>({
 formik,
 inputRef,
 customClass,
}: IUsernameFieldProps<TValues>) {
 const { value, error, touched, initialValue } =
  formik.getFieldMeta<string>("username");
 const [suggestions, setSuggestions] = useState<string[]>([]);
 const [loadingSuggestions, setLoadingSuggestions] = useState(false);
 const [menuOpen, setMenuOpen] = useState(false);
 const suggestionSelectedRef = useRef(false);
 const fieldRef = useRef<HTMLDivElement>(null);
 const menuPaperRef = useRef<HTMLDivElement | null>(null);

 useEffect(() => {
  if (suggestionSelectedRef.current) {
   suggestionSelectedRef.current = false;
   return;
  }

  const trimmed = value.trim();
  if (
   !trimmed ||
   trimmed === initialValue ||
   trimmed.length > USERNAME_SUGGESTION_MAX_LENGTH
  ) {
   setMenuOpen(false);
   return;
  }

  const timer = setTimeout(async () => {
   setLoadingSuggestions(true);
   setMenuOpen(true);
   try {
    const res = await callAPIInterface<IRandomNameResponse, undefined>(
     "GET",
     `${ENDPOINTS.RANDOM_NAME}?username=${encodeURIComponent(trimmed)}`,
    );
    setSuggestions(res.usernames);
   } catch (err) {
    showApiErrorToast(err);
   } finally {
    setLoadingSuggestions(false);
   }
  }, USERNAME_CHECK_DEBOUNCE_MS);

  return () => clearTimeout(timer);
 }, [value, initialValue]);

 useEffect(() => {
  if (!menuOpen) return;
  const handleClickAway = (event: MouseEvent) => {
   const target = event.target as Node;
   if (fieldRef.current?.contains(target)) return;
   if (menuPaperRef.current?.contains(target)) return;
   setMenuOpen(false);
  };
  document.addEventListener("mousedown", handleClickAway);
  return () => document.removeEventListener("mousedown", handleClickAway);
 }, [menuOpen]);

 const selectUsername = (name: string) => {
  suggestionSelectedRef.current = true;
  formik.setFieldValue("username", name);
  setMenuOpen(false);
 };

 return (
  <>
   <Box ref={fieldRef}>
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
     isError={(touched || !!value) && !!error}
     helperText={(touched || value) && error ? error : undefined}
     endIcon={
      value ? (
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
   </Box>

   <CustomMenu
    customClass={customClass}
    anchorEl={fieldRef.current}
    open={menuOpen && (loadingSuggestions || suggestions.length > 0)}
    onClose={() => setMenuOpen(false)}
    autoFocus={false}
    disableAutoFocus
    disableEnforceFocus
    disableRestoreFocus
    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    transformOrigin={{ vertical: "top", horizontal: "left" }}
    slotProps={{
     paper: {
      ref: menuPaperRef,
      style: { width: fieldRef.current?.offsetWidth },
     },
     backdrop: { style: { pointerEvents: "none" } },
    }}
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
     : suggestions.map((name) => (
        <CustomMenuItem key={name} onClick={() => selectUsername(name)}>
         {name}
        </CustomMenuItem>
       ))}
   </CustomMenu>
  </>
 );
}
