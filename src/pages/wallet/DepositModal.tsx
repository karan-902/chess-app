import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import clsx from "clsx";
import { X, ChevronLeft, Copy, Check, Zap, Info } from "lucide-react";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import Button from "../../components/base/Button/Button";
import Input from "../../components/base/Input/Input";
import { qrLogo, speedLogo, bitCoinSymbol } from "@/components/images";
import KingStakeLogo from "@/components/constants";

import { useSocket } from "@/context/SocketContext";
import {
    depositModalTitle,
    depositModalCloseAriaLabel,
    depositModalTagline,
    depositModalHowToLink,
    depositModalSpeedBadge,
    depositModalAmountLabel,
    depositModalBitcoinTab,
    depositModalLightningTab,
    depositModalGenerateButton,
    depositModalCloseLink,
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
    depositModalGenerating,
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
} from "@/components/messages";
import type { IInitiateDepositResponse } from "@/types/utils";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

const MIN_DEPOSIT_USD = 1;
const PRESET_AMOUNTS = [10, 25, 50, 100, 500];

type Currency = "bitcoin" | "lightning";
type Screen = "form" | "qr" | "success";

interface IDepositModalProps {
    onClose: () => void;
    onDeposit: (amountUsd: number) => Promise<IInitiateDepositResponse>;
}

function formatCountdown(totalSeconds: number) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
}

const STEPS = [
    { title: depositModalStep1Title, desc: depositModalStep1Desc },
    { title: depositModalStep2Title, desc: depositModalStep2Desc },
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
    { title: depositModalStep5Title, desc: depositModalStep5Desc },
];

