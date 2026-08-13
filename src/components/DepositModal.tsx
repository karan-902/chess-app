import { useEffect, useState } from "react";
import classNames from "classnames";
import { Copy, Check, CheckCircle2, ArrowLeft, X as XIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import Label from "@/components/base/Label/Label";
import Input from "@/components/base/Input/Input";
import { speedLogo, qrLogo } from "@/components/images";
import { useWalletActionModal } from "@/context/WalletActionModalContext";
import { useSocket } from "@/context/SocketContext";
import { initiateDeposit } from "@/hooks/useWallet";
import type { IInitiateDepositResponse } from "@/types/utils";
import type { ITransactionCompletedEvent } from "@/types/types";
import {
    depositModalTitle,
    depositModalTagline,
    depositModalHowToLink,
    depositModalSpeedBadge,
    depositModalAmountLabel,
    depositModalBitcoinTab,
    depositModalLightningTab,
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
    depositModalBackAriaLabel,
    depositModalDepositingTitle,
    depositModalBtcOnlyWarning,
    depositModalScanHint,
    depositModalCopyButton,
    depositModalCopied,
    depositModalExpiresIn,
    depositModalExpired,
    depositModalPaymentReceived,
    depositModalPaymentReceivedDesc,
    depositModalCloseLink,
    MAX_AMOUNT_DIGITS,
    MIN_DEPOSIT_USD,
} from "@/constants/messages";
import Modal from "./base/Modal/Modal";

type Method = "bitcoin" | "lightning";
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

    const [stage, setStage] = useState<Stage>("amount");
    const [showSteps, setShowSteps] = useState(false);
    const [method, setMethod] = useState<Method>("bitcoin");
    const [amount, setAmount] = useState("");
    const [amountError, setAmountError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [payment, setPayment] = useState<IInitiateDepositResponse | null>(
        null,
    );
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
        if (stage !== "qr" || !payment?.expires_at) return;

        const tick = () => {
            const left = payment.expires_at! - Date.now();
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
        amountUsd < MIN_DEPOSIT_USD;

    const handleGenerate = async () => {
        if (!amount) {
            setAmountError(depositModalAmountRequired);
            return;
        }
        if (amountUsd < MIN_DEPOSIT_USD) {
            setAmountError(depositModalMinAmountError(MIN_DEPOSIT_USD));
            return;
        }
        setAmountError("");
        setSubmitting(true);
        try {
            const res = await initiateDeposit(amountUsd);
            setPayment(res);
            setExpired(false);
            setStage("qr");
        } catch {
            setAmountError(depositModalGenerateFailed);
        } finally {
            setSubmitting(false);
        }
    };

    const address =
        method === "bitcoin"
            ? payment?.bitcoin_address
            : payment?.lightning_payment_request;

    const handleCopy = () => {
        if (!address) return;
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <Modal open={open} onClose={close}>
            {stage === "amount" && showSteps && (
                <Box customClass="deposit-steps">
                    <Box customClass="deposit-steps-head">
                        <Text customClass="deposit-heading">
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
                            <Text customClass="deposit-step-title">
                                {step.title}
                            </Text>
                            <Text customClass="deposit-step-desc">
                                {step.desc}
                            </Text>
                            {step.note && (
                                <Text customClass="deposit-step-note">
                                    {step.note}
                                </Text>
                            )}
                        </Box>
                    ))}
                </Box>
            )}

            {stage === "amount" && !showSteps && (
                <Box customClass="deposit-amount-stage">
                    <Text customClass="deposit-heading">
                        {depositModalTitle}
                    </Text>

                    <Box customClass="auth-field">
                        <Label htmlFor="deposit-amount">
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
                    <Box customClass="deposit-speed-badge">
                        <Text component="span">{depositModalSpeedBadge}</Text>
                        <img
                            src={speedLogo}
                            alt="Speed"
                            className="deposit-speed-logo"
                        />
                    </Box>
                    <Text customClass="deposit-tagline">
                        {depositModalTagline}
                    </Text>

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

                    <button
                        type="button"
                        className="deposit-howto-link"
                        onClick={() => setShowSteps(true)}
                    >
                        {depositModalHowToLink}
                    </button>
                </Box>
            )}

            {stage === "qr" && payment && (
                <Box customClass="deposit-qr-stage">
                    <button
                        type="button"
                        className="deposit-back-btn"
                        onClick={() => setStage("amount")}
                        aria-label={depositModalBackAriaLabel}
                    >
                        <ArrowLeft size={16} strokeWidth={2} />
                    </button>
                    <Text customClass="deposit-heading">
                        {depositModalDepositingTitle(Number(amount))}
                    </Text>

                    <Box customClass="deposit-method-tabs">
                        <Button
                            customClass={classNames(
                                "deposit-method-btn",
                                method === "bitcoin" && "active",
                            )}
                            onClick={() => setMethod("bitcoin")}
                        >
                            {depositModalBitcoinTab}
                        </Button>
                        <Button
                            customClass={classNames(
                                "deposit-method-btn",
                                method === "lightning" && "active",
                            )}
                            onClick={() => setMethod("lightning")}
                        >
                            {depositModalLightningTab}
                        </Button>
                    </Box>

                    {method === "bitcoin" && (
                        <Text customClass="deposit-warning">
                            {depositModalBtcOnlyWarning}
                        </Text>
                    )}
                    <Text customClass="deposit-scan-hint">
                        {depositModalScanHint}
                    </Text>

                    <Box customClass="deposit-qr-wrap">
                        <QRCodeSVG
                            value={address ?? ""}
                            size={220}
                            bgColor="#ece8de"
                            fgColor="#100f0c"
                            marginSize={2}
                            imageSettings={{
                                src: qrLogo,
                                height: 40,
                                width: 40,
                                excavate: true,
                            }}
                        />
                    </Box>

                    <Box customClass="deposit-address-row">
                        <Text customClass="deposit-address" truncate>
                            {address}
                        </Text>
                        <Button
                            customClass="deposit-copy-btn"
                            onClick={handleCopy}
                        >
                            {copied ? (
                                <Check size={14} strokeWidth={2.5} />
                            ) : (
                                <Copy size={14} strokeWidth={2} />
                            )}
                            {copied
                                ? depositModalCopied
                                : depositModalCopyButton}
                        </Button>
                    </Box>

                    <Text
                        customClass={classNames(
                            "deposit-timer",
                            expired && "expired",
                        )}
                    >
                        {expired
                            ? depositModalExpired
                            : depositModalExpiresIn(
                                  formatCountdown(remainingMs),
                              )}
                    </Text>
                </Box>
            )}

            {stage === "success" && (
                <Box customClass="deposit-success-stage">
                    <Box customClass="deposit-success-icon">
                        <CheckCircle2 size={32} strokeWidth={2} />
                    </Box>
                    <Text customClass="deposit-heading">
                        {depositModalPaymentReceived}
                    </Text>
                    <Text customClass="deposit-tagline">
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
