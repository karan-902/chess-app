import { useEffect, useState } from "react";
import classNames from "classnames";
import { QRCodeSVG } from "qrcode.react";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import Input from "@gopvp/common/src/components/Input/Input";
import CopyButton from "@gopvp/app/src/components/common/CopyButton";
import { speedLogo, qrLogo } from "@gopvp/common/src/components/images";
import WalletSheetShell from "@gopvp/app/src/components/common/WalletSheetShell";
import WalletSuccessStage from "@gopvp/app/src/components/common/WalletSuccessStage";
import WalletInfoNote from "@gopvp/app/src/components/common/WalletInfoNote";
import { useWalletModal } from "@gopvp/app/src/context/WalletModalContext";
import { useSocket } from "@gopvp/app/src/context/SocketContext";
import { paymentRequest } from "@gopvp/app/src/hooks/useWallet";
import { getApiErrorResponse } from "@gopvp/common/src/util/api";
import type {
 IPaymentRequestResponse,
 ITransactionCompletedEvent,
} from "@gopvp/common/src/types/response";
import {
 depositText,
 depositingAmountText,
 fastSecuredTransparentText,
 buyCryptoInstantlyText,
 enterAmountText,
 generateQrCodeText,
 amountRequiredText,
 maxDepositAmountText,
 btcOnlyWarningText,
 scanToDepositText,
 expiresInText,
 qrExpiredText,
 paymentReceivedText,
 depositsNotWithdrawableText,
 speedText,
} from "@gopvp/app/src/constants/message";
import { MAX_DEPOSIT_USD } from "@gopvp/app/src/constants/limit";
import { DEPOSIT_CHIP_AMOUNTS } from "@gopvp/app/src/constants/option";
import { sanitizeAmountInput } from "@gopvp/app/src/utils";
import { backText } from "@gopvp/common/src/constants/message";
import CustomIconButton from "@gopvp/common/src/components/IconButton/IconButton";
import {
 QR_BACKGROUND_COLOR,
 QR_FOREGROUND_COLOR,
} from "@gopvp/app/src/constants/color";
import { SOCKET_EVENTS } from "@gopvp/common/src/constants/event";

type Stage = "amount" | "qr" | "success";

