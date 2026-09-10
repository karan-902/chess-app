import { useEffect, useState } from "react";
import classNames from "classnames";
import { CircularProgress } from "@mui/material";
import {
 Copy,
 Check,
 CheckCircle2,
 Info,
 ArrowLeft,
 X as XIcon,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Modal from "@/components/base/Modal/Modal";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import Label from "@/components/base/Label/Label";
import Input from "@/components/base/Input/Input";
import { speedLogo, qrLogo } from "@/components/images";
import { useWalletActionModal } from "@/context/WalletActionModalContext";
import { useSocket } from "@/context/SocketContext";
import { paymentRequest } from "@/hooks/useWallet";
import { useModalReady } from "@/hooks/useModalReady";
import type { IInitiateDepositResponse } from "@/types/utils";
import type { ITransactionCompletedEvent } from "@/types/types";
import {
 depositModalTitle,
 depositModalDepositingTitle,
 depositModalTagline,
 depositModalHowToLink,
 depositModalSpeedBadge,
 depositModalAmountLabel,
 depositModalGenerateButton,
 depositModalStepsTitle,
 depositModalStepsCloseAriaLabel,
 depositModalStep1Title,
 depositModalStep1Desc,
 depositModalStep2Title,
 depositModalStep2Desc,
 depositModalStep3Title,
 depositModalStep3Desc,
 depositModalStep3Note,
 depositModalStep4Title,
 depositModalStep4Desc,
 depositModalStep4Note,
 depositModalStep5Title,
 depositModalStep5Desc,
 depositModalAmountRequired,
 depositModalMinAmountError,
 depositModalGenerateFailed,
 depositModalBtcOnlyWarning,
 depositModalScanHint,
 depositModalCopyButton,
 depositModalCopied,
 depositModalExpiresIn,
 depositModalExpired,
 depositModalPaymentReceived,
 depositModalPaymentReceivedDesc,
 depositModalCloseLink,
 authLoginBack,
 walletWithdrawableCaveat,
 MAX_AMOUNT_DIGITS,
 MIN_TRANSACTION_USD,
} from "@/constants/messages";
import IconButton from "@/components/base/IconButton/IconButton";

type Stage = "amount" | "qr" | "success";

const STEPS = [
 {
  title: depositModalStep1Title,
  desc: depositModalStep1Desc,
 },
 {
  title: depositModalStep2Title,
  desc: depositModalStep2Desc,
 },
 {
  title: depositModalStep3Title,
  desc: depositModalStep3Desc,
  note: depositModalStep3Note,
 },
 {
  title: depositModalStep4Title,
  desc: depositModalStep4Desc,
  note: depositModalStep4Note,
 },
 {
  title: depositModalStep5Title,
  desc: depositModalStep5Desc,
 },
];

function formatCountdown(ms: number) {
 const totalSeconds = Math.max(0, Math.floor(ms / 1000));
 const minutes = Math.floor(totalSeconds / 60);
 const seconds = totalSeconds % 60;
 return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function DepositModal() {
 const { openModal, close } = useWalletActionModal();
 const { socket } = useSocket();
 const open = openModal === "deposit";
 const ready = useModalReady(open);

 const [stage, setStage] = useState<Stage>("amount");
 const [showSteps, setShowSteps] = useState(false);
 const [amount, setAmount] = useState("");
 const [amountError, setAmountError] = useState("");
 const [submitting, setSubmitting] = useState(false);
 const [payment, setPayment] = useState<IInitiateDepositResponse | null>(null);
 const [copied, setCopied] = useState(false);
 const [remainingMs, setRemainingMs] = useState(0);
 const [expired, setExpired] = useState(false);

 useEffect(() => {
  if (open) return;
  setStage("amount");
  setShowSteps(false);
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
  socket.on("transaction_completed", onCompleted);
  return () => {
   socket.off("transaction_completed", onCompleted);
  };
 }, [stage, socket]);

 const amountUsd = Number(amount);
 const isAmountInvalid =
  !amount ||
  amount.length > MAX_AMOUNT_DIGITS ||
  Number.isNaN(amountUsd) ||
  amountUsd < MIN_TRANSACTION_USD;

 const handleGenerate = async () => {
  if (!amount) {
   setAmountError(depositModalAmountRequired);
   return;
  }
  if (amountUsd < MIN_TRANSACTION_USD) {
   setAmountError(depositModalMinAmountError(MIN_TRANSACTION_USD));
   return;
  }
  setAmountError("");
  setSubmitting(true);

  try {
   const res = await paymentRequest(amountUsd);
   setPayment(res);
   setExpired(false);
   setStage("qr");
  } catch {
   setAmountError(depositModalGenerateFailed);
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
  <Modal open={open} onClose={close} customClass="wallet-modal">
   {!ready && (
    <Box customClass="modal-loader">
     <CircularProgress size={28} />
    </Box>
   )}

   {ready && stage === "amount" && showSteps && (
    <Box customClass="deposit-steps">
     <Box customClass="deposit-steps-head">
      <Text customClass="deposit-heading value-heading">
       {depositModalStepsTitle}
      </Text>
      <Button
       customClass="deposit-steps-close"
       onClick={() => setShowSteps(false)}
       aria-label={depositModalStepsCloseAriaLabel}
      >
       <XIcon size={16} strokeWidth={2} />
      </Button>
     </Box>
     {STEPS.map((step) => (
      <Box key={step.title} customClass="deposit-step">
       <Text customClass="deposit-step-title">{step.title}</Text>
       <Text customClass="deposit-step-desc caption">{step.desc}</Text>
       {step.note && (
        <Text customClass="deposit-step-note warning-text">{step.note}</Text>
       )}
      </Box>
     ))}
    </Box>
   )}

   {ready && stage === "amount" && !showSteps && (
    <Box customClass="deposit-amount-stage">
     <Text customClass="deposit-heading value-heading">
      {depositModalTitle}
     </Text>
     <Box customClass="deposit-info-box">
      <Info size={16} strokeWidth={2} />
      <Text customClass="deposit-info-text caption">
       {walletWithdrawableCaveat}
      </Text>
     </Box>

     <Box customClass="auth-field hero-input-wrapper">
      <Label customClass="deposit-label" htmlFor="deposit-amount">
       {depositModalAmountLabel}
      </Label>
      <Input
       id="deposit-amount"
       type="text"
       inputMode="numeric"
       slotProps={{
        input: { maxLength: MAX_AMOUNT_DIGITS },
       }}
       fullWidth
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
       <Text component="span">{depositModalSpeedBadge}</Text>
       <img src={speedLogo} alt="Speed" className="deposit-speed-logo" />
      </Box>
      <Text customClass="deposit-tagline meta-text">{depositModalTagline}</Text>
     </Box>

     <Button
      fullWidth
      variant="contained"
      customClass="deposit-generate-btn"
      onClick={handleGenerate}
      isLoading={submitting}
      disabled={isAmountInvalid}
     >
      {depositModalGenerateButton}
     </Button>

     <Button
      type="button"
      customClass="deposit-howto-link"
      onClick={() => setShowSteps(true)}
     >
      {depositModalHowToLink}
     </Button>
    </Box>
   )}

   {ready && stage === "qr" && payment && (
    <Box customClass="deposit-qr-stage">
     <Box customClass="deposit-qr-header">
      <IconButton
       customClass="deposit-qr-back-btn"
       onClick={() => setStage("amount")}
       aria-label={authLoginBack}
      >
       <ArrowLeft size={16} strokeWidth={2} />
      </IconButton>
      <Text customClass="deposit-heading value-heading">
       {depositModalDepositingTitle(amountUsd)}
      </Text>
     </Box>

     <Box customClass="deposit-info-box">
      <Info size={16} strokeWidth={2} />
      <Text customClass="deposit-info-text caption">
       {depositModalBtcOnlyWarning}
      </Text>
     </Box>

     <Text customClass="deposit-scan-hint caption">{depositModalScanHint}</Text>

     <Box customClass="deposit-qr-wrap">
      <QRCodeSVG
       value={address ?? ""}
       size={220}
       bgColor="#ffff"
       fgColor="#000"
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
      <Text customClass="deposit-address" truncate>
       {address}
      </Text>
      <Button customClass="deposit-copy-btn" onClick={handleCopy}>
       {copied ? (
        <Check size={14} strokeWidth={2.5} />
       ) : (
        <Copy size={14} strokeWidth={2} />
       )}
       {copied ? depositModalCopied : depositModalCopyButton}
      </Button>
     </Box>

     <Text
      customClass={classNames("deposit-timer", "caption", expired && "expired")}
     >
      {expired
       ? depositModalExpired
       : depositModalExpiresIn(formatCountdown(remainingMs))}
     </Text>
    </Box>
   )}

   {ready && stage === "success" && (
    <Box customClass="deposit-success-stage">
     <Box customClass="deposit-success-icon">
      <CheckCircle2 size={32} strokeWidth={2} />
     </Box>
     <Text customClass="deposit-heading value-heading">
      {depositModalPaymentReceived}
     </Text>
     <Text customClass="deposit-tagline meta-text">
      {depositModalPaymentReceivedDesc}
     </Text>
     <Button
      fullWidth
      variant="contained"
      customClass="deposit-generate-btn"
      onClick={close}
     >
      {depositModalCloseLink}
     </Button>
    </Box>
   )}
  </Modal>
 );
}
