import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import Button from "@/components/base/Button/Button";
import AuthLayout from "@/container/AuthLayout";
import { callAPIInterface } from "@/utils";
import {
    authBackToSignIn,
    deviceApprovePageTitle,
    deviceApprovePageDescription,
    deviceApproveButton,
    deviceApprovedTitle,
    deviceApprovedDescription,
    deviceApproveInvalidTitle,
    deviceApproveInvalidDescription,
} from "@/constants/messages";

export default function ApproveDevicePage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"confirm" | "approved" | "invalid">(
        token ? "confirm" : "invalid",
    );
    const [submitting, setSubmitting] = useState(false);

    const handleApprove = async () => {
        setSubmitting(true);
        try {
            const res = await callAPIInterface<
                { token: string },
                { approved: boolean }
            >("POST", "/device/approve", { token: token! });
            setStatus(res.approved ? "approved" : "invalid");
        } catch {
            setStatus("invalid");
        } finally {
            setSubmitting(false);
        }
    };

    if (status === "approved") {
        return (
            <AuthLayout
                title={deviceApprovedTitle}
                subtitle={deviceApprovedDescription}
                footer={<Link to="/login">{authBackToSignIn}</Link>}
            >
                {null}
            </AuthLayout>
        );
    }

    if (status === "invalid") {
        return (
            <AuthLayout
                title={deviceApproveInvalidTitle}
                subtitle={deviceApproveInvalidDescription}
                footer={<Link to="/login">{authBackToSignIn}</Link>}
            >
                {null}
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title={deviceApprovePageTitle}
            subtitle={deviceApprovePageDescription}
        >
            <Button
                type="button"
                variant="contained"
                fullWidth
                customClass="auth-submit-btn"
                disabled={submitting}
                isLoading={submitting}
                onClick={handleApprove}
            >
                {deviceApproveButton}
            </Button>
        </AuthLayout>
    );
}
