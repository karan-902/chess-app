import { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Pencil, Mail, MapPin } from "@/components/base/images";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Card from "@/components/base/Card/Card";
import Button from "@/components/base/Button/Button";
import Input from "@/components/base/Input/Input";
import CustomSwitch from "@/components/base/Switch/Switch";
import ProfileSkeleton from "@/components/common/ProfileSkeleton";
import { useReduxSelector, useReduxDispatch } from "@/redux/hooks";
import sessionService from "@gopvp/common/src/util/sessionService";
import { useAppTheme } from "@/context/ThemeContext";
import { callAPIInterface, shortenUsername, showApiErrorToast } from "@/utils";
import type {
 ILoginResponse,
 IUpdateProfileBody,
 IUpdateProfileResponse,
} from "@/types/utils";
import type { IEditProfileDrawerProps } from "@/types/components";
import {
 editProfileText,
 ratingsText,
 usernameRequiredText,
 usernameMinLengthText,
 usernameMaxLengthText,
 USERNAME_MAX_LENGTH,
 usernameText,
 saveChangesText,
 appearanceText,
 darkModeText,
} from "@/constants/messages";
import CustomModal from "@/components/base/Modal/Modal";

const profileEditSchema = Yup.object({
 username: Yup.string()
  .trim()
  .min(3, usernameMinLengthText)
  .max(USERNAME_MAX_LENGTH, usernameMaxLengthText)
  .required(usernameRequiredText),
});

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
     IUpdateProfileBody,
     IUpdateProfileResponse
    >("PUT", "/profile", values);
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
  <CustomModal open={open} onClose={handleClose}>
   <Text customClass="sheet-title dialog-title">{editProfileText}</Text>

   <Box
    component="form"
    customClass="edit-profile-form"
    onSubmit={formik.handleSubmit as any}
   >
    <Input
     id="username"
     label={usernameText}
     ref={usernameInputRef}
     fullWidth
     isError={!!(formik.touched.username && formik.errors.username)}
     helperText={formik.errors.username}
     disabled={formik.isSubmitting}
     {...formik.getFieldProps("username")}
    />

    <Button
     type="submit"
     variant="contained"
     fullWidth
     isLoading={formik.isSubmitting}
     disabled={!formik.dirty || formik.isSubmitting}
     customClass="profile-save-btn"
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
     await callAPIInterface<undefined, Partial<ILoginResponse>>(
      "GET",
      "/profile",
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

 if (!session || loading) return <ProfileSkeleton />;

 return (
  <Box customClass="profile-page">
   <Card customClass="profile-id-card">
    <Button
     type="button"
     variant="outlined"
     customClass="profile-edit-icon-btn"
     title={editProfileText}
     aria-label={editProfileText}
     onClick={() => setEditOpen(true)}
    >
     <Pencil size={12} strokeWidth={2} />
    </Button>

    <Box customClass="profile-id-row">
     <Box customClass="profile-info-wrapper">
      <Box customClass="profile-id-text">
       <Text customClass="profile-id-name">
        {shortenUsername(session.username)}
       </Text>
      </Box>
      <Box customClass="profile-meta-row">
       <Mail size={12} strokeWidth={2} />
       <Text customClass="profile-id-handle caption">
        {session.email}
       </Text>
      </Box>
      <Box customClass="profile-meta-row">
       <MapPin size={12} strokeWidth={2} />
       <Text customClass="profile-id-handle caption">
        {session.country}
       </Text>
      </Box>
     </Box>
    </Box>
   </Card>

   <Text component="h3" customClass="subsection-heading section-heading">
    {appearanceText}
   </Text>
   <Card customClass="stat-list">
    <Box customClass="stat-row">
     <Text customClass="stat-title" component="span">
      {darkModeText}
     </Text>
     <CustomSwitch checked={mode === "dark"} onChange={toggleTheme} />
    </Box>
   </Card>

   <Text component="h3" customClass="subsection-heading section-heading">
    {ratingsText}
   </Text>
   <Card customClass="stat-list"></Card>

   <EditProfileDrawer
    open={editOpen}
    onClose={() => setEditOpen(false)}
    session={session}
   />
  </Box>
 );
}
