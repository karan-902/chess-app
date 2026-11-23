import { useState } from "react";
import type { FormEvent } from "react";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Input from "@gopvp/common/src/components/Input/Input";
import Button from "@gopvp/common/src/components/Button/Button";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
import CustomModal from "@gopvp/common/src/components/Modal/Modal";
import { CustomTab, CustomTabs } from "@gopvp/common/src/components/Tabs/Tabs";
import { formatAmount } from "@gopvp/common/src/util/format";
import {
 ADMIN_ENDPOINTS,
 ADMIN_LEDGER_BALANCE,
 ADMIN_LEDGER_DIRECTION,
 ADMIN_RECORD_KIND,
} from "@gopvp/admin/src/constants/endpoint";
import { MAX_ADJUSTMENT_USD } from "@gopvp/admin/src/constants/limit";
import { ADJUST_USER_REQUIRED_ISSUE_TYPES } from "@gopvp/admin/src/constants/mapper";
import {
 ADJUST_BALANCE_OPTIONS,
 ADJUST_DIRECTION_OPTIONS,
} from "@gopvp/admin/src/constants/option";
import {
 adjustHintText,
 adjustTitleText,
 amountPlaceholderText,
 amountRangeText,
 amountText,
 backText,
 balanceChangeText,
 balanceLabelText,
 cancelText,
 confirmAdjustTitleText,
 confirmText,
 continueText,
 playerText,
 reasonPlaceholderText,
 reasonText,
 userIdPlaceholderText,
 userIdText,
} from "@gopvp/admin/src/constants/message";
import { adminApiCall, getApiErrorMessage } from "@gopvp/admin/src/utils/api";
import { useToast } from "@gopvp/admin/src/context/ToastContext";
import ErrorNotice from "@gopvp/admin/src/components/ErrorNotice";
import FieldList from "@gopvp/admin/src/components/FieldList";
import type {
 TAdminAdjustBody,
 TAdminAdjustModalProps,
 TAdminDepositDetail,
 TAdminIssue,
 TAdminIssueRecord,
 TAdminPlayerDetail,
 TAdminWithdrawDetail,
} from "@gopvp/admin/src/types";

const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;

const loadRecordUserId = async ({ kind, id }: TAdminIssueRecord) =>
 kind === ADMIN_RECORD_KIND.DEPOSIT
  ? (
     await adminApiCall<TAdminDepositDetail>(
      "GET",
      `${ADMIN_ENDPOINTS.DEPOSITS}/${id}`,
     )
    ).deposit.user.id
  : (
     await adminApiCall<TAdminWithdrawDetail>(
      "GET",
      `${ADMIN_ENDPOINTS.WITHDRAWS}/${id}`,
     )
    ).withdraw.user.id;