function DepositModal({ onClose, onDeposit }: IDepositModalProps) {
    const { socket } = useSocket();
    const [screen, setScreen] = useState<Screen>("form");
    const [currency, setCurrency] = useState<Currency>("bitcoin");
    const [amount, setAmount] = useState("");
    const [amountError, setAmountError] = useState<string | null>(null);
    const [generating, setGenerating] = useState(false);
    const [payment, setPayment] = useState<IInitiateDepositResponse | null>(
        null,
    );
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [copied, setCopied] = useState(false);
    const [stepsOpen, setStepsOpen] = useState(false);

    const openDepositSteps = () => {
        console.log("clicked");
        setStepsOpen(true);
    };
    const closeDepositSteps = () => setStepsOpen(false);
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/[^0-9.]/g, "");
        const parts = val.split(".");
        if (parts.length > 2) val = parts[0] + "." + parts.slice(1).join("");
        setAmount(val);
        setAmountError(null);
    };

    const handleGenerate = async () => {
        const amountUsd = parseFloat(amount);
        if (!amount || isNaN(amountUsd)) {
            toast.error(depositModalAmountRequired);
            return;
        }
        if (amountUsd < MIN_DEPOSIT_USD) {
            setAmountError(depositModalMinAmountError(MIN_DEPOSIT_USD));
            return;
        }
        setGenerating(true);
        try {
            const res = await onDeposit(amountUsd);
            setPayment(res);
            setScreen("qr");
        } catch {
            toast.error(depositModalGenerateFailed);
        } finally {
            setGenerating(false);
        }
    };

    useEffect(() => {
        if (!payment?.expires_at) {
            setSecondsLeft(0);
            return;
        }
        const tick = () =>
            setSecondsLeft(
                Math.max(
                    0,
                    Math.round((payment.expires_at! - Date.now()) / 1000),
                ),
            );
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [payment]);

    useEffect(() => {
        if (!socket || screen !== "qr") return;
        const onCredited = () => setScreen("success");
        socket.on("wallet_credited", onCredited);
        return () => {
            socket.off("wallet_credited", onCredited);
        };
    }, [socket, screen]);

    const address =
        currency === "bitcoin"
            ? payment?.bitcoin_address
            : payment?.lightning_payment_request;

    const handleCopy = () => {
        if (!address) return;
        navigator.clipboard.writeText(address);
        setCopied(true);
        toast.success(depositModalCopied);
        setTimeout(() => setCopied(false), 2000);
    };

    const expired = payment?.expires_at != null && secondsLeft <= 0;

    return (
        <motion.div
            className="gsm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
        >
            <motion.div
                className="gsm-panel deposit-panel"
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 24 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                onClick={(e) => e.stopPropagation()}
            >
                <Box customClass="deposit-side-panel">
                    {stepsOpen ? (
                        <>
                            <>
                                {" "}
                                <Box customClass="deposit-side-steps-header">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        customClass="deposit-steps-back-btn"
                                        onClick={closeDepositSteps}
                                        aria-label={depositModalBackAriaLabel}
                                    >
                                        <ChevronLeft size={16} />
                                    </Button>
                                    <Text customClass="deposit-side-steps-title">
                                        {depositModalStepsTitle}
                                    </Text>
                                </Box>
                                <Box customClass="deposit-steps-list">
                                    {STEPS.map((step, i) => (
                                        <Box
                                            customClass="deposit-step"
                                            key={step.title}
                                        >
                                            <Text
                                                as="span"
                                                customClass="deposit-step-num"
                                            >
                                                {i + 1}
                                            </Text>
                                            <Box customClass="deposit-step-text">
                                                <Text
                                                    as="span"
                                                    customClass="deposit-step-title"
                                                >
                                                    {step.title}
                                                </Text>
                                                <Text
                                                    as="span"
                                                    customClass="deposit-step-desc"
                                                >
                                                    {step.desc}
                                                </Text>
                                                {step.note && (
                                                    <Text
                                                        as="span"
                                                        customClass="deposit-step-note"
                                                    >
                                                        {step.note}
                                                    </Text>
                                                )}
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </>
                        </>
                    ) : (
                        <>
                            <Box customClass="deposit-side-logo">
                                <KingStakeLogo size={36} showText />
                            </Box>
                            <Text customClass="deposit-tagline deposit-side-tagline">
                                {depositModalTagline}
                            </Text>
                            <Button
                                variant="ghost"
                                size="sm"
                                customClass="deposit-howto-link"
                                onClick={openDepositSteps}
                            >
                                {depositModalHowToLink}
                            </Button>
                            <Box customClass="deposit-speed-badge">
                                {depositModalSpeedBadge}
                                <img
                                    src={speedLogo}
                                    alt="Speed"
                                    className="deposit-speed-logo-img"
                                />
                            </Box>
                        </>
                    )}
                </Box>

                <Box customClass="deposit-main-col">
                    {screen === "form" && (
                        <>
                            <Box customClass="gsm-header">
                                <Text as="span" customClass="gsm-modal-title">
                                    {depositModalTitle}
                                </Text>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    customClass="gsm-close"
                                    onClick={onClose}
                                    aria-label={depositModalCloseAriaLabel}
                                >
                                    <X size={16} />
                                </Button>
                            </Box>

                            <Box customClass="gsm-body">
                                <Box customClass="deposit-mobile-brand">
                                    <Text customClass="deposit-tagline">
                                        {depositModalTagline}
                                    </Text>
                                    <Box customClass="deposit-speed-badge">
                                        <Text customClass="font-15">
                                            {depositModalSpeedBadge}
                                        </Text>
                                        <img
                                            src={speedLogo}
                                            alt="Speed"
                                            className="deposit-speed-logo-img"
                                        />
                                    </Box>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        customClass="deposit-howto-link"
                                        onClick={openDepositSteps}
                                    >
                                        {depositModalHowToLink}
                                    </Button>
                                </Box>

                                <Box customClass="field-group deposit-amount-group">
                                    <Text
                                        font="mono"
                                        size={10}
                                        color="muted"
                                        uppercase
                                        customClass="field-label"
                                    >
                                        {depositModalAmountLabel}
                                    </Text>
                                    <Input
                                        type="text"
                                        inputMode="decimal"
                                        placeholder="0.00"
                                        fullWidth
                                        customClass="deposit-amount-input"
                                        value={amount}
                                        onChange={handleAmountChange}
                                        isError={!!amountError}
                                        helperText={amountError ?? undefined}
                                    />
                                    <Box customClass="deposit-amount-chips">
                                        {PRESET_AMOUNTS.map((preset) => (
                                            <Button
                                                key={preset}
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                customClass={clsx(
                                                    "deposit-amount-chip",
                                                    String(preset) === amount &&
                                                        "active",
                                                )}
                                                onClick={() => {
                                                    setAmount(String(preset));
                                                    setAmountError(null);
                                                }}
                                            >
                                                ${preset}
                                            </Button>
                                        ))}
                                    </Box>
                                </Box>
                            </Box>

                            <Box customClass="gsm-footer">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    isLoading={generating}
                                    disabled={
                                        !amount || parseFloat(amount) <= 0
                                    }
                                    onClick={handleGenerate}
                                >
                                    {generating
                                        ? depositModalGenerating
                                        : depositModalGenerateButton}
                                </Button>
                            </Box>
                        </>
                    )}

                    {screen === "qr" && payment && (
                        <>
                            <Box customClass="gsm-header">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    customClass="gsm-close"
                                    onClick={() => setScreen("form")}
                                    aria-label={depositModalBackAriaLabel}
                                >
                                    <ChevronLeft size={16} />
                                </Button>
                                <Text as="span" customClass="gsm-modal-title">
                                    {depositModalDepositingTitle(
                                        payment.amount_usd,
                                    )}
                                </Text>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    customClass="gsm-close"
                                    onClick={onClose}
                                    aria-label={depositModalCloseAriaLabel}
                                >
                                    <X size={16} />
                                </Button>
                            </Box>

                            <Box customClass="gsm-body deposit-qr-body">
                                {expired ? (
                                    <Text customClass="deposit-expired-text">
                                        {depositModalExpired}
                                    </Text>
                                ) : (
                                    <>
                                        <Box customClass="deposit-btc-warning">
                                            <Info size={15} strokeWidth={2} />
                                            <Text as="span">
                                                {depositModalBtcOnlyWarning}
                                            </Text>
                                        </Box>
                                        <Tabs
                                            value={currency}
                                            onValueChange={(v) =>
                                                setCurrency(v as Currency)
                                            }
                                        >
                                            <TabsList className="deposit-currency-tabs">
                                                <TabsTrigger
                                                    className="deposit-currency-tab"
                                                    value="bitcoin"
                                                >
                                                    <img
                                                        src={bitCoinSymbol}
                                                        alt=""
                                                        className="deposit-currency-icon"
                                                    />
                                                    {depositModalBitcoinTab}
                                                    {currency === "bitcoin" && (
                                                        <Check
                                                            size={13}
                                                            className="deposit-currency-check"
                                                        />
                                                    )}
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    className="deposit-currency-tab"
                                                    value="lightning"
                                                >
                                                    <Zap
                                                        size={14}
                                                        className="deposit-currency-icon"
                                                    />
                                                    {depositModalLightningTab}
                                                    {currency ===
                                                        "lightning" && (
                                                        <Check
                                                            size={13}
                                                            className="deposit-currency-check"
                                                        />
                                                    )}
                                                </TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                        <Text customClass="deposit-scan-hint">
                                            {depositModalScanHint}
                                        </Text>
                                        <Box customClass="deposit-qr-wrap">
                                            {address && (
                                                <QRCodeSVG
                                                    value={address}
                                                    size={240}
                                                    level="H"
                                                    bgColor="transparent"
                                                    fgColor="#141413"
                                                    imageSettings={{
                                                        src: qrLogo,
                                                        height: 42,
                                                        width: 42,
                                                        excavate: true,
                                                    }}
                                                />
                                            )}
                                        </Box>
                                        <Box customClass="deposit-address-row">
                                            <Text customClass="deposit-address-text">
                                                {address}
                                            </Text>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                customClass="deposit-copy-btn"
                                                onClick={handleCopy}
                                            >
                                                {copied ? (
                                                    <Check size={13} />
                                                ) : (
                                                    <Copy size={13} />
                                                )}
                                                {copied
                                                    ? depositModalCopied
                                                    : depositModalCopyButton}
                                            </Button>
                                        </Box>
                                        {payment.expires_at != null && (
                                            <Text customClass="deposit-expiry-text">
                                                {depositModalExpiresIn(
                                                    formatCountdown(
                                                        secondsLeft,
                                                    ),
                                                )}
                                            </Text>
                                        )}
                                    </>
                                )}
                            </Box>
                        </>
                    )}

                    {screen === "success" && (
                        <Box customClass="deposit-success-screen">
                            <Box customClass="deposit-success-icon">
                                <Check size={28} strokeWidth={2.5} />
                            </Box>
                            <Text as="h3" customClass="deposit-success-title">
                                {depositModalPaymentReceived}
                            </Text>
                            <Text customClass="deposit-success-desc">
                                {depositModalPaymentReceivedDesc}
                            </Text>
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={onClose}
                            >
                                {depositModalCloseLink}
                            </Button>
                        </Box>
                    )}
                </Box>
            </motion.div>
        </motion.div>
    );
}

export default DepositModal;
