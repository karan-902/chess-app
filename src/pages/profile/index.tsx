import { useState, useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "sonner";
import classNames from "classnames";
import { Pencil } from "lucide-react";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Card from "@/components/base/Card/Card";
import Avatar from "@/components/base/Avatar/Avatar";
import Skeleton from "@/components/base/Skeleton/Skeleton";
import Button from "@/components/base/Button/Button";
import Input from "@/components/base/Input/Input";
import Label from "@/components/base/Label/Label";
import Drawer from "@/components/base/Drawer/Drawer";
import Switch from "@/components/base/Switch/Switch";
import { useReduxSelector, useReduxDispatch } from "@/redux/hooks";
import { updateSession } from "@/redux/persisted/auth.slice";
import { useAppTheme } from "@/context/ThemeContext";
import { callAPIInterface } from "@/utils";
import { getAvatarUrl } from "@/utils/avatar";
import { formateText } from "@/utils/formate";
import { CATEGORY_META } from "@/constants/config";
import type { GameCategory } from "@/types/types";
import type {
    ILoginResponse,
    IUpdateProfileBody,
    IUpdateProfileResponse,
    IAvatarOptionsResponse,
} from "@/types/utils";
import {
    profileTitle,
    profileSubtitle,
    profileEditButton,
    profileEloLabel,
    profileRatingsByCategoryLabel,
    profileStreakWidgetTitle,
    profileStreakWinsSuffix,
    leaderboardRankFallback,
    matchesStatsCurrentStreakLabel,
    matchesStatsBestStreakLabel,
    profileValidationRequired,
    profileValidationUsernameMinLength,
    profileUpdateSuccess,
    profileUpdateFailed,
    profilePersonalInfoLabel,
    profileFirstNameLabel,
    profileLastNameLabel,
    profileUsernameLabel,
    profileEmailLabel,
    profileCountryLabel,
    profileSaveChangesButton,
    profileAvatarPickerTitle,
    profileAvatarUpdateSuccess,
    profileAvatarUpdateFailed,
    profileAppearanceLabel,
    profileDarkModeLabel,
} from "@/constants/messages";

const CATEGORY_ORDER: GameCategory[] = [
    "BULLET",
    "BLITZ",
    "RAPID",
    "CLASSICAL",
];

const profileEditSchema = Yup.object({
    username: Yup.string()
        .trim()
        .min(3, profileValidationUsernameMinLength)
        .required(profileValidationRequired),
});

function StatRowSkeleton() {
    return (
        <Box customClass="matches-stat-row">
            <Skeleton customClass="text" width={100} height={14} />
            <Skeleton customClass="text" width={40} height={16} />
        </Box>
    );
}

function ProfileSkeleton() {
    return (
        <Box customClass="profile-page">
            <Card customClass="profile-id-card">
                <Box customClass="profile-id-row">
                    <Skeleton
                        variant="circular"
                        customClass="circle"
                        width={44}
                        height={44}
                    />
                    <Box customClass="profile-id-text">
                        <Skeleton customClass="text" width={100} height={16} />
                        <Skeleton
                            customClass="text"
                            width={70}
                            height={12}
                            style={{ marginTop: "0.3rem" }}
                        />
                    </Box>
                </Box>
            </Card>

            <Skeleton
                customClass="text"
                width={70}
                height={17}
                style={{ margin: "0.9rem 0 0.3rem" }}
            />
            <Skeleton
                customClass="text"
                width={180}
                height={13}
                style={{ marginBottom: "0.9rem" }}
            />

            <Skeleton
                customClass="text"
                width={110}
                height={17}
                style={{ marginBottom: "0.6rem" }}
            />
            <Card customClass="matches-stat-list">
                {Array.from({ length: 6 }, (_, i) => (
                    <StatRowSkeleton key={i} />
                ))}
            </Card>

            <Skeleton
                customClass="text"
                width={150}
                height={17}
                style={{ margin: "0.9rem 0 0.6rem" }}
            />
            <Card customClass="matches-stat-list">
                {Array.from({ length: 4 }, (_, i) => (
                    <StatRowSkeleton key={i} />
                ))}
            </Card>

            <Skeleton
                customClass="text"
                width={70}
                height={17}
                style={{ margin: "0.9rem 0 0.6rem" }}
            />
            <Card customClass="matches-stat-list">
                <StatRowSkeleton />
                <StatRowSkeleton />
                <StatRowSkeleton />
                <StatRowSkeleton />
            </Card>
        </Box>
    );
}

function EditProfileDrawer({
    open,
    onClose,
    session,
}: {
    open: boolean;
    onClose: () => void;
    session: ILoginResponse;
}) {
    const dispatch = useReduxDispatch();
    const [avatarOptions, setAvatarOptions] =
        useState<IAvatarOptionsResponse | null>(null);
    const [savingAvatar, setSavingAvatar] = useState(false);

    useEffect(() => {
        if (!open || avatarOptions) return;
        callAPIInterface<undefined, IAvatarOptionsResponse>(
            "GET",
            "/profile/avatar-options",
        )
            .then(setAvatarOptions)
            .catch(() => {});
    }, [open, avatarOptions]);

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
                dispatch(updateSession(updated));
                toast.success(profileUpdateSuccess);
                onClose();
            } catch {
                toast.error(profileUpdateFailed);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const updateAvatar = async (seed: string) => {
        if (seed === session.avatar_seed || savingAvatar) return;
        setSavingAvatar(true);
        try {
            const updated = await callAPIInterface<
                IUpdateProfileBody,
                IUpdateProfileResponse
            >("PUT", "/profile", { avatar_seed: seed });
            dispatch(updateSession(updated));
            toast.success(profileAvatarUpdateSuccess);
        } catch {
            toast.error(profileAvatarUpdateFailed);
        } finally {
            setSavingAvatar(false);
        }
    };

    return (
        <Drawer anchor="bottom" open={open} onClose={onClose}>
            <Text customClass="edit-profile-title">{profileEditButton}</Text>

            <Text customClass="edit-profile-section-label">
                {profileAvatarPickerTitle}
            </Text>
            <Box customClass="profile-avatar-picker-grid">
                {avatarOptions?.seeds.map((seed) => (
                    <Button
                        key={seed}
                        type="button"
                        variant="outlined"
                        customClass={classNames(
                            "profile-avatar-picker-option",
                            seed === session.avatar_seed && "selected",
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

            <Box
                component="form"
                customClass="edit-profile-form"
                onSubmit={formik.handleSubmit as any}
            >
                <Box customClass="auth-field">
                    <Label htmlFor="username">{profileUsernameLabel}</Label>
                    <Input
                        id="username"
                        fullWidth
                        isError={
                            !!(
                                formik.touched.username &&
                                formik.errors.username
                            )
                        }
                        helperText={formik.errors.username}
                        {...formik.getFieldProps("username")}
                    />
                </Box>

                <Button
                    type="submit"
                    variant="outlined"
                    fullWidth
                    isLoading={formik.isSubmitting}
                    disabled={!formik.dirty || formik.isSubmitting}
                    customClass="profile-save-btn"
                >
                    {profileSaveChangesButton}
                </Button>
            </Box>
        </Drawer>
    );
}

export default function Profile() {
    const session = useReduxSelector((state) => state.auth.session);
    const dispatch = useReduxDispatch();
    const { mode, toggleTheme } = useAppTheme();
    const [editOpen, setEditOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        callAPIInterface<undefined, Partial<ILoginResponse>>("GET", "/profile")
            .then((res) => dispatch(updateSession(res)))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [dispatch]);

    if (!session || loading) return <ProfileSkeleton />;

    return (
        <Box customClass="profile-page">
            <Card customClass="profile-id-card">
                <Button
                    type="button"
                    variant="outlined"
                    customClass="profile-edit-icon-btn"
                    title={profileEditButton}
                    aria-label={profileEditButton}
                    onClick={() => setEditOpen(true)}
                >
                    <Pencil size={12} strokeWidth={2} />
                </Button>

                <Box customClass="profile-id-row">
                    <Avatar
                        letter={session.username.charAt(0).toUpperCase()}
                        src={getAvatarUrl(session.avatar_seed)}
                        customClass="lg profile-avatar-ring"
                    />
                    <Box customClass="profile-id-text">
                        <Text customClass="profile-id-name">
                            {session.username}
                        </Text>
                        <Text customClass="profile-id-handle">
                            {`${session.first_name} ${session.last_name}`.trim()}
                        </Text>
                    </Box>
                </Box>
            </Card>

            <Text component="h3" customClass="rules-heading">
                {profileTitle}
            </Text>
            <Text customClass="rules-text">{profileSubtitle}</Text>

            <Text component="h3" customClass="rules-heading">
                {profilePersonalInfoLabel}
            </Text>
            <Card customClass="matches-stat-list">
                <Box customClass="matches-stat-row">
                    <Text customClass="matches-stat-title" component="span">
                        {profileFirstNameLabel}
                    </Text>
                    <Text component="span" customClass="matches-stat-val">
                        {session.first_name}
                    </Text>
                </Box>
                <Box customClass="matches-stat-row">
                    <Text customClass="matches-stat-title" component="span">
                        {profileLastNameLabel}
                    </Text>
                    <Text component="span" customClass="matches-stat-val">
                        {session.last_name}
                    </Text>
                </Box>
                <Box customClass="matches-stat-row">
                    <Text customClass="matches-stat-title" component="span">
                        {profileUsernameLabel}
                    </Text>
                    <Text component="span" customClass="matches-stat-val">
                        {session.username}
                    </Text>
                </Box>
                <Box customClass="matches-stat-row">
                    <Text customClass="matches-stat-title" component="span">
                        {profileEmailLabel}
                    </Text>
                    <Text component="span" customClass="matches-stat-val">
                        {session.email}
                    </Text>
                </Box>
                <Box customClass="matches-stat-row">
                    <Text customClass="matches-stat-title" component="span">
                        {profileCountryLabel}
                    </Text>
                    <Text component="span" customClass="matches-stat-val">
                        {session.country}
                    </Text>
                </Box>
                <Box customClass="matches-stat-row">
                    <Text customClass="matches-stat-title" component="span">
                        {profileEloLabel}
                    </Text>
                    <Text component="span" customClass="matches-stat-val">
                        {session.elo_rating ?? leaderboardRankFallback}
                    </Text>
                </Box>
            </Card>

            <Text component="h3" customClass="rules-heading">
                {profileAppearanceLabel}
            </Text>
            <Card customClass="matches-stat-list">
                <Box customClass="matches-stat-row">
                    <Text customClass="matches-stat-title" component="span">
                        {profileDarkModeLabel}
                    </Text>
                    <Switch checked={mode === "dark"} onChange={toggleTheme} />
                </Box>
            </Card>

            <Text component="h3" customClass="rules-heading">
                {profileRatingsByCategoryLabel}
            </Text>
            <Card customClass="matches-stat-list">
                {CATEGORY_ORDER.map((category) => (
                    <Box key={category} customClass="matches-stat-row">
                        <Text customClass="matches-stat-title" component="span">
                            {formateText(CATEGORY_META[category].label)}
                        </Text>
                        <Text component="span" customClass="matches-stat-val">
                            {session.ratings[category] ??
                                leaderboardRankFallback}
                        </Text>
                    </Box>
                ))}
            </Card>

            <Text component="h3" customClass="rules-heading">
                {profileStreakWidgetTitle}
            </Text>
            <Card customClass="matches-stat-list">
                <Box customClass="matches-stat-row">
                    <Text customClass="matches-stat-title" component="span">
                        {matchesStatsCurrentStreakLabel}
                    </Text>
                    <Text component="span" customClass="matches-stat-val">
                        {session.current_streak} {profileStreakWinsSuffix}
                    </Text>
                </Box>
                <Box customClass="matches-stat-row">
                    <Text component="span">{matchesStatsBestStreakLabel}</Text>
                    <Text component="span" customClass="matches-stat-val">
                        {session.best_streak} {profileStreakWinsSuffix}
                    </Text>
                </Box>
            </Card>

            <EditProfileDrawer
                open={editOpen}
                onClose={() => setEditOpen(false)}
                session={session}
            />
        </Box>
    );
}
