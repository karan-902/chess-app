import { useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { toast } from "sonner";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import Button from "../../components/base/Button/Button";
import Input from "../../components/base/Input/Input";
import Select from "../../components/base/Select/Select";
import {
    walletActionCardWithdrawTab,
    walletActionCardAmountLabel,
    walletActionCardRequestWithdrawalButton,
    walletWithdrawButtonLoading,
    walletWithdrawInvalidAmount,
    walletWithdrawExceedsBalance,
    walletWithdrawInvalidDestination,
    walletWithdrawFailed,
    walletWithdrawSuccess,
    walletDepositAmountPlaceholder,
    walletWithdrawableLabel,
    walletWithdrawableCaveat,
    walletWithdrawMethodLabel,
    walletWithdrawDestinationLabel,
    walletWithdrawMethodOptions,
} from "@/components/messages";
import type { IWithdrawResponse, WithdrawMethod } from "@/types/utils";

interface IWithdrawModalProps {
    onClose: () => void;
    onWithdraw: (
        amountUsd: number,
        withdrawMethod: WithdrawMethod,
        destination: string,
    ) => Promise<IWithdrawResponse>;
    withdrawableUsd: number;
}

function WithdrawModal({
    onClose,
    onWithdraw,
    withdrawableUsd,
}: IWithdrawModalProps) {
    const [amount, setAmount] = useState("");
    const [withdrawMethod, setWithdrawMethod] = useState<WithdrawMethod>(
        walletWithdrawMethodOptions[0].value,
    );
    const [destination, setDestination] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const selectedMethod = walletWithdrawMethodOptions.find(
        (option) => option.value === withdrawMethod,
    )!;

    const amountUsd = parseFloat(amount) || 0;
    const exceedsBalance =
        Math.round(amountUsd * 100) > Math.round(withdrawableUsd * 100);
    const isZeroAmount = amount !== "" && amountUsd <= 0;
    // Once submitting, the withdrawable balance can update in real time
    // (the backend broadcasts the new balance as soon as its DB transaction
    // commits, before this request's HTTP response even arrives) — don't
    // re-validate the amount the user already committed to against that
    // moving target.
    const amountError = submitting
        ? undefined
        : exceedsBalance
          ? walletWithdrawExceedsBalance
          : isZeroAmount
            ? walletWithdrawInvalidAmount
            : undefined;
    const canSubmit =
        amount !== "" && !amountError && destination.trim() !== "";

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/[^0-9.]/g, "");
        const parts = val.split(".");
        if (parts.length > 2) val = parts[0] + "." + parts.slice(1).join("");
        setAmount(val);
    };

    const handleSubmit = async () => {
        if (!destination.trim()) {
            toast.error(walletWithdrawInvalidDestination);
            return;
        }

        setSubmitting(true);
        try {
            await onWithdraw(amountUsd, withdrawMethod, destination.trim());
            toast.success(walletWithdrawSuccess);
            setAmount("");
            setDestination("");
            onClose();
        } catch (err: any) {
            const backendMessage = err?.response?.data?.message;
            toast.error(backendMessage || walletWithdrawFailed);
        } finally {
            setSubmitting(false);
        }
    };

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
                className="gsm-panel"
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 24 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                onClick={(e) => e.stopPropagation()}
            >
                <Box customClass="gsm-header">
                    <Text as="span" customClass="gsm-modal-title">
                        {walletActionCardWithdrawTab}
                    </Text>
                    <Button
                        variant="outline"
                        size="sm"
                        customClass="gsm-close"
                        onClick={onClose}
                    >
                        <X size={16} />
                    </Button>
                </Box>

                <Box customClass="gsm-body">
                    <Box customClass="withdrawable-stat">
                        <Text
                            font="mono"
                            size={10}
                            color="muted"
                            uppercase
                            customClass="withdrawable-label"
                        >
                            {walletWithdrawableLabel}
                        </Text>
                        <Text customClass="withdrawable-amount">
                            ${withdrawableUsd.toFixed(2)}
                        </Text>
                        <Text
                            font="mono"
                            size={10}
                            color="muted"
                            customClass="withdrawable-caveat"
                        >
                            {walletWithdrawableCaveat}
                        </Text>
                    </Box>

                    <Box customClass="field-group">
                        <Text
                            font="mono"
                            size={10}
                            color="muted"
                            uppercase
                            customClass="field-label"
                        >
                            {walletActionCardAmountLabel("USD")}
                        </Text>
                        <Input
                            type="text"
                            inputMode="decimal"
                            placeholder={walletDepositAmountPlaceholder}
                            fullWidth
                            value={amount}
                            onChange={handleAmountChange}
                            disabled={submitting}
                            isError={!!amountError}
                            helperText={amountError}
                        />
                    </Box>

                    <Box customClass="field-group">
                        <Text
                            font="mono"
                            size={10}
                            color="muted"
                            uppercase
                            customClass="field-label"
                        >
                            {walletWithdrawMethodLabel}
                        </Text>
                        <Select
                            value={withdrawMethod}
                            onChange={(value) =>
                                setWithdrawMethod(value as WithdrawMethod)
                            }
                            options={walletWithdrawMethodOptions}
                        />
                    </Box>

                    <Box customClass="field-group">
                        <Text
                            font="mono"
                            size={10}
                            color="muted"
                            uppercase
                            customClass="field-label"
                        >
                            {walletWithdrawDestinationLabel(
                                selectedMethod.label,
                            )}
                        </Text>
                        <Input
                            type="text"
                            placeholder={selectedMethod.placeholder}
                            fullWidth
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                        />
                    </Box>
                </Box>

                <Box customClass="gsm-footer">
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        disabled={!canSubmit}
                        isLoading={submitting}
                        onClick={handleSubmit}
                    >
                        {submitting
                            ? walletWithdrawButtonLoading
                            : walletActionCardRequestWithdrawalButton}
                    </Button>
                </Box>
            </motion.div>
        </motion.div>
    );
}

export default WithdrawModal;
