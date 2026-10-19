import { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
// import classNames from "classnames";
import {
 // CheckCircleIcon,
 // DollarSign,
 // Flame,
 Globe,
 // Mail,
 Moon,
 SquarePen,
 // Star,
 // Trophy,
} from "@gopvp/common/src/components/images";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Card from "@gopvp/common/src/components/Card/Card";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomSwitch from "@gopvp/common/src/components/Switch/Switch";
// import CustomChip from "@gopvp/common/src/components/Chip/Chip";
import CustomAvatar from "@gopvp/common/src/components/Avatar/Avatar";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
// import StatTile from "@gopvp/common/src/components/StatTile/StatTile";
import ProfileSkeleton from "@gopvp/app/src/components/common/ProfileSkeleton";
import UsernameField from "@gopvp/app/src/components/common/UsernameField";
import { useReduxSelector, useReduxDispatch } from "@gopvp/app/src/redux/hooks";
import sessionService from "@gopvp/common/src/util/sessionService";
import { useAppTheme } from "@gopvp/app/src/context/ThemeContext";
import { useGameHistory } from "@gopvp/app/src/hooks/useGameHistory";
import {
 callAPIInterface,
 showApiErrorToast,
} from "@gopvp/common/src/util/api";
import {
 formatAmount,
 formatNumber,
 shortenUsername,
} from "@gopvp/common/src/util/format";
import type { IUpdateProfileBody } from "@gopvp/common/src/types/payload";
import type {
 ILoginResponse,
 IProfileResponse,
} from "@gopvp/common/src/types/response";
import type { IEditProfileDrawerProps } from "@gopvp/common/src/types/component";
import {
 editProfileText,
 editText,
 // ratingsText,
 saveChangesText,
 appearanceText,
 darkModeText,
 accountText,
 // emailText,
 countryText,
 // statusText,
 // verifiedText,
 // notVerifiedText,
 // bestStreakText,
 winsText,
 earningsText,
} from "@gopvp/app/src/constants/message";
import { scoreText } from "@gopvp/common/src/constants/message";
import CustomModal from "@gopvp/common/src/components/Modal/Modal";
import { ENDPOINTS } from "@gopvp/common/src/constants/endpoint";
import { formSubmitHandler } from "@gopvp/common/src/util/form";
import { usernameRule } from "@gopvp/app/src/utils/validation";
import { flagCdnUrl } from "@gopvp/common/src/constants/env";
import { MATCHES_STATS_FALLBACK } from "@gopvp/app/src/constants/limit";

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
  <CustomModal
   open={open}
   onClose={handleClose}
   customClass="edit-profile-modal"
  >
   <Text customClass="dialog-title">{editProfileText}</Text>

   <Box
    component="form"
    customClass="edit-profile-form"
    onSubmit={formSubmitHandler(formik.handleSubmit)}
   >
    <UsernameField formik={formik} inputRef={usernameInputRef} showHint />

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

 const { stats, statsLoading } = useGameHistory("own", true);

 const statItems = [
  {
   label: scoreText,
   value: formatNumber(stats?.score ?? MATCHES_STATS_FALLBACK),
  },
  { label: winsText, value: formatNumber(stats?.wins ?? MATCHES_STATS_FALLBACK) },
  {
   label: earningsText,
   value: formatAmount(stats?.gross_income ?? MATCHES_STATS_FALLBACK),
  },
 ];

 const accountRows = session
  ? [
     // { label: emailText, value: session.email, Icon: Mail },
     {
      label: countryText,
      value:
       new Intl.DisplayNames(["en"], { type: "region" }).of(session.country) ??
       session.country,
      Icon: Globe,
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

 // const statItems = [
 //  {
 //   label: bestStreakText,
 //   value: stats?.best_streak ?? MATCHES_STATS_FALLBACK,
 //   Icon: Flame,
 //  },
 //  {
 //   label: winsText,
 //   value: stats?.wins ?? MATCHES_STATS_FALLBACK,
 //   Icon: Trophy,
 //  },
 //  {
 //   label: earningsText,
 //   value: formatAmount(stats?.gross_income ?? MATCHES_STATS_FALLBACK),
 //   Icon: DollarSign,
 //   isMoney: true,
 //  },
 // ];

 return (
  <Box customClass="profile-page">
   {session && !loading ? (
    <>
     <Card customClass="profile-id-card">
      <Box customClass="profile-id-row">
       <CustomAvatar
        letter={session.username.charAt(0).toUpperCase()}
        customClass="header lg"
       />
       <Box customClass="profile-id-text">
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
        <Text customClass="profile-id-email">{session.email}</Text>
       </Box>
       <Button
        type="button"
        customClass="sheet-cancel-link profile-edit-icon-btn"
        title={editProfileText}
        aria-label={editProfileText}
        onClick={() => setEditOpen(true)}
       >
        <SquarePen size={16} strokeWidth={2} />
        {editText}
       </Button>
      </Box>

      {/* <Box customClass="profile-id-top">
       <Button
        type="button"
        customClass="sheet-cancel-link profile-edit-icon-btn"
        title={editProfileText}
        aria-label={editProfileText}
        onClick={() => setEditOpen(true)}
       >
        <SquarePen size={16} strokeWidth={2} />
        {editText}
       </Button>
      </Box>

      <Box customClass="profile-hero">
       <Box customClass="profile-avatar-wrap">
        <CustomAvatar
         letter={session.username.charAt(0).toUpperCase()}
         customClass="header lg"
        />
        {stats && (
         <Box customClass="profile-score-badge">
          <Star size={12} strokeWidth={2.4} />
          <Text component="span" customClass="profile-score-text">
           {formatNumber(stats.score)}
          </Text>
         </Box>
        )}
       </Box>
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
      </Box> */}

      {/* <Box customClass="profile-stats-strip">
       {statItems.map(({ label, value, Icon, isMoney }) => (
        <StatTile
         key={label}
         layout="compact"
         icon={<Icon size={18} strokeWidth={2.2} />}
         label={label}
         value={
          statsLoading ? <Skeleton customClass="text" width={40} /> : value
         }
         valueClass={classNames(isMoney && "pos")}
        />
       ))}
      </Box> */}
     </Card>

     <Card customClass="profile-stats-card">
      {statItems.map(({ label, value }) => (
       <Box key={label} customClass="profile-stat">
        <Text customClass="profile-stat-val">
         {statsLoading ? <Skeleton customClass="text" width={44} /> : value}
        </Text>
        <Text customClass="profile-stat-label">{label}</Text>
       </Box>
      ))}
     </Card>

     <Text
      component="h3"
      customClass="subsection-heading profile-section-heading"
     >
      {accountText}
     </Text>
     <Card customClass="stat-list profile-list">
      {accountRows.map(({ label, value, Icon }) => (
       <Box key={label} customClass="stat-row">
        <Box customClass="profile-row-label">
         <Icon size={18} strokeWidth={2} />
         <Text customClass="stat-title" component="span">
          {label}
         </Text>
        </Box>
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

   <Text
    component="h3"
    customClass="subsection-heading profile-section-heading"
   >
    {appearanceText}
   </Text>
   <Card customClass="stat-list profile-list">
    <Box customClass="stat-row">
     <Box customClass="profile-row-label">
      <Moon size={18} strokeWidth={2} />
      <Text customClass="stat-title" component="span">
       {darkModeText}
      </Text>
     </Box>
     <CustomSwitch
      checked={mode === "dark"}
      onChange={toggleTheme}
      customClass="square-toggle"
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
