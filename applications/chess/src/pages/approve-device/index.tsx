import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircleOutlineIcon } from "@gopvp/common/src/components/images";
import Box from "@gopvp/common/src/components/Box/Box";
import Button from "@gopvp/common/src/components/Button/Button";
import AuthLayout from "@gopvp/chess/src/container/AuthLayout";
import { callAPIInterface } from "@gopvp/common/src/util/api";
import { useLogout } from "@gopvp/chess/src/hooks/useLogout";
import type { ApproveDeviceStatus } from "@gopvp/common/src/types/component";
import {
 backToSignInText,
 approveSignInText,
 newDeviceSignInAttemptText,
 yesThisWasMeText,
 deviceApprovedText,
 returnToOtherDeviceText,
 linkExpiredText,
 approvalLinkInvalidText,
} from "@gopvp/chess/src/constants/messages";

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
   const res = await callAPIInterface<{ approved: boolean }, { token: string }>(
    "POST",
    "/device/approve",
    { token: token! },
   );
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
    title={deviceApprovedText}
    subtitle={returnToOtherDeviceText}
    footer={
     <a href="/login" onClick={handleBackToSignIn}>
      {backToSignInText}
     </a>
    }
   >
    <Box customClass="modal-success-icon">
     <CheckCircleOutlineIcon className="success-icon" />
    </Box>
   </AuthLayout>
  );
 }

 if (status === "invalid") {
  return (
   <AuthLayout
    title={linkExpiredText}
    subtitle={approvalLinkInvalidText}
    footer={
     <a href="/login" onClick={handleBackToSignIn}>
      {backToSignInText}
     </a>
    }
   >
    {null}
   </AuthLayout>
  );
 }

 return (
  <AuthLayout title={approveSignInText} subtitle={newDeviceSignInAttemptText}>
   <Button
    type="button"
    variant="contained"
    fullWidth
    customClass="auth-submit-btn"
    disabled={submitting}
    isLoading={submitting}
    onClick={handleApprove}
   >
    {yesThisWasMeText}
   </Button>
  </AuthLayout>
 );
}
