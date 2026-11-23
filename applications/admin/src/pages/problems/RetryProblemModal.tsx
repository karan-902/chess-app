import { useState } from "react";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomModal from "@gopvp/common/src/components/Modal/Modal";
import { ADMIN_ENDPOINTS } from "@gopvp/admin/src/constants/endpoint";
import {
 cancelText,
 retryHintText,
 retryText,
 retryTitleText,
} from "@gopvp/admin/src/constants/message";
import { adminApiCall, getApiErrorMessage } from "@gopvp/admin/src/utils/api";
import { useToast } from "@gopvp/admin/src/context/ToastContext";
import type {
 TAdminRetryModalProps,
 TAdminRetryResponse,
} from "@gopvp/admin/src/types";

export default function RetryProblemModal({
 issueId,
 onClose,
 onDone,
 onNotFixed,
}: TAdminRetryModalProps) {
 const showToast = useToast();
 const [isRetrying, setIsRetrying] = useState(false);

 const handleRetry = async () => {
  if (isRetrying) return;
  setIsRetrying(true);
  try {
   const response = await adminApiCall<TAdminRetryResponse>(
    "POST",
    `${ADMIN_ENDPOINTS.ISSUES}/${issueId}/retry`,
   );
   if (response.fixed) onDone();
   else onNotFixed();
   onClose();
  } catch (error) {
   showToast({
    toastMessage: getApiErrorMessage(error),
    toastVariant: "error",
   });
  } finally {
   setIsRetrying(false);
  }
 };

 return (
  <CustomModal
   open
   onClose={onClose}
   title={retryTitleText}
   customClass="admin-modal"
  >
   <Text customClass="admin-page-hint">{retryHintText}</Text>
   <Box customClass="modal-actions">
    <Button customClass="admin-btn" onClick={onClose}>
     {cancelText}
    </Button>
    <Button
     customClass="admin-btn primary"
     isLoading={isRetrying}
     onClick={handleRetry}
    >
     {retryText}
    </Button>
   </Box>
  </CustomModal>
 );
}
