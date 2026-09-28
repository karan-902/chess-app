import { useEffect, useState } from "react";
import { useReduxDispatch } from "@gopvp/app/src/redux/hooks";
import { showToast } from "@gopvp/app/src/redux/common/slice";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import Input from "@gopvp/common/src/components/Input/Input";
import WalletSheetShell from "@gopvp/app/src/components/common/WalletSheetShell";
import WalletSuccessStage from "@gopvp/app/src/components/common/WalletSuccessStage";
import WalletInfoNote from "@gopvp/app/src/components/common/WalletInfoNote";
import { useWalletModal } from "@gopvp/app/src/context/WalletModalContext";
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
 enterValidAmountText,
 minWithdrawalAmountText,
 insufficientWithdrawableText,
 enterDestinationText,
 withdrawalCompletedText,
 enterAmountText,
} from "@gopvp/app/src/constants/message";
import {
 MIN_TRANSACTION_USD,
 MAX_AMOUNT_DIGITS,
} from "@gopvp/app/src/constants/limit";

type Stage = "amount" | "success";

export default function WithdrawSheet() {
 const dispatch = useReduxDispatch();
 const { openModal, close } = useWalletModal();
 const { withdrawableUsd, refetch } = useWalletBalance();
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

   {stage === "success" && (
    <WalletSuccessStage amountUsd={amountUsd} title={withdrawalCompletedText} />
   )}
  </WalletSheetShell>
 );
}
