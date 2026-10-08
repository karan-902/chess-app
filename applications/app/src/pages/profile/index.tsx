import { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
// import classNames from "classnames";
// import { CheckCircleIcon } from "@gopvp/common/src/components/images";
import { EditIcon } from "@gopvp/common/src/components/images";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Card from "@gopvp/common/src/components/Card/Card";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomSwitch from "@gopvp/common/src/components/Switch/Switch";
// import CustomChip from "@gopvp/common/src/components/Chip/Chip";
import CustomAvatar from "@gopvp/common/src/components/Avatar/Avatar";
import ProfileSkeleton from "@gopvp/app/src/components/common/ProfileSkeleton";
import UsernameField from "@gopvp/app/src/components/common/UsernameField";
import { useReduxSelector, useReduxDispatch } from "@gopvp/app/src/redux/hooks";
import sessionService from "@gopvp/common/src/util/sessionService";
import { useAppTheme } from "@gopvp/app/src/context/ThemeContext";
import {
 callAPIInterface,
 showApiErrorToast,
} from "@gopvp/common/src/util/api";
import { shortenUsername } from "@gopvp/common/src/util/format";
import type { IUpdateProfileBody } from "@gopvp/common/src/types/payload";
import type {
 ILoginResponse,
 IProfileResponse,
} from "@gopvp/common/src/types/response";
import type { IEditProfileDrawerProps } from "@gopvp/common/src/types/component";
import {
 editProfileText,
 // ratingsText,
 saveChangesText,
 appearanceText,
 darkModeText,
 accountText,
 emailText,
 countryText,
 // statusText,
 // verifiedText,
 // notVerifiedText,
} from "@gopvp/app/src/constants/message";
import CustomModal from "@gopvp/common/src/components/Modal/Modal";
import { ENDPOINTS } from "@gopvp/common/src/constants/endpoint";
import { formSubmitHandler } from "@gopvp/common/src/util/form";
import { usernameRule } from "@gopvp/app/src/utils/validation";
import { flagCdnUrl } from "@gopvp/common/src/constants/env";

const profileEditSchema = Yup.object({ username: usernameRule });

function EditProfileDrawer({
 open,
 onClose,
 session,
}: IEditProfileDrawerProps) {
 const usernameInputRef = useRef<HTMLInputElement>(null);

 useEffect(() => {
  if (!open) return;
  usernameInputRef.current?.focus();
 }, [open]);

 const formik = useFormik({
  initialValues: {
   username: session.username,
  },
  enableReinitialize: true,
  validationSchema: profileEditSchema,
  onSubmit: async (values, { setSubmitting }) => {
   try {
    const updated = await callAPIInterface<
     IProfileResponse,
     IUpdateProfileBody
    >("PATCH", ENDPOINTS.PROFILE, values);
    await sessionService.updateSession<ILoginResponse>(updated);
    onClose();
   } catch (err) {
    showApiErrorToast(err);
   } finally {
    setSubmitting(false);
   }
  },
 });

 const handleClose = () => {
  formik.resetForm();
  onClose();
 };

 return (
  <CustomModal open={open} onClose={handleClose} customClass="gold-foil">
   <Text customClass="sheet-title dialog-title gold-foil">
    {editProfileText}
   </Text>

   <Box
    component="form"
    customClass="edit-profile-form"
    onSubmit={formSubmitHandler(formik.handleSubmit)}
   >
    <UsernameField
     formik={formik}
     inputRef={usernameInputRef}
     customClass="form-input gold-foil"
    />

    <Button
     type="submit"
     variant="contained"
     fullWidth
     isLoading={formik.isSubmitting}
     disabled={!formik.dirty || formik.isSubmitting}
     customClass="profile-save-btn gold-foil shine"
    >
     {saveChangesText}
    </Button>
   </Box>
  </CustomModal>
 );
}

export default function Profile() {
 const session = useReduxSelector((state) => state.auth.session);
 const dispatch = useReduxDispatch();
 const { mode, toggleTheme } = useAppTheme();
 const [editOpen, setEditOpen] = useState(false);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  const loadProfile = async () => {
   try {
    await sessionService.updateSession<ILoginResponse>(
     await callAPIInterface<IProfileResponse, undefined>(
      "GET",
      ENDPOINTS.PROFILE,
     ),
    );
   } catch (err) {
    showApiErrorToast(err);
   } finally {
    setLoading(false);
   }
  };
  loadProfile();
 }, [dispatch]);

 const accountRows = session
  ? [
     { label: emailText, value: session.email },
     {
      label: countryText,
      value:
       new Intl.DisplayNames(["en"], { type: "region" }).of(session.country) ??
       session.country,
     },
     // {
     //  label: statusText,
     //  value: (
     //   <CustomChip
     //    size="small"
     //    icon={session.is_verified ? <CheckCircleIcon /> : undefined}
     //    label={session.is_verified ? verifiedText : notVerifiedText}
     //    customClass={classNames(
     //     "verified-chip",
     //     !session.is_verified && "pending",
     //    )}
     //   />
     //  ),
     // },
    ].filter((row) => row.value)
  : [];

 return (
  <Box customClass="profile-page gold-foil">
   {session && !loading ? (
    <>
     <Card customClass="profile-id-card">
      <Button
       type="button"
       variant="outlined"
       customClass="profile-edit-icon-btn"
       title={editProfileText}
       aria-label={editProfileText}
       onClick={() => setEditOpen(true)}
      >
       <EditIcon fontSize="small" />
      </Button>

      <Box customClass="profile-hero">
       <CustomAvatar
        letter={session.username.charAt(0).toUpperCase()}
        customClass="lg primary"
       />
       <Box customClass="profile-name-row">
        <Text customClass="profile-id-name">
         {shortenUsername(session.username)}
        </Text>
        {session.country && (
         <img
          src={`${flagCdnUrl}/${session.country.toLowerCase()}.svg`}
          alt=""
         />
        )}
       </Box>
      </Box>
     </Card>

     <Text component="h3" customClass="subsection-heading section-heading">
      {accountText}
     </Text>
     <Card customClass="stat-list">
      {accountRows.map(({ label, value }) => (
       <Box key={label} customClass="stat-row">
        <Text customClass="stat-title" component="span">
         {label}
        </Text>
        <Text component="span" customClass="stat-val">
         {value}
        </Text>
       </Box>
      ))}
     </Card>

     <EditProfileDrawer
      open={editOpen}
      onClose={() => setEditOpen(false)}
      session={session}
     />
    </>
   ) : (
    <ProfileSkeleton />
   )}

   <Text component="h3" customClass="subsection-heading section-heading">
    {appearanceText}
   </Text>
   <Card customClass="stat-list">
    <Box customClass="stat-row">
     <Text customClass="stat-title" component="span">
      {darkModeText}
     </Text>
     <CustomSwitch
      checked={mode === "dark"}
      onChange={toggleTheme}
      customClass="gold-foil"
     />
    </Box>
   </Card>

   {/* <Text component="h3" customClass="subsection-heading section-heading">
    {ratingsText}
   </Text>
   <Card customClass="stat-list"></Card> */}
  </Box>
 );
}
