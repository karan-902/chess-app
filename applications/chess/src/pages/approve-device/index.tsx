import { useState } from "react";
import { useSearchParams } from "react-router";
import { CheckCircle2 } from "lucide-react";
import Box from "@/components/base/Box/Box";
import Button from "@/components/base/Button/Button";
import AuthLayout from "@/container/AuthLayout";
import { callAPIInterface } from "@/utils";
import { useLogout } from "@/hooks/useLogout";
import type { ApproveDeviceStatus } from "@/types/components";
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

export default function ApproveDevice() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<ApproveDeviceStatus>(
        token ? "confirm" : "invalid",
    );
    const [submitting, setSubmitting] = useState(false);
    const logout = useLogout("Loading...");

    const handleBackToSignIn = (e: React.MouseEvent) => {
        e.preventDefault();
        logout();
    };

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
                footer={
                    <a href="/login" onClick={handleBackToSignIn}>
                        {authBackToSignIn}
                    </a>
                }
            >
                <Box customClass="deposit-success-icon">
                    <CheckCircle2 size={32} strokeWidth={2} />
                </Box>
            </AuthLayout>
        );
    }

    if (status === "invalid") {
        return (
            <AuthLayout
                title={deviceApproveInvalidTitle}
                subtitle={deviceApproveInvalidDescription}
                footer={
                    <a href="/login" onClick={handleBackToSignIn}>
                        {authBackToSignIn}
                    </a>
                }
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
