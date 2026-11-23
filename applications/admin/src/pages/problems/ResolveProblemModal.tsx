import { useState } from "react";
import type { FormEvent } from "react";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Input from "@gopvp/common/src/components/Input/Input";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomModal from "@gopvp/common/src/components/Modal/Modal";
import { ADMIN_ENDPOINTS } from "@gopvp/admin/src/constants/endpoint";
import {
 cancelText,
 markResolvedText,
 notePlaceholderText,
 noteText,
 resolveHintText,
} from "@gopvp/admin/src/constants/message";
import { adminApiCall, getApiErrorMessage } from "@gopvp/admin/src/utils/api";
import { useToast } from "@gopvp/admin/src/context/ToastContext";
import type {
 TAdminIssue,
 TAdminModalProps,
 TAdminResolveBody,
} from "@gopvp/admin/src/types";

export default function ResolveProblemModal({
 issueId,
 onClose,
 onDone,
}: TAdminModalProps) {
 const showToast = useToast();
 const [note, setNote] = useState("");
 const [isSaving, setIsSaving] = useState(false);

 const handleSubmit = async (event: FormEvent) => {
  event.preventDefault();
  if (isSaving || !note.trim()) return;
  setIsSaving(true);
  try {
   await adminApiCall<TAdminIssue, TAdminResolveBody>(
    "PATCH",
    `${ADMIN_ENDPOINTS.ISSUES}/${issueId}/resolve`,
    { note: note.trim() },
   );
   onDone();
   onClose();
  } catch (error) {
   showToast({
    toastMessage: getApiErrorMessage(error),
    toastVariant: "error",
   });
  } finally {
   setIsSaving(false);
  }
 };

 return (
  <CustomModal
   open
   onClose={onClose}
   title={markResolvedText}
   customClass="admin-modal"
  >
   <Text customClass="admin-page-hint">{resolveHintText}</Text>
   <form onSubmit={handleSubmit}>
    <Input
     id="resolve-note"
     label={noteText}
     placeholder={notePlaceholderText}
     customClass="form-input"
     value={note}
     onChange={(event) => setNote(event.target.value)}
     disabled={isSaving}
     autoFocus
     required
     fullWidth
    />
    <Box customClass="modal-actions">
     <Button customClass="admin-btn" onClick={onClose}>
      {cancelText}
     </Button>
     <Button
      type="submit"
      customClass="admin-btn primary"
      isLoading={isSaving}
      disabled={!note.trim()}
     >
      {markResolvedText}
     </Button>
    </Box>
   </form>
  </CustomModal>
 );
}