function formatCountdown(ms: number) {
 const totalSeconds = Math.max(0, Math.floor(ms / 1000));
 const minutes = Math.floor(totalSeconds / 60);
 const seconds = totalSeconds % 60;
 return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function DepositSheet() {
 const { openModal, close } = useWalletModal();
 const { socket } = useSocket();
 const open = openModal === "deposit";

 const [stage, setStage] = useState<Stage>("amount");
 const [amount, setAmount] = useState("");
 const [amountError, setAmountError] = useState("");
 const [submitting, setSubmitting] = useState(false);
 const [payment, setPayment] = useState<IPaymentRequestResponse | null>(null);
 const [remainingMs, setRemainingMs] = useState(0);
 const [expired, setExpired] = useState(false);

 useEffect(() => {
  if (open) return;
  setStage("amount");
  setAmount("");
  setAmountError("");
  setSubmitting(false);
  setPayment(null);
  setExpired(false);
 }, [open]);

 useEffect(() => {
  if (stage !== "qr" || !payment?.ttl) return;

  const deadline = Date.now() + payment.ttl * 1000;
  const tick = () => {
   const left = deadline - Date.now();
   setRemainingMs(Math.max(0, left));
   if (left <= 0) setExpired(true);
  };

  tick();
  const interval = setInterval(tick, 1000);
  return () => clearInterval(interval);
 }, [stage, payment]);

 useEffect(() => {
  if (stage !== "qr" || !socket) return;
  const onCompleted = (data: ITransactionCompletedEvent) => {
   if (data.type === "DEPOSIT") setStage("success");
  };
  socket.on(SOCKET_EVENTS.TRANSACTION_COMPLETED, onCompleted);
  return () => {
   socket.off(SOCKET_EVENTS.TRANSACTION_COMPLETED, onCompleted);
  };
 }, [stage, socket]);

 const amountUsd = Number(amount);
 const isAmountInvalid = !amount || Number.isNaN(amountUsd);

 const handleGenerate = async () => {
  if (!amount) {
   setAmountError(amountRequiredText);
   return;
  }
  if (amountUsd > MAX_DEPOSIT_USD) {
   setAmountError(maxDepositAmountText(MAX_DEPOSIT_USD));
   return;
  }
  setAmountError("");
  setSubmitting(true);

  try {
   const res = await paymentRequest(amountUsd);
   setPayment(res);
   setExpired(false);
   setStage("qr");
  } catch (err) {
   setAmountError(getApiErrorResponse(err)?.data?.message ?? "");
  } finally {
   setSubmitting(false);
  }
 };

 const address = payment?.payment_request;

 return (
  <WalletSheetShell open={open} isSuccess={stage === "success"} onClose={close}>
   {stage === "amount" && (
    <Box customClass="wallet-modal-layout">
     <Text customClass="modal-heading value-heading">{depositText}</Text>
     <WalletInfoNote text={depositsNotWithdrawableText} />

     <Box customClass="hero-input-wrapper">
      <Input
       id="deposit-amount"
       type="text"
       inputMode="decimal"
       autoComplete="off"
       label={enterAmountText}
       labelClassName="wallet-label"
       fullWidth
       disabled={submitting}
       placeholder="0.00"
       customClass="amount-input-hero"
       value={amount}
       onChange={(e) => {
        const nextAmount = sanitizeAmountInput(e.target.value, MAX_DEPOSIT_USD);
        if (nextAmount !== null) setAmount(nextAmount);
       }}
       isError={!!amountError}
       helperText={amountError}
      />
     </Box>
     <Box customClass="tx-filter-chip-grid deposit-amount-chips">
      {DEPOSIT_CHIP_AMOUNTS.map((chipAmount) => (
       <Button
        key={chipAmount}
        type="button"
        disabled={submitting}
        customClass={classNames(
         "tx-filter-chip",
         amount === String(chipAmount) && "active",
        )}
        onClick={() => {
         setAmount(String(chipAmount));
         setAmountError("");
        }}
       >
        ${chipAmount}
       </Button>
      ))}
     </Box>
     <Box customClass="deposit-speed-wrapper">
      <Box customClass="deposit-speed-badge">
       <Text component="span">{buyCryptoInstantlyText}</Text>
       <img src={speedLogo} alt={speedText} className="deposit-speed-logo" />
      </Box>
      <Text customClass="deposit-tagline meta-text">
       {fastSecuredTransparentText}
      </Text>
     </Box>

     <Button
      type="submit"
      fullWidth
      variant="contained"
      customClass="modal-submit-btn gold-foil shine"
      onClick={handleGenerate}
      isLoading={submitting}
      disabled={isAmountInvalid}
     >
      {generateQrCodeText}
     </Button>
    </Box>
   )}

   {stage === "qr" && payment && (
    <Box customClass="deposit-qr-stage">
     <Box customClass="deposit-qr-header">
      <CustomIconButton
       customClass="deposit-qr-back-btn"
       onClick={() => setStage("amount")}
       aria-label={backText}
       icon="arrowLeft"
      />
      <Text customClass="modal-heading value-heading">
       {depositingAmountText(amountUsd)}
      </Text>
     </Box>

     <WalletInfoNote text={btcOnlyWarningText} />

     <Text customClass="deposit-scan-hint caption">{scanToDepositText}</Text>

     <Box customClass="deposit-qr-wrap">
      <QRCodeSVG
       value={address ?? ""}
       size={300}
       bgColor={QR_BACKGROUND_COLOR}
       fgColor={QR_FOREGROUND_COLOR}
       marginSize={2}
       imageSettings={{
        src: qrLogo,
        height: 50,
        width: 50,
        excavate: true,
       }}
      />
     </Box>

     <Box customClass="deposit-address-row">
      <Text customClass="deposit-address">{address}</Text>
      <CopyButton text={payment.payment_request} />
     </Box>

     <Text
      customClass={classNames("deposit-timer", "caption", expired && "expired")}
     >
      {expired ? qrExpiredText : expiresInText(formatCountdown(remainingMs))}
     </Text>
    </Box>
   )}

   {stage === "success" && (
    <WalletSuccessStage amountUsd={amountUsd} title={paymentReceivedText} />
   )}
  </WalletSheetShell>
 );
}
