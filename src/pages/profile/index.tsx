import * as Yup from "yup";
import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { Shield, Flame, Trophy, Pencil } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import Input from "@/components/base/Input/Input";
import { Label } from "@/components/base/Label/label";
import Select from "@/components/base/Select/Select";
import Avatar from "@/components/base/Avatar/Avatar";
import ProfileSkeleton from "./ProfileSkeleton";
import { callAPIInterface } from "@/utils";
import { getAvatarUrl } from "@/utils/avatar";
import { CATEGORY_META, COUNTRY_OPTIONS } from "@/constants/config";
import type { GameCategory } from "@/types/types";
import { useReduxSelector, useReduxDispatch } from "@/store/hooks";
import { updateSession } from "@/store/persisted/auth.slice";

import {
    profileEyebrow,
    profileTitle,
    profileSubtitle,
    profileValidationRequired,
    profileValidationUsernameMinLength,
    profileUpdateSuccess,
    profileUpdateFailed,
    profileEloLabel,
    profilePersonalInfoLabel,
    profileFirstNameLabel,
    profileLastNameLabel,
    profileUsernameLabel,
    profileEmailLabel,
    profileEmailHint,
    profileCountryLabel,
    profileEloRatingLabel,
    profileEloRatingHint,
    profileRatingsByCategoryLabel,
    profileSaveChangesButton,
    profileChangeAvatarButton,
    profileAvatarPickerTitle,
    profileAvatarUpdateSuccess,
    profileAvatarUpdateFailed,
    countrySelectSelectPlaceholder,
    countrySelectSearchPlaceholder,
    profileStreakWidgetTitle,
    profileStreakWinsSuffix,
    profileBestStreakRow,
} from "@/components/messages";
import type {
    IProfileResponse,
    IUpdateProfileBody,
    IUpdateProfileResponse,
    IAvatarOptionsResponse,
} from "@/types/utils";

const profileSchema = Yup.object({
    first_name: Yup.string()
        .trim()
        .min(1, profileValidationRequired)
        .required(profileValidationRequired),
    last_name: Yup.string()
        .trim()
        .min(1, profileValidationRequired)
        .required(profileValidationRequired),
    username: Yup.string()
        .trim()
        .min(3, profileValidationUsernameMinLength)
        .required(profileValidationRequired),
    country: Yup.string().optional(),
});

type FormValues = {
    first_name: string;
    last_name: string;
    username: string;
    country: string;
};

const fieldLabelClass =
    "block mb-1 font-mono text-[0.6rem] uppercase tracking-wider text-white/30";

