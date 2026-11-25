import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { useReduxDispatch, useReduxSelector } from "@gopvp/app/src/redux/hooks";
import { showToast } from "@gopvp/app/src/redux/common/slice";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import Input from "@gopvp/common/src/components/Input/Input";
import WalletSheetShell from "@gopvp/app/src/components/common/WalletSheetShell";
import WalletSuccessStage from "@gopvp/app/src/components/common/WalletSuccessStage";
// import WalletInfoNote from "@gopvp/app/src/components/common/WalletInfoNote";
import { useWalletModal } from "@gopvp/app/src/context/WalletModalContext";
import {
 useWalletBalance,
 withdrawRequest,
} from "@gopvp/app/src/hooks/useWallet";
import {
 getApiErrorResponse,
 showApiErrorToast,
} from "@gopvp/common/src/util/api";
import { ERROR_TYPES } from "@gopvp/common/src/constants/mapper";
import {
 withdrawText,
 withdrawalFailedText,
 // onlyWinningsWithdrawableText,
 destinationText,
 lightningAddressText,
 // requestWithdrawalText,
 maxWithdrawalAmountText,
 insufficientWithdrawableText,
 enterDestinationText,
 withdrawalCompletedText,
 enterAmountText,
} from "@gopvp/app/src/constants/message";
import {
 MAX_WITHDRAW_USD,
 MAX_AMOUNT_INPUT_USD,
 WALLET_LOADER_SIZE,
} from "@gopvp/app/src/constants/limit";
import { sanitizeAmountInput } from "@gopvp/app/src/utils";

type Stage = "amount" | "processing" | "success";

const AMOUNT_ERROR_TYPES: string[] = [
 ERROR_TYPES.AMOUNT_REQUIRED,
 ERROR_TYPES.INVALID_AMOUNT,
 ERROR_TYPES.AMOUNT_BELOW_MINIMUM,
 ERROR_TYPES.AMOUNT_ABOVE_MAXIMUM,
 ERROR_TYPES.DAILY_WITHDRAW_LIMIT_REACHED,
];

export default function WithdrawSheet() {
 const dispatch = useReduxDispatch();
 const { openModal, close } = useWalletModal();
 const { withdrawableUsd, refetch } = useWalletBalance();
 const speedLightningAddress = useReduxSelector(
  (state) => state.speed.lightningAddress,
 );
 const open = openModal === "withdraw";

 const lastTransaction = useReduxSelector(
  (state) => state.wallet.lastTransaction,
 );
 const [stage, setStage] = useState<Stage>("amount");
 const [withdrawId, setWithdrawId] = useState<string | null>(null);
 const [amount, setAmount] = useState("");
 const [amountApiError, setAmountApiError] = useState("");

 const [destination, setDestination] = useState("");
 const [submitting, setSubmitting] = useState(false);
 const [isBalanceLoading, setIsBalanceLoading] = useState(false);

 useEffect(() => {
  if (open) return;
  setStage("amount");
  setWithdrawId(null);
  setAmount("");
  setAmountApiError("");

  setDestination("");
  setSubmitting(false);
 }, [open]);

 useEffect(() => {
  if (stage !== "processing" || lastTransaction?.id !== withdrawId) return;
  if (lastTransaction?.status === "COMPLETED") setStage("success");
  if (lastTransaction?.status === "FAILED") {
   dispatch(
    showToast({
     isToastOpen: true,
     toastMessage: withdrawalFailedText,
     toastVariant: "error",
    }),
   );
   setStage("amount");
  }
 }, [stage, withdrawId, lastTransaction, dispatch]);

 useEffect(() => {
  if (!open) return;
  setIsBalanceLoading(true);
  refetch().finally(() => setIsBalanceLoading(false));
 }, [open, refetch]);

 const hasWithdrawable = withdrawableUsd > 0;
 const amountUsd = parseFloat(amount) || 0;
 const exceedsBalance =
  Math.round(amountUsd * 100) > Math.round(withdrawableUsd * 100);
 const amountError = submitting
  ? undefined
  : amountApiError ||
    (exceedsBalance
     ? insufficientWithdrawableText
     : amountUsd > MAX_WITHDRAW_USD
       ? maxWithdrawalAmountText(MAX_WITHDRAW_USD)
       : undefined);
 const withdrawDestination = (speedLightningAddress || destination).trim();
 const canSubmit =
  hasWithdrawable && amount !== "" && !amountError && withdrawDestination !== "";

 const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const nextAmount = sanitizeAmountInput(e.target.value, MAX_AMOUNT_INPUT_USD);
  if (nextAmount === null) return;
  setAmount(nextAmount);
  setAmountApiError("");
 };

 const handleWithdraw = async () => {
  if (!withdrawDestination) {
   dispatch(
    showToast({
     isToastOpen: true,
     toastMessage: enterDestinationText,
     toastVariant: "error",
    }),
   );
   return;
  }
  setSubmitting(true);
  try {
   const { status, withdraw_id } = await withdrawRequest(
    amountUsd,
    withdrawDestination,
   );
   setWithdrawId(withdraw_id);
   setStage(status === "COMPLETED" ? "success" : "processing");
  } catch (err) {
   const errorData = getApiErrorResponse(err)?.data;
   if (AMOUNT_ERROR_TYPES.includes(errorData?.type ?? ""))
    setAmountApiError(errorData?.message ?? "");
   else showApiErrorToast(err);
  } finally {
   setSubmitting(false);
  }
 };

 return (
  <WalletSheetShell open={open} isSuccess={stage === "success"} onClose={close}>
   {stage === "amount" && (
    <Box customClass="wallet-modal-layout">
     <Text customClass="sheet-title dialog-title">{withdrawText}</Text>
     {/* <WalletInfoNote text={onlyWinningsWithdrawableText} /> */}

     <Box customClass="hero-input-wrapper">
      <Input
       id="withdraw-amount"
       type="text"
       inputMode="decimal"
       autoComplete="off"
       label={enterAmountText}
       labelClassName="wallet-label"
       fullWidth
       placeholder="0"
       customClass="amount-input-hero"
       value={amount}
       onChange={handleAmountChange}
       disabled={submitting || !hasWithdrawable}
       isError={!!amountError}
       helperText={amountError}
      />
     </Box>

     {!speedLightningAddress && (
      <Input
       id="withdraw-destination"
       type="text"
       label={destinationText}
       labelClassName="wallet-field-label"
       fullWidth
       customClass="form-input"
       placeholder={lightningAddressText}
       value={destination}
       onChange={(e) => setDestination(e.target.value)}
       disabled={submitting || !hasWithdrawable}
      />
     )}

     <Button
      type="submit"
      fullWidth
      variant="contained"
      customClass="modal-submit-btn"
      onClick={handleWithdraw}
      isLoading={submitting}
      disabled={!canSubmit || submitting || isBalanceLoading}
     >
      {withdrawText}
     </Button>
    </Box>
   )}

   {stage === "processing" && (
    <Box customClass="modal-success-stage">
     <Box customClass="modal-success-icon">
      <CircularProgress size={WALLET_LOADER_SIZE} />
     </Box>
    </Box>
   )}

   {stage === "success" && (
    <WalletSuccessStage amountUsd={amountUsd} title={withdrawalCompletedText} />
   )}
  </WalletSheetShell>
 );
}
