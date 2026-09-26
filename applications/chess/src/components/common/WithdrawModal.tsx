import { useEffect, useState } from "react";
import classNames from "classnames";
import { CircularProgress } from "@mui/material";
import { useReduxDispatch } from "@/redux/hooks";
import { showToast } from "@/redux/common/slice";
import Box from "@/components/base/Box/Box";
import SuccessCheckmark from "@/components/base/SuccessCheckmark/SuccessCheckmark";
import { InfoIcon } from "@/components/base/images";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import Input from "@/components/base/Input/Input";
import { useWalletActionModal } from "@/context/WalletActionModalContext";
import { useWalletBalance } from "@/hooks/useWallet";
import { withdrawRequest } from "@/hooks/useWallet";
import { useModalReady } from "@/hooks/useModalReady";
import { formatAmount } from "@/utils/format";
import { showApiErrorToast } from "@/utils";
import {
 withdrawText,
 onlyWinningsWithdrawableText,
 destinationText,
 btcAddressOrInvoiceText,
 requestWithdrawalText,
 enterValidAmountText,
 minWithdrawalAmountText,
 insufficientWithdrawableText,
 enterDestinationText,
 withdrawalFailedText,
 withdrawalCompletedText,
 enterAmountText,
 MIN_TRANSACTION_USD,
} from "@/constants/messages";
import CustomModal from "@/components/base/Modal/Modal";

type Stage = "amount" | "success";
const MAX_AMOUNT_DIGITS = 2;

export default function WithdrawModal() {
 const dispatch = useReduxDispatch();
 const { openModal, close } = useWalletActionModal();
 const { withdrawableUsd, refetch } = useWalletBalance();
 const open = openModal === "withdraw";
 const ready = useModalReady(open);

 const [stage, setStage] = useState<Stage>("amount");
 const [amount, setAmount] = useState("");

 const [destination, setDestination] = useState("");
 const [submitting, setSubmitting] = useState(false);

 useEffect(() => {
  if (open) return;
  setStage("amount");
  setAmount("");

  setDestination("");
  setSubmitting(false);
 }, [open]);

 useEffect(() => {
  if (!open) return;
  refetch();
 }, [open, refetch]);

 useEffect(() => {
  if (stage !== "success") return;
  const timer = setTimeout(close, 2800);
  return () => clearTimeout(timer);
 }, [stage, close]);

 const hasWithdrawable = withdrawableUsd > 0;
 const amountUsd = parseFloat(amount) || 0;
 const exceedsBalance =
  Math.round(amountUsd * 100) > Math.round(withdrawableUsd * 100);
 const isZeroAmount = amount !== "" && amountUsd <= 0;
 const isBelowMin =
  amount !== "" && amountUsd > 0 && amountUsd < MIN_TRANSACTION_USD;
 const amountError = submitting
  ? undefined
  : exceedsBalance
    ? insufficientWithdrawableText
    : isZeroAmount
      ? enterValidAmountText
      : isBelowMin
        ? minWithdrawalAmountText(MIN_TRANSACTION_USD)
        : undefined;
 const canSubmit =
  hasWithdrawable && amount !== "" && !amountError && destination.trim() !== "";

 const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  let val = e.target.value.replace(/[^0-9.]/g, "");
  if (val.startsWith(".")) val = val.slice(1);
  val = val.replace(/^0+(?=\d)/, "");
  const parts = val.split(".");
  if (parts.length > 2) val = parts[0] + "." + parts.slice(1).join("");
  setAmount(val);
 };

 const handleWithdraw = async () => {
  if (!destination.trim()) {
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
   await withdrawRequest(amountUsd, destination.trim());
   refetch();
   setStage("success");
   dispatch(
    showToast({
     isToastOpen: true,
     toastMessage: withdrawalCompletedText,
     toastVariant: "success",
    }),
   );
  } catch (err) {
   showApiErrorToast(err, withdrawalFailedText);
  } finally {
   setSubmitting(false);
  }
 };

 return (
  <CustomModal
   open={open}
   onClose={close}
   hideCloseIcon={stage === "success"}
   disableRestoreFocus
   customClass={classNames(
    "wallet-modal",
    stage === "success" && "wallet-modal-success",
   )}
  >
   {!ready && (
    <Box customClass="modal-loader">
     <CircularProgress size={28} />
    </Box>
   )}

   {ready && stage === "amount" && (
    <Box customClass="wallet-modal-layout">
     <Text customClass="modal-heading value-heading">{withdrawText}</Text>
     <Box customClass="modal-info-box">
      <InfoIcon sx={{ fontSize: 16 }} />
      <Text customClass="modal-info-text caption">
       {onlyWinningsWithdrawableText}
      </Text>
     </Box>

     <Box customClass="hero-input-wrapper">
      <Input
       id="withdraw-amount"
       type="text"
       inputMode="decimal"
       label={enterAmountText}
       slotProps={{
        input: { maxLength: MAX_AMOUNT_DIGITS },
       }}
       fullWidth
       placeholder="0.00"
       customClass="amount-input-hero"
       value={amount}
       onChange={handleAmountChange}
       disabled={submitting || !hasWithdrawable}
       isError={!!amountError}
       helperText={amountError}
      />
     </Box>

     <Input
      id="withdraw-destination"
      type="text"
      label={destinationText}
      fullWidth
      customClass="wallet-input"
      placeholder={btcAddressOrInvoiceText}
      value={destination}
      onChange={(e) => setDestination(e.target.value)}
      disabled={submitting || !hasWithdrawable}
     />

     <Button
      type="submit"
      fullWidth
      variant="contained"
      customClass="modal-submit-btn"
      onClick={handleWithdraw}
      isLoading={submitting}
      disabled={!canSubmit || submitting}
     >
      {requestWithdrawalText}
     </Button>
    </Box>
   )}

   {ready && stage === "success" && (
    <Box customClass="modal-success-stage">
     <Box customClass="modal-success-icon">
      <SuccessCheckmark />
     </Box>
     <Box customClass="deposit-sucess-amountWrapper">
      <Text customClass="modal-success-amount">{formatAmount(amountUsd)}</Text>
      <Text customClass="modal-heading value-heading">
       {withdrawalCompletedText}
      </Text>
     </Box>
    </Box>
   )}
  </CustomModal>
 );
}
