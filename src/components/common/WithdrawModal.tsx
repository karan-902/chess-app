import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useReduxDispatch } from "@/redux/hooks";
import { showToast } from "@/redux/common/common.slice";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import Label from "@/components/base/Label/Label";
import Input from "@/components/base/Input/Input";
import Select from "@/components/base/Select/Select";
import { useWalletActionModal } from "@/context/WalletActionModalContext";
import { useWalletBalance } from "@/hooks/useWallet";
import { requestWithdraw } from "@/hooks/useWallet";
import type { WithdrawMethod } from "@/types/utils";
import {
    withdrawModalTitle,
    withdrawModalWithdrawableCaveat,
    withdrawModalAmountLabel,
    withdrawModalMethodLabel,
    withdrawModalDestinationLabel,
    withdrawModalDestinationPlaceholder,
    withdrawModalMethodOptions,
    withdrawModalSubmitButton,
    withdrawModalInvalidAmount,
    withdrawModalExceedsBalance,
    withdrawModalInvalidDestination,
    withdrawModalFailed,
    withdrawModalSuccessTitle,
    withdrawModalSuccessDesc,
    walletPageWithdrawableLabel,
    depositModalCloseLink,
} from "@/constants/messages";
import Modal from "../base/Modal/Modal";

type Stage = "amount" | "success";
const MAX_AMOUNT_DIGITS = 4;
export default function WithdrawModal() {
    const dispatch = useReduxDispatch();
    const { openModal, close } = useWalletActionModal();
    const { withdrawableUsd, refetch } = useWalletBalance();
    const open = openModal === "withdraw";

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

    const hasWithdrawable = withdrawableUsd > 0;
    const amountUsd = parseFloat(amount) || 0;
    const exceedsBalance =
        Math.round(amountUsd * 100) > Math.round(withdrawableUsd * 100);
    const isZeroAmount = amount !== "" && amountUsd <= 0;
    const amountError = submitting
        ? undefined
        : exceedsBalance
          ? withdrawModalExceedsBalance
          : isZeroAmount
            ? withdrawModalInvalidAmount
            : undefined;
    const canSubmit =
        hasWithdrawable &&
        amount !== "" &&
        !amountError &&
        destination.trim() !== "";

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/[^0-9.]/g, "").replace(/^0+/, "");
        const parts = val.split(".");
        if (parts.length > 2) val = parts[0] + "." + parts.slice(1).join("");
        setAmount(val);
    };

    const handleSubmit = async () => {
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
            await requestWithdraw(amountUsd, method, destination.trim());
            refetch();
            setStage("success");
        } catch {
            dispatch(
                showToast({ message: withdrawModalFailed, severity: "error" }),
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal open={open} onClose={close}>
            {stage === "amount" && (
                <Box customClass="deposit-amount-stage">
                    <Text customClass="deposit-heading">
                        {withdrawModalTitle}
                    </Text>

                    <Box customClass="withdraw-available">
                        <Text customClass="withdraw-available-label">
                            {walletPageWithdrawableLabel}
                        </Text>
                        <Text customClass="withdraw-available-amt">
                            ${withdrawableUsd.toFixed(2)}
                        </Text>
                        <Text customClass="withdraw-available-caveat">
                            {withdrawModalWithdrawableCaveat}
                        </Text>
                    </Box>

                    <Box customClass="auth-field">
                        <Label htmlFor="withdraw-amount">
                            {withdrawModalAmountLabel}
                        </Label>
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
                        <Label htmlFor="withdraw-method">
                            {withdrawModalMethodLabel}
                        </Label>
                        <Select
                            value={method}
                            onChange={(value) =>
                                setMethod(value as WithdrawMethod)
                            }
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
                            placeholder={withdrawModalDestinationPlaceholder}
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            disabled={submitting || !hasWithdrawable}
                        />
                    </Box>

                    <Button
                        fullWidth
                        variant="contained"
                        customClass="deposit-generate-btn"
                        onClick={handleSubmit}
                        isLoading={submitting}
                        disabled={!canSubmit}
                    >
                        {withdrawModalSubmitButton}
                    </Button>
                </Box>
            )}

            {stage === "success" && (
                <Box customClass="deposit-success-stage">
                    <Box customClass="deposit-success-icon">
                        <CheckCircle2 size={32} strokeWidth={2} />
                    </Box>
                    <Text customClass="deposit-heading">
                        {withdrawModalSuccessTitle}
                    </Text>
                    <Text customClass="deposit-tagline">
                        {withdrawModalSuccessDesc}
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
