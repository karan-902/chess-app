import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Shield } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import CountrySelect from "@/components/base/CountrySelect/CountrySelect";
import { callAPIInterface } from "@/utils";
import { useReduxSelector, useReduxDispatch } from "@/store/hooks";
import { updateSession } from "@/store/persisted/auth.slice";
import type { IProfileResponse, IUpdateProfileBody, IUpdateProfileResponse } from "@/types/utils";
import "./profile.scss";

const profileSchema = Yup.object({
    first_name: Yup.string().trim().min(1, "Required").required("Required"),
    last_name:  Yup.string().trim().min(1, "Required").required("Required"),
    username:   Yup.string().trim().min(3, "Min 3 characters").required("Required"),
    country:    Yup.string().optional(),
});

// ── Profile Page ───────────────────────────────────────────────────────────────

type FormValues = { first_name: string; last_name: string; username: string; country: string };

export default function ProfilePage() {
    const dispatch = useReduxDispatch();
    const session  = useReduxSelector(s => s.auth.session);
    const [profile, setProfile]         = useState<IProfileResponse | null>(null);
    const [loading, setLoading]         = useState(true);
    const [initValues, setInitValues]   = useState<FormValues>({
        first_name: session?.first_name ?? "",
        last_name:  session?.last_name  ?? "",
        username:   session?.username   ?? "",
        country:    session?.country    ?? "",
    });

    const formik = useFormik({
        initialValues: initValues,
        validationSchema: profileSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const updated = await callAPIInterface<IUpdateProfileBody, IUpdateProfileResponse>(
                    "PUT", "/profile", {
                        first_name: values.first_name,
                        last_name:  values.last_name,
                        username:   values.username,
                        country:    values.country,
                    },
                );

                // Use server response if full profile returned, else use submitted values
                const synced = {
                    first_name: updated?.first_name ?? values.first_name,
                    last_name:  updated?.last_name  ?? values.last_name,
                    username:   updated?.username   ?? values.username,
                    country:    updated?.country    ?? values.country,
                };

                if (updated?.elo_rating !== undefined) setProfile(updated);

                // Sync Redux session so AppBar + other screens reflect changes
                dispatch(updateSession({
                    first_name: synced.first_name,
                    last_name:  synced.last_name,
                    username:   synced.username,
                    country:    synced.country,
                }));

                // Update initValues → enableReinitialize picks it up → inputs refresh, dirty = false
                setInitValues({
                    first_name: synced.first_name,
                    last_name:  synced.last_name,
                    username:   synced.username,
                    country:    synced.country,
                });
                resetForm({
                    values: {
                        first_name: synced.first_name,
                        last_name:  synced.last_name,
                        username:   synced.username,
                        country:    synced.country,
                    },
                });

                toast.success("Profile updated");
            } catch {
                toast.error("Failed to update profile");
            } finally {
                setSubmitting(false);
            }
        },
    });

    useEffect(() => {
        callAPIInterface<undefined, IProfileResponse>("GET", "/profile")
            .then(data => {
                setProfile(data);
                setInitValues({
                    first_name: data.first_name,
                    last_name:  data.last_name,
                    username:   data.username,
                    country:    data.country,
                });
            })
            .catch(() => { /* session values already used as initialValues */ })
            .finally(() => setLoading(false));
    }, []);

    const elo         = profile?.elo_rating ?? session?.elo_rating ?? 0;
    const email       = profile?.email      ?? session?.email      ?? "";
    const { first_name, last_name, username } = formik.values;
    const displayName  = username?.trim() || `${first_name} ${last_name}`.trim();
    const avatarLetter = (first_name[0] ?? "?").toUpperCase();

    if (loading) {
        return (
            <Box customClass="profile-view">
                <Box customClass="profile-skeleton" />
            </Box>
        );
    }

    return (
        <Box customClass="profile-view">
            <Box customClass="lobby-heading">
                <Text as="h1" customClass="lobby-heading-title">Profile</Text>
                <Text as="p" customClass="lobby-heading-sub">Manage your account details</Text>
            </Box>

            {/* Avatar card */}
            <Box customClass="profile-avatar-card">
                <Box customClass="profile-avatar-ring">
                    <Text as="span" customClass="profile-avatar-initial">{avatarLetter}</Text>
                </Box>
                <Box customClass="profile-avatar-info">
                    <Text customClass="profile-avatar-name">{displayName}</Text>
                    {username?.trim() && (
                        <Text customClass="profile-avatar-username">
                            {`${first_name} ${last_name}`.trim()}
                        </Text>
                    )}
                </Box>
                <Box customClass="profile-elo-badge">
                    <Shield size={12} strokeWidth={2} />
                    <Text as="span" customClass="profile-elo-value">{elo}</Text>
                    <Text as="span" customClass="profile-elo-label">ELO</Text>
                </Box>
            </Box>

            {/* Form */}
            <form className="profile-form-card" onSubmit={formik.handleSubmit}>
                <Text customClass="profile-section-label">Personal Info</Text>

                <Box customClass="profile-field-row">
                    <Box customClass="profile-field">
                        <label className="profile-label">First name</label>
                        <input
                            className={clsx("profile-input", formik.touched.first_name && formik.errors.first_name && "profile-input--error")}
                            {...formik.getFieldProps("first_name")}
                            placeholder="First name"
                        />
                        {formik.touched.first_name && formik.errors.first_name && (
                            <Text customClass="profile-field-error">{formik.errors.first_name}</Text>
                        )}
                    </Box>
                    <Box customClass="profile-field">
                        <label className="profile-label">Last name</label>
                        <input
                            className={clsx("profile-input", formik.touched.last_name && formik.errors.last_name && "profile-input--error")}
                            {...formik.getFieldProps("last_name")}
                            placeholder="Last name"
                        />
                        {formik.touched.last_name && formik.errors.last_name && (
                            <Text customClass="profile-field-error">{formik.errors.last_name}</Text>
                        )}
                    </Box>
                </Box>

                <Box customClass="profile-field">
                    <label className="profile-label">Username</label>
                    <input
                        className={clsx("profile-input", formik.touched.username && formik.errors.username && "profile-input--error")}
                        {...formik.getFieldProps("username")}
                        placeholder="username"
                    />
                    {formik.touched.username && formik.errors.username && (
                        <Text customClass="profile-field-error">{formik.errors.username}</Text>
                    )}
                </Box>

                <Box customClass="profile-field">
                    <label className="profile-label">Email</label>
                    <input className="profile-input profile-input--disabled" value={email} disabled />
                    <Text customClass="profile-field-hint">Email cannot be changed</Text>
                </Box>

                <Box customClass="profile-field">
                    <label className="profile-label">Country</label>
                    <CountrySelect
                        value={formik.values.country}
                        onChange={v => formik.setFieldValue("country", v)}
                    />
                </Box>

                <Box customClass="profile-field">
                    <label className="profile-label">ELO Rating</label>
                    <input className="profile-input profile-input--disabled" value={elo} disabled />
                    <Text customClass="profile-field-hint">Rating updates automatically after each game</Text>
                </Box>

                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    type="submit"
                    disabled={!formik.dirty || !formik.isValid || formik.isSubmitting}
                    customClass="profile-save-btn"
                >
                    {formik.isSubmitting ? "Saving…" : "Save Changes"}
                </Button>
            </form>
        </Box>
    );
}