export default function AdjustProblemModal({
 issueId,
 issueType,
 record,
 onClose,
 onDone,
}: TAdminAdjustModalProps) {
 const showToast = useToast();
 const [step, setStep] = useState<"form" | "confirm">("form");
 const [direction, setDirection] = useState<string>(
  ADMIN_LEDGER_DIRECTION.CREDIT,
 );
 const [purpose, setPurpose] = useState<string>(ADMIN_LEDGER_BALANCE.PLAYABLE);
 const [amount, setAmount] = useState("");
 const [reason, setReason] = useState("");
 const [userId, setUserId] = useState("");
 const [player, setPlayer] = useState<TAdminPlayerDetail | null>(null);
 const [playerError, setPlayerError] = useState("");
 const [isSaving, setIsSaving] = useState(false);

 const needsUser = ADJUST_USER_REQUIRED_ISSUE_TYPES.has(issueType);
 const amountValue = Number(amount);
 const isAmountValid =
  AMOUNT_PATTERN.test(amount) &&
  amountValue > 0 &&
  amountValue <= MAX_ADJUSTMENT_USD;
 const canContinue =
  isAmountValid && !!reason.trim() && (!needsUser || !!userId.trim());
 const purposeLabel =
  ADJUST_BALANCE_OPTIONS.find(({ value }) => value === purpose)?.label ?? "";
 const before = player
  ? purpose === ADMIN_LEDGER_BALANCE.PLAYABLE
    ? player.balance.playable
    : player.balance.withdrawable
  : 0;
 const after =
  Math.round(
   (direction === ADMIN_LEDGER_DIRECTION.CREDIT
    ? before + amountValue
    : before - amountValue) * 100,
  ) / 100;

 const handleContinue = async (event: FormEvent) => {
  event.preventDefault();
  if (!canContinue) return;
  setStep("confirm");
  setPlayer(null);
  setPlayerError("");
  try {
   const playerId =
    needsUser || !record ? userId.trim() : await loadRecordUserId(record);
   setPlayer(
    await adminApiCall<TAdminPlayerDetail>(
     "GET",
     `${ADMIN_ENDPOINTS.PLAYERS}/${playerId}`,
    ),
   );
  } catch (error) {
   console.error(error);
   setPlayerError(getApiErrorMessage(error));
  }
 };

 const handleConfirm = async () => {
  if (isSaving) return;
  setIsSaving(true);
  try {
   await adminApiCall<TAdminIssue, TAdminAdjustBody>(
    "POST",
    `${ADMIN_ENDPOINTS.ISSUES}/${issueId}/adjust`,
    {
     direction,
     purpose,
     amount: amountValue,
     reason: reason.trim(),
     user_id: needsUser ? userId.trim() : undefined,
    },
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

 if (step === "confirm")
  return (
   <CustomModal
    open
    onClose={onClose}
    title={confirmAdjustTitleText}
    customClass="admin-modal"
   >
    {playerError && <ErrorNotice message={playerError} />}
    {!player && !playerError && (
     <Box customClass="admin-modal-skeleton">
      <Skeleton width="60%" />
      <Skeleton width="80%" />
     </Box>
    )}
    {player && (
     <FieldList
      fields={[
       {
        label: playerText,
        value: player.player.username,
        sub: player.player.email,
       },
       {
        label: balanceLabelText(purposeLabel),
        value: balanceChangeText(formatAmount(before), formatAmount(after)),
        tone: after < 0 ? "danger" : undefined,
       },
       { label: reasonText, value: reason.trim() },
      ]}
     />
    )}
    <Box customClass="modal-actions">
     <Button customClass="admin-btn" onClick={() => setStep("form")}>
      {backText}
     </Button>
     <Button
      customClass="admin-btn primary"
      isLoading={isSaving}
      disabled={!player || after < 0}
      onClick={handleConfirm}
     >
      {confirmText}
     </Button>
    </Box>
   </CustomModal>
  );

 return (
  <CustomModal
   open
   onClose={onClose}
   title={adjustTitleText}
   customClass="admin-modal"
  >
   <Text customClass="admin-page-hint">{adjustHintText}</Text>
   <form onSubmit={handleContinue}>
    <CustomTabs
     customClass="admin-range"
     value={direction}
     onChange={(_, value: string) => setDirection(value)}
    >
     {ADJUST_DIRECTION_OPTIONS.map(({ value, label }) => (
      <CustomTab key={value} value={value} label={label} />
     ))}
    </CustomTabs>
    <CustomTabs
     customClass="admin-range"
     value={purpose}
     onChange={(_, value: string) => setPurpose(value)}
    >
     {ADJUST_BALANCE_OPTIONS.map(({ value, label }) => (
      <CustomTab key={value} value={value} label={label} />
     ))}
    </CustomTabs>
    <Input
     id="adjust-amount"
     type="number"
     inputMode="decimal"
     step="0.01"
     min="0.01"
     max={MAX_ADJUSTMENT_USD}
     label={amountText}
     placeholder={amountPlaceholderText(formatAmount(MAX_ADJUSTMENT_USD))}
     customClass="form-input"
     value={amount}
     onChange={(event) => setAmount(event.target.value)}
     isError={!!amount && !isAmountValid}
     helperText={amountRangeText(formatAmount(MAX_ADJUSTMENT_USD))}
     autoFocus
     required
     fullWidth
    />
    <Input
     id="adjust-reason"
     label={reasonText}
     placeholder={reasonPlaceholderText}
     customClass="form-input"
     value={reason}
     onChange={(event) => setReason(event.target.value)}
     required
     fullWidth
    />
    {needsUser && (
     <Input
      id="adjust-user"
      label={userIdText}
      placeholder={userIdPlaceholderText}
      customClass="form-input"
      value={userId}
      onChange={(event) => setUserId(event.target.value)}
      required
      fullWidth
     />
    )}
    <Box customClass="modal-actions">
     <Button customClass="admin-btn" onClick={onClose}>
      {cancelText}
     </Button>
     <Button
      type="submit"
      customClass="admin-btn primary"
      disabled={!canContinue}
     >
      {continueText}
     </Button>
    </Box>
   </form>
  </CustomModal>
 );
}
