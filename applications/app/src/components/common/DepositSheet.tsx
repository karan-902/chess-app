import { useEffect, useState } from "react";
import classNames from "classnames";
import { QRCodeSVG } from "qrcode.react";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import Input from "@gopvp/common/src/components/Input/Input";
import CopyButton from "@gopvp/app/src/components/common/CopyButton";
import {
 speedLogo,
 qrLogo,
 // Timer,
 Zap,
 icons,
} from "@gopvp/common/src/components/images";
import { formatAmount, formatMMSS } from "@gopvp/common/src/util/format";
import WalletSheetShell from "@gopvp/app/src/components/common/WalletSheetShell";
import WalletSuccessStage from "@gopvp/app/src/components/common/WalletSuccessStage";
import WalletInfoNote from "@gopvp/app/src/components/common/WalletInfoNote";
import { useWalletModal } from "@gopvp/app/src/context/WalletModalContext";
import { useReduxSelector } from "@gopvp/app/src/redux/hooks";
import { paymentRequest } from "@gopvp/app/src/hooks/useWallet";
import { showApiErrorToast } from "@gopvp/common/src/util/api";
import type { IPaymentRequestResponse } from "@gopvp/common/src/types/response";
import type { ISpeedPaymentRequestBody } from "@gopvp/common/src/types/payload";
import { SPEED_PAYMENT_REQUEST } from "@gopvp/app/src/config/speedWallet";
import {
 depositText,
 speedDepositNoteText,
 depositingText,
 instantPayViaText,
 lightningText,
 lightningInvoiceText,
 expiresInLabelText,
 fastSecuredTransparentText,
 buyCryptoInstantlyText,
 enterAmountText,
 generateQrCodeText,
 amountRequiredText,
 maxDepositAmountText,
 // btcOnlyWarningText,
 // scanToDepositText,
 qrExpiredText,
 paymentReceivedText,
 depositsNotWithdrawableText,
 speedText,
} from "@gopvp/app/src/constants/message";
import {
 MAX_DEPOSIT_USD,
 MATCH_TIMER_LOW_SECONDS,
} from "@gopvp/app/src/constants/limit";
import { DEPOSIT_CHIP_AMOUNTS } from "@gopvp/app/src/constants/option";
import { sanitizeAmountInput } from "@gopvp/app/src/utils";
import { backText } from "@gopvp/common/src/constants/message";
import CustomIconButton from "@gopvp/common/src/components/IconButton/IconButton";
import {
 QR_BACKGROUND_COLOR,
 QR_FOREGROUND_COLOR,
} from "@gopvp/app/src/constants/color";

type Stage = "amount" | "qr" | "success";

type SpeedBridgeHandler = { postMessage: (data: string) => void };
type SpeedWalletWindow = Window & {
 Android?: SpeedBridgeHandler;
 webkit?: { messageHandlers?: { iosInterface?: SpeedBridgeHandler } };
};

function postToSpeedWallet(request: ISpeedPaymentRequestBody) {
 const data = JSON.stringify(request);
 const speedWindow = window as SpeedWalletWindow;
 const iosHandler = speedWindow.webkit?.messageHandlers?.iosInterface;
 if (speedWindow.Android) speedWindow.Android.postMessage(data);
 else if (iosHandler) iosHandler.postMessage(data);
 else window.parent.postMessage(data, "*");
}

// function formatCountdown(ms: number) {
//  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
//  const minutes = Math.floor(totalSeconds / 60);
//  const seconds = totalSeconds % 60;
//  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
// }

export default function DepositSheet() {
 const { openModal, close } = useWalletModal();
 const lastTransaction = useReduxSelector(
  (state) => state.wallet.lastTransaction,
 );
 const speedAccountId = useReduxSelector((state) => state.speed.acct);
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
  if (
   stage === "qr" &&
   lastTransaction?.id === payment?.deposit_id &&
   lastTransaction?.status === "COMPLETED"
  )
   setStage("success");
 }, [stage, payment, lastTransaction]);

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
   if (speedAccountId) {
    postToSpeedWallet({
     version: SPEED_PAYMENT_REQUEST.version,
     account_id: speedAccountId,
     data: {
      amount: amountUsd,
      currency: SPEED_PAYMENT_REQUEST.currency,
      target_currency: SPEED_PAYMENT_REQUEST.targetCurrency,
      deposit_address: res.payment_request,
      note: speedDepositNoteText,
     },
    });
    close();
    return;
   }
   setPayment(res);
   setExpired(false);
   setStage("qr");
  } catch (err) {
   showApiErrorToast(err);
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
       placeholder="0"
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
         "filter-dropdown-btn",
         amount === String(chipAmount) && "active",
        )}
        aria-pressed={amount === String(chipAmount)}
        onClick={() => {
         setAmount(String(chipAmount));
         setAmountError("");
        }}
       >
        {formatAmount(chipAmount)}
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
      customClass="modal-submit-btn"
      onClick={handleGenerate}
      isLoading={submitting}
      disabled={isAmountInvalid}
     >
      {speedAccountId ? depositText : generateQrCodeText}
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
       {depositingText}{" "}
       <Text component="span" customClass="deposit-heading-amount">
        {formatAmount(amountUsd)}
       </Text>
      </Text>
     </Box>

     {/* <WalletInfoNote text={btcOnlyWarningText} /> */}

     {/* <Text customClass="deposit-scan-hint caption">{scanToDepositText}</Text> */}

     <Box customClass="deposit-lightning-row">
      <Zap size={14} strokeWidth={2.4} />
      <Text component="span" customClass="deposit-lightning-text">
       {instantPayViaText}{" "}
       <Text component="span" customClass="deposit-lightning-name">
        {lightningText}
       </Text>
      </Text>
     </Box>

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

     {!expired && (
      <Text
       customClass={classNames(
        "match-timer",
        remainingMs / 1000 <= MATCH_TIMER_LOW_SECONDS && "low",
       )}
       aria-label={expiresInLabelText}
      >
       <icons.timer />
       {formatMMSS(Math.floor(remainingMs / 1000))}
      </Text>
     )}

     <Text customClass="deposit-invoice-label">{lightningInvoiceText}</Text>
     <Box customClass="deposit-address-row">
      <Text customClass="deposit-address">{address}</Text>
      <CopyButton text={payment.payment_request} showLabel />
     </Box>

     {expired && (
      <Text customClass="deposit-timer caption expired">{qrExpiredText}</Text>
     )}
     {/* {!expired && (
      <>
       <Box customClass="deposit-expiry-row">
        <Timer size={16} strokeWidth={2.2} />
        <Text component="span" customClass="deposit-expiry-label">
         {expiresInLabelText}
        </Text>
        <Text component="span" customClass="deposit-expiry-time">
         {formatCountdown(remainingMs)}
        </Text>
       </Box>
       <Box customClass="deposit-expiry-track">
        <Box
         customClass="deposit-expiry-fill"
         style={{
          transform: `scaleX(${payment.ttl ? remainingMs / (payment.ttl * 1000) : 0})`,
         }}
        />
       </Box>
      </>
     )} */}
    </Box>
   )}

   {stage === "success" && (
    <WalletSuccessStage amountUsd={amountUsd} title={paymentReceivedText} />
   )}
  </WalletSheetShell>
 );
}
