import { useEffect, useState } from "react";
import classNames from "classnames";
import { CircularProgress } from "@mui/material";
import { useReduxDispatch } from "@/redux/hooks";
import { showToast } from "@/redux/common/common.slice";
import Box from "@/components/base/Box/Box";
import SuccessCheckmark from "@/components/base/SuccessCheckmark/SuccessCheckmark";
import { walletSuccessLottie, walletTickLottie } from "@/components/images";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import Label from "@/components/base/Label/Label";
import Input from "@/components/base/Input/Input";
import Select from "@/components/base/Select/Select";
import { useWalletActionModal } from "@/context/WalletActionModalContext";
import { useWalletBalance } from "@/hooks/useWallet";
import { withdrawRequest } from "@/hooks/useWallet";
import { useModalReady } from "@/hooks/useModalReady";
import { formatAmount } from "@/utils/format";
import type { WithdrawMethod } from "@/types/utils";
import {
 withdrawModalTitle,
 withdrawModalWithdrawableCaveat,
 withdrawModalMethodLabel,
 withdrawModalDestinationLabel,
 withdrawModalDestinationPlaceholder,
 withdrawModalMethodOptions,
 withdrawModalSubmitButton,
 withdrawModalInvalidAmount,
 withdrawModalMinAmountError,
 withdrawModalExceedsBalance,
 withdrawModalInvalidDestination,
 withdrawModalFailed,
 withdrawModalSuccessTitle,
 walletPageWithdrawableLabel,
 depositModalAmountLabel,
 MIN_TRANSACTION_USD,
} from "@/constants/messages";
import Modal from "@/components/base/Modal/Modal";

type Stage = "amount" | "success";
const MAX_AMOUNT_DIGITS = 4;

export default function WithdrawModal() {
 const dispatch = useReduxDispatch();
 const { openModal, close } = useWalletActionModal();
 const { withdrawableUsd, refetch } = useWalletBalance();
 const open = openModal === "withdraw";
 const ready = useModalReady(open);

 const [stage, setStage] = useState<Stage>("amount");
 const [amount, setAmount] = useState("");
 const [method, setMethod] = useState<WithdrawMethod>(
  withdrawModalMethodOptions[0].value,
 );
 const [destination, setDestination] = useState("");
 const [submitting, setSubmitting] = useState(false);

 useEffect(() => {
  if (open) return;
  setStage("amount");
  setAmount("");
  setMethod(withdrawModalMethodOptions[0].value);
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
    ? withdrawModalExceedsBalance
    : isZeroAmount
      ? withdrawModalInvalidAmount
      : isBelowMin
        ? withdrawModalMinAmountError(MIN_TRANSACTION_USD)
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
     message: withdrawModalInvalidDestination,
     severity: "error",
    }),
   );
   return;
  }
  setSubmitting(true);
  try {
   await withdrawRequest(amountUsd, destination.trim());
   refetch();
   setStage("success");
  } catch (err: any) {
   dispatch(
    showToast({
     message: err?.response?.data?.message ?? withdrawModalFailed,
     severity: "error",
    }),
   );
  } finally {
   setSubmitting(false);
  }
 };

 return (
  <Modal
   open={open}
   onClose={close}
   hideCloseIcon={stage === "success"}
   disableRestoreFocus={stage === "success"}
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
    <Box customClass="deposit-amount-stage">
     <Text customClass="deposit-heading value-heading">
      {withdrawModalTitle}
     </Text>

     <Box customClass="withdraw-available">
      <Text customClass="withdraw-available-label meta-text">
       {walletPageWithdrawableLabel}
      </Text>
      <Text customClass="withdraw-available-amt">
       {formatAmount(withdrawableUsd)}
      </Text>
      <Text customClass="withdraw-available-caveat meta-text">
       {withdrawModalWithdrawableCaveat}
      </Text>
     </Box>

     <Box customClass="auth-field hero-input-wrapper">
      <Label htmlFor="withdraw-amount">{depositModalAmountLabel}</Label>
      <Input
       id="withdraw-amount"
       type="text"
       inputMode="decimal"
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

     <Box customClass="auth-field">
      <Label htmlFor="withdraw-method">{withdrawModalMethodLabel}</Label>
      <Select
       value={method}
       onChange={(value) => setMethod(value as WithdrawMethod)}
       options={withdrawModalMethodOptions}
       disabled={submitting || !hasWithdrawable}
      />
     </Box>

     <Box customClass="auth-field">
      <Label htmlFor="withdraw-destination">
       {withdrawModalDestinationLabel}
      </Label>
      <Input
       id="withdraw-destination"
       type="text"
       fullWidth
       customClass="wallet-input"
       placeholder={withdrawModalDestinationPlaceholder}
       value={destination}
       onChange={(e) => setDestination(e.target.value)}
       disabled={submitting || !hasWithdrawable}
      />
     </Box>

     <Button
      type="submit"
      fullWidth
      variant="contained"
      customClass="deposit-generate-btn"
      onClick={handleWithdraw}
      isLoading={submitting}
      disabled={!canSubmit || submitting}
     >
      {withdrawModalSubmitButton}
     </Button>
    </Box>
   )}

   {ready && stage === "success" && (
    <Box customClass="deposit-success-stage">
     <Box customClass="deposit-success-icon">
      <SuccessCheckmark
       confettiLottieSrc={walletSuccessLottie}
       tickLottieSrc={walletTickLottie}
      />
     </Box>
     <Box customClass="deposit-sucess-amountWrapper">
      <Text customClass="deposit-success-amount">
       {formatAmount(amountUsd)}
      </Text>
      <Text customClass="deposit-heading value-heading">
       {withdrawModalSuccessTitle}
      </Text>
     </Box>
    </Box>
   )}
  </Modal>
 );
}
