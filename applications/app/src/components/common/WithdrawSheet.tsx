import { useEffect, useState } from "react";
import { useReduxDispatch, useReduxSelector } from "@gopvp/app/src/redux/hooks";
import { showToast } from "@gopvp/app/src/redux/common/slice";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import Input from "@gopvp/common/src/components/Input/Input";
import WalletSheetShell from "@gopvp/app/src/components/common/WalletSheetShell";
import WalletSuccessStage from "@gopvp/app/src/components/common/WalletSuccessStage";
import WalletInfoNote from "@gopvp/app/src/components/common/WalletInfoNote";
import { useWalletModal } from "@gopvp/app/src/context/WalletModalContext";
import { useSocket } from "@gopvp/app/src/context/SocketContext";
import type { ITransactionCompletedEvent } from "@gopvp/common/src/types/response";
import { SOCKET_EVENTS } from "@gopvp/common/src/constants/event";
import {
 useWalletBalance,
 withdrawRequest,
} from "@gopvp/app/src/hooks/useWallet";
import { showApiErrorToast } from "@gopvp/common/src/util/api";
import {
 withdrawText,
 onlyWinningsWithdrawableText,
 destinationText,
 btcAddressOrInvoiceText,
 requestWithdrawalText,
 maxWithdrawalAmountText,
 insufficientWithdrawableText,
 enterDestinationText,
 withdrawalCompletedText,
 enterAmountText,
} from "@gopvp/app/src/constants/message";
import {
 MAX_WITHDRAW_USD,
 MAX_AMOUNT_INPUT_USD,
} from "@gopvp/app/src/constants/limit";
import { sanitizeAmountInput } from "@gopvp/app/src/utils";

type Stage = "amount" | "success";

export default function WithdrawSheet() {
 const dispatch = useReduxDispatch();
 const { openModal, close } = useWalletModal();
 const { socket } = useSocket();
 const { withdrawableUsd, refetch } = useWalletBalance();
 const speedLightningAddress = useReduxSelector(
  (state) => state.speed.lightningAddress,
 );
 const open = openModal === "withdraw";

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
  if (!open || !socket) return;
  const onCompleted = (data: ITransactionCompletedEvent) => {
   if (data.type === "WITHDRAW") setStage("success");
  };
  socket.on(SOCKET_EVENTS.TRANSACTION_COMPLETED, onCompleted);
  return () => {
   socket.off(SOCKET_EVENTS.TRANSACTION_COMPLETED, onCompleted);
  };
 }, [open, socket]);

 const hasWithdrawable = withdrawableUsd > 0;
 const amountUsd = parseFloat(amount) || 0;
 const exceedsBalance =
  Math.round(amountUsd * 100) > Math.round(withdrawableUsd * 100);
 const amountError = submitting
  ? undefined
  : exceedsBalance
    ? insufficientWithdrawableText
    : amountUsd > MAX_WITHDRAW_USD
      ? maxWithdrawalAmountText(MAX_WITHDRAW_USD)
      : undefined;
 const withdrawDestination = (speedLightningAddress || destination).trim();
 const canSubmit =
  hasWithdrawable && amount !== "" && !amountError && withdrawDestination !== "";

 const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const nextAmount = sanitizeAmountInput(e.target.value, MAX_AMOUNT_INPUT_USD);
  if (nextAmount !== null) setAmount(nextAmount);
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
   const { status } = await withdrawRequest(amountUsd, withdrawDestination);
   if (status === "PROCESSING") close();
  } catch (err) {
   showApiErrorToast(err);
  } finally {
   setSubmitting(false);
  }
 };

 return (
  <WalletSheetShell open={open} isSuccess={stage === "success"} onClose={close}>
   {stage === "amount" && (
    <Box customClass="wallet-modal-layout">
     <Text customClass="modal-heading value-heading">{withdrawText}</Text>
     <WalletInfoNote text={onlyWinningsWithdrawableText} />

     <Box customClass="hero-input-wrapper">
      <Input
       id="withdraw-amount"
       type="text"
       inputMode="decimal"
       autoComplete="off"
       label={enterAmountText}
       labelClassName="wallet-label"
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

     {!speedLightningAddress && (
      <Input
       id="withdraw-destination"
       type="text"
       label={destinationText}
       fullWidth
       customClass="wallet-input gold-foil"
       placeholder={btcAddressOrInvoiceText}
       value={destination}
       onChange={(e) => setDestination(e.target.value)}
       disabled={submitting || !hasWithdrawable}
      />
     )}

     <Button
      type="submit"
      fullWidth
      variant="contained"
      customClass="modal-submit-btn gold-foil shine"
      onClick={handleWithdraw}
      isLoading={submitting}
      disabled={!canSubmit || submitting}
     >
      {requestWithdrawalText}
     </Button>
    </Box>
   )}

   {stage === "success" && (
    <WalletSuccessStage amountUsd={amountUsd} title={withdrawalCompletedText} />
   )}
  </WalletSheetShell>
 );
}
