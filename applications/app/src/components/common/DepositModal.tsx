import { useEffect, useState } from "react";
import classNames from "classnames";
import { CircularProgress } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import CustomModal from "@gopvp/common/src/components/Modal/Modal";
import SuccessCheckmark from "@gopvp/common/src/components/SuccessCheckmark/SuccessCheckmark";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import Input from "@gopvp/common/src/components/Input/Input";
import { Info, speedLogo, qrLogo } from "@gopvp/common/src/components/images";
import { useWalletModal } from "@gopvp/app/src/context/WalletModalContext";
import { useSocket } from "@gopvp/app/src/context/SocketContext";
import { paymentRequest } from "@gopvp/app/src/hooks/useWallet";
import { useModalReady } from "@gopvp/app/src/hooks/useModalReady";
import { formatAmount } from "@gopvp/common/src/util/format";
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
 minDepositAmountText,
 maxDepositAmountText,
 btcOnlyWarningText,
 scanToDepositText,
 copyText,
 copiedText,
 expiresInText,
 qrExpiredText,
 paymentReceivedText,
 depositsNotWithdrawableText,
} from "@gopvp/app/src/constants/message";
import {
 MAX_AMOUNT_DIGITS,
 MIN_TRANSACTION_USD,
 MAX_DEPOSIT_USD,
} from "@gopvp/app/src/constants/limit";
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

export default function DepositModal() {
 const { openModal, close } = useWalletModal();
 const { socket } = useSocket();
 const open = openModal === "deposit";
 const ready = useModalReady(open);

 const [stage, setStage] = useState<Stage>("amount");
 const [amount, setAmount] = useState("");
 const [amountError, setAmountError] = useState("");
 const [submitting, setSubmitting] = useState(false);
 const [payment, setPayment] = useState<IPaymentRequestResponse | null>(null);
 const [copied, setCopied] = useState(false);
 const [remainingMs, setRemainingMs] = useState(0);
 const [expired, setExpired] = useState(false);

 useEffect(() => {
  if (open) return;
  setStage("amount");
  setAmount("");
  setAmountError("");
  setSubmitting(false);
  setPayment(null);
  setCopied(false);
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

 useEffect(() => {
  if (stage !== "success") return;
  const timer = setTimeout(close, 2800);
  return () => clearTimeout(timer);
 }, [stage, close]);

 const amountUsd = Number(amount);
 const isAmountInvalid =
  !amount ||
  amount.length > MAX_AMOUNT_DIGITS ||
  Number.isNaN(amountUsd) ||
  amountUsd < MIN_TRANSACTION_USD;

 const handleGenerate = async () => {
  if (!amount) {
   setAmountError(amountRequiredText);
   return;
  }
  if (amountUsd < MIN_TRANSACTION_USD) {
   setAmountError(minDepositAmountText(MIN_TRANSACTION_USD));
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
  } catch (err: any) {
   setAmountError(err?.response?.data?.message ?? "");
  } finally {
   setSubmitting(false);
  }
 };

 const address = payment?.payment_request;

 const handleCopy = () => {
  if (!address) return;
  navigator.clipboard.writeText(address);
  setCopied(true);
  setTimeout(() => setCopied(false), 1500);
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
     <Text customClass="modal-heading value-heading">{depositText}</Text>
     <Box customClass="modal-info-box">
      <Info size={16} strokeWidth={2} />
      <Text customClass="modal-info-text caption">
       {depositsNotWithdrawableText}
      </Text>
     </Box>

     <Box customClass="hero-input-wrapper">
      <Input
       id="deposit-amount"
       type="text"
       inputMode="numeric"
       label={enterAmountText}
       labelClassName="deposit-label"
       slotProps={{
        input: { maxLength: MAX_AMOUNT_DIGITS },
       }}
       fullWidth
       disabled={submitting}
       placeholder="0.00"
       customClass="amount-input-hero"
       value={amount}
       onChange={(e) =>
        setAmount(
         e.target.value
          .replace(/\D/g, "")
          .replace(/^0+/, "")
          .slice(0, MAX_AMOUNT_DIGITS),
        )
       }
       isError={!!amountError}
       helperText={amountError}
      />
     </Box>
     <Box customClass="deposit-speed-wrapper">
      <Box customClass="deposit-speed-badge">
       <Text component="span">{buyCryptoInstantlyText}</Text>
       <img src={speedLogo} alt="Speed" className="deposit-speed-logo" />
      </Box>
      <Text customClass="deposit-tagline meta-text">
       {fastSecuredTransparentText}
      </Text>
     </Box>

     <Button
      type="submit"
      fullWidth
      variant="contained"
      customClass="modal-submit-btn"
      onClick={handleGenerate}
      isLoading={submitting}
      disabled={isAmountInvalid}
     >
      {generateQrCodeText}
     </Button>
    </Box>
   )}

   {ready && stage === "qr" && payment && (
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

     <Box customClass="modal-info-box">
      <Info size={16} strokeWidth={2} />
      <Text customClass="modal-info-text caption">{btcOnlyWarningText}</Text>
     </Box>

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
      <Button
       customClass="deposit-copy-btn"
       startIcon={copied ? "check" : "copy"}
       onClick={handleCopy}
      >
       {copied ? copiedText : copyText}
      </Button>
     </Box>

     <Text
      customClass={classNames("deposit-timer", "caption", expired && "expired")}
     >
      {expired ? qrExpiredText : expiresInText(formatCountdown(remainingMs))}
     </Text>
    </Box>
   )}

   {ready && stage === "success" && (
    <Box customClass="modal-success-stage">
     <Box customClass="modal-success-icon">
      <SuccessCheckmark />
     </Box>
     <Box customClass="deposit-success-amountWrapper">
      {" "}
      <Text customClass="modal-success-amount">{formatAmount(amountUsd)}</Text>
      <Text customClass="modal-heading value-heading">
       {paymentReceivedText}
      </Text>
     </Box>
    </Box>
   )}
  </CustomModal>
 );
}