export default function ProfilePage() {
    const dispatch = useReduxDispatch();

    const session = useReduxSelector((s) => s.auth.session);
    const [profile, setProfile] = useState<IProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [initValues, setInitValues] = useState<FormValues>({
        first_name: session?.first_name ?? "",
        last_name: session?.last_name ?? "",
        username: session?.username ?? "",
        country: session?.country ?? "",
    });
    const [avatarSeed, setAvatarSeed] = useState<string | null>(
        session?.avatar_seed ?? null,
    );
    const [pickerOpen, setPickerOpen] = useState(false);
    const [savingAvatar, setSavingAvatar] = useState(false);
    const [avatarOptions, setAvatarOptions] =
        useState<IAvatarOptionsResponse | null>(null);
    const avatarZoneRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        callAPIInterface<undefined, IAvatarOptionsResponse>(
            "GET",
            "/profile/avatar-options",
        )
            .then(setAvatarOptions)
            .catch(() => {});
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                avatarZoneRef.current &&
                !avatarZoneRef.current.contains(e.target as Node)
            )
                setPickerOpen(false);
        };
        if (pickerOpen) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [pickerOpen]);

    const updateAvatar = async (seed: string) => {
        if (seed === avatarSeed || savingAvatar) return;
        setSavingAvatar(true);
        try {
            const updated = await callAPIInterface<
                IUpdateProfileBody,
                IUpdateProfileResponse
            >("PUT", "/profile", { avatar_seed: seed });
            setAvatarSeed(updated.avatar_seed);
            dispatch(updateSession({ avatar_seed: updated.avatar_seed }));
            setPickerOpen(false);
            toast.success(profileAvatarUpdateSuccess);
        } catch {
            toast.error(profileAvatarUpdateFailed);
        } finally {
            setSavingAvatar(false);
        }
    };

    const formik = useFormik({
        initialValues: initValues,
        validationSchema: profileSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const updated = await callAPIInterface<
                    IUpdateProfileBody,
                    IUpdateProfileResponse
                >("PUT", "/profile", {
                    first_name: values.first_name,
                    last_name: values.last_name,
                    username: values.username,
                    country: values.country,
                });

                // Use server response if full profile returned, else use submitted values
                const synced = {
                    first_name: updated?.first_name ?? values.first_name,
                    last_name: updated?.last_name ?? values.last_name,
                    username: updated?.username ?? values.username,
                    country: updated?.country ?? values.country,
                };

                if (updated?.elo_rating !== undefined) setProfile(updated);

                // Sync Redux session so AppBar + other screens reflect changes
                dispatch(
                    updateSession({
                        first_name: synced.first_name,
                        last_name: synced.last_name,
                        username: synced.username,
                        country: synced.country,
                    }),
                );

                // Update initValues → enableReinitialize picks it up → inputs refresh, dirty = false
                setInitValues({
                    first_name: synced.first_name,
                    last_name: synced.last_name,
                    username: synced.username,
                    country: synced.country,
                });
                resetForm({
                    values: {
                        first_name: synced.first_name,
                        last_name: synced.last_name,
                        username: synced.username,
                        country: synced.country,
                    },
                });

                toast.success(profileUpdateSuccess);
            } catch {
                toast.error(profileUpdateFailed);
            } finally {
                setSubmitting(false);
            }
        },
    });

    useEffect(() => {
        callAPIInterface<undefined, IProfileResponse>("GET", "/profile")
            .then((data) => {
                setProfile(data);
                setInitValues({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    username: data.username,
                    country: data.country,
                });
                setAvatarSeed(data.avatar_seed);
            })
            .catch(() => {
                /* session values already used as initialValues */
            })
            .finally(() => setLoading(false));
    }, []);

    const elo = profile?.elo_rating ?? session?.elo_rating ?? 0;
    const ratings = profile?.ratings;
    const email = profile?.email ?? session?.email ?? "";
    // Not part of GET /profile — only ever comes back on register/login/SSO,
    // so the session (set at auth time) is the only source for these.
    const currentStreak = profile?.current_streak ?? 0;
    const bestStreak = profile?.best_streak ?? 0;
    const { first_name, last_name, username } = formik.values;
    const displayName = username?.trim() || `${first_name} ${last_name}`.trim();
    const avatarLetter = (first_name[0] ?? "?").toUpperCase();

    return (
        <Box customClass="profile-view">
            <Box customClass="lobby-heading">
                <Text as="p" customClass="lobby-eyebrow">
                    {profileEyebrow}
                </Text>
                <Text as="h1" customClass="lobby-heading-title">
                    {profileTitle}
                </Text>
                <Text as="p" customClass="lobby-heading-sub">
                    {profileSubtitle}
                </Text>
            </Box>

            {loading ? (
                <ProfileSkeleton />
            ) : (
                <>
                    <Box customClass="profile-avatar-zone" ref={avatarZoneRef}>
                        <Box customClass="profile-id-strip">
                            <Box customClass="profile-avatar-edit-wrap">
                                <Avatar
                                    letter={avatarLetter}
                                    src={getAvatarUrl(avatarSeed)}
                                    customClass="profile-avatar-ring"
                                />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    title={profileChangeAvatarButton}
                                    aria-label={profileChangeAvatarButton}
                                    customClass="profile-avatar-edit-btn"
                                    onClick={() => setPickerOpen((v) => !v)}
                                >
                                    <Pencil size={11} strokeWidth={2} />
                                </Button>
                            </Box>
                            <Box customClass="profile-avatar-info">
                                <Text customClass="profile-avatar-name">
                                    {displayName}
                                </Text>
                                {username?.trim() && (
                                    <Text customClass="profile-avatar-username">
                                        {`${first_name} ${last_name}`.trim()}
                                    </Text>
                                )}
                            </Box>
                            <Box customClass="profile-elo-badge">
                                <Shield size={12} strokeWidth={2} />
                                <Text as="span" customClass="profile-elo-value">
                                    {elo}
                                </Text>
                                <Text as="span" customClass="profile-elo-label">
                                    {profileEloLabel}
                                </Text>
                            </Box>
                        </Box>

                        {pickerOpen && (
                            <Box customClass="profile-avatar-picker-grid">
                                {avatarOptions?.seeds.map((seed) => (
                                    <Button
                                        key={seed}
                                        variant="ghost"
                                        title={profileAvatarPickerTitle}
                                        customClass={clsx(
                                            "profile-avatar-picker-option",
                                            seed === avatarSeed && "selected",
                                        )}
                                        disabled={savingAvatar}
                                        onClick={() => updateAvatar(seed)}
                                    >
                                        <img
                                            src={getAvatarUrl(seed)}
                                            alt={seed}
                                            width="100%"
                                            height="100%"
                                        />
                                    </Button>
                                ))}
                            </Box>
                        )}
                    </Box>

                    <Box customClass="profile-dashboard-grid">
                        <Box customClass="profile-widget">
                            <Text customClass="profile-widget-title">
                                {profileStreakWidgetTitle}
                            </Text>
                            <Box customClass="profile-streak-big">
                                <Flame size={16} strokeWidth={2} />
                                <Text
                                    as="span"
                                    customClass="profile-streak-num"
                                >
                                    {currentStreak}
                                </Text>
                                <Text
                                    as="span"
                                    customClass="profile-streak-sub"
                                >
                                    {profileStreakWinsSuffix}
                                </Text>
                            </Box>
                            <Text customClass="profile-best-row">
                                <Trophy size={11} strokeWidth={2} />
                                {profileBestStreakRow(bestStreak)}
                            </Text>
                        </Box>

                        {ratings && (
                            <Box customClass="profile-widget">
                                <Text customClass="profile-widget-title">
                                    {profileRatingsByCategoryLabel}
                                </Text>
                                {(
                                    [
                                        "bullet",
                                        "blitz",
                                        "rapid",
                                        "classical",
                                    ] as GameCategory[]
                                ).map((category) => (
                                    <Box
                                        key={category}
                                        customClass="profile-rating-row"
                                    >
                                        <Text as="span">
                                            {CATEGORY_META[category].emoji}{" "}
                                            {CATEGORY_META[category].label}
                                        </Text>
                                        <Text as="span" weight={700}>
                                            {ratings[category] !== null
                                                ? String(ratings[category])
                                                : "—"}
                                        </Text>
                                    </Box>
                                ))}
                            </Box>
                        )}

                        <Box
                            as="form"
                            customClass="profile-widget profile-widget-full"
                            onSubmit={
                                formik.handleSubmit as React.FormEventHandler<HTMLElement>
                            }
                        >
                            <Text customClass="profile-widget-title">
                                {profilePersonalInfoLabel}
                            </Text>

                            <Box customClass="profile-field-row">
                                <Box customClass="profile-field">
                                    <Label className={fieldLabelClass}>
                                        {profileFirstNameLabel}
                                    </Label>
                                    <Input
                                        size="sm"
                                        fullWidth
                                        isError={
                                            !!(
                                                formik.touched.first_name &&
                                                formik.errors.first_name
                                            )
                                        }
                                        helperText={formik.errors.first_name}
                                        {...formik.getFieldProps("first_name")}
                                        placeholder={profileFirstNameLabel}
                                    />
                                </Box>
                                <Box customClass="profile-field">
                                    <Label className={fieldLabelClass}>
                                        {profileLastNameLabel}
                                    </Label>
                                    <Input
                                        size="sm"
                                        fullWidth
                                        isError={
                                            !!(
                                                formik.touched.last_name &&
                                                formik.errors.last_name
                                            )
                                        }
                                        helperText={formik.errors.last_name}
                                        {...formik.getFieldProps("last_name")}
                                        placeholder={profileLastNameLabel}
                                    />
                                </Box>
                            </Box>

                            <Box customClass="profile-field">
                                <Label className={fieldLabelClass}>
                                    {profileUsernameLabel}
                                </Label>
                                <Input
                                    size="sm"
                                    fullWidth
                                    isError={
                                        !!(
                                            formik.touched.username &&
                                            formik.errors.username
                                        )
                                    }
                                    helperText={formik.errors.username}
                                    {...formik.getFieldProps("username")}
                                    placeholder={profileUsernameLabel.toLowerCase()}
                                />
                            </Box>

                            <Box customClass="profile-field">
                                <Label className={fieldLabelClass}>
                                    {profileEmailLabel}
                                </Label>
                                <Input
                                    size="sm"
                                    fullWidth
                                    value={email}
                                    disabled
                                />
                                <Text customClass="profile-field-hint">
                                    {profileEmailHint}
                                </Text>
                            </Box>

                            <Box customClass="profile-field">
                                <Label className={fieldLabelClass}>
                                    {profileCountryLabel}
                                </Label>
                                <Select
                                    value={formik.values.country}
                                    onChange={(v) =>
                                        formik.setFieldValue("country", v)
                                    }
                                    options={COUNTRY_OPTIONS}
                                    searchable
                                    placeholder={countrySelectSelectPlaceholder}
                                    searchPlaceholder={
                                        countrySelectSearchPlaceholder
                                    }
                                />
                            </Box>

                            <Box customClass="profile-field">
                                <Label className={fieldLabelClass}>
                                    {profileEloRatingLabel}
                                </Label>
                                <Input
                                    size="sm"
                                    fullWidth
                                    value={elo}
                                    disabled
                                />
                                <Text customClass="profile-field-hint">
                                    {profileEloRatingHint}
                                </Text>
                            </Box>

                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                type="submit"
                                isLoading={formik.isSubmitting}
                                disabled={!formik.dirty || !formik.isValid}
                                customClass="profile-save-btn"
                            >
                                {profileSaveChangesButton}
                            </Button>
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
}
