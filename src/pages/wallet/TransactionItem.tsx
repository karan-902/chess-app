import clsx from "clsx";
import Card from "../../components/base/Card/Card";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import { formatRelativeTime } from "@/utils";
import { walletTransactionProcessingLabel } from "@/components/messages";
import type { ITransactionResponse } from "@/types/utils";

const ICONS: Record<ITransactionResponse["type"], string> = {
    DEPOSIT: "↓",
    WITHDRAW: "↑",
    WITHDRAW_REFUND: "↺",
    PAYOUT: "♔",
    DRAW_REFUND: "♚",
    STAKE_ESCROW: "♟",
    ESCROW_REFUND: "↺",
};

interface ITransactionItemProps {
    tx: ITransactionResponse;
}

function TransactionItem({ tx }: ITransactionItemProps) {
    const isPos = tx.amount_usd >= 0;
    const amountLabel = `${isPos ? "+" : "-"}$${Math.abs(tx.amount_usd).toFixed(2)}`;

    return (
        <Card customClass="tx-item hud-frame">
            <Box customClass="tx-item-row">
                <Box customClass={clsx("tx-icon", isPos ? "pos" : "neg")}>
                    {ICONS[tx.type]}
                </Box>
                <Box customClass="tx-info">
                    <Text font="inter" size={14} color="white" customClass="tx-desc">
                        {tx.description}
                    </Text>
                    <Text font="mono" size={11} color="muted" customClass="tx-time">
                        {formatRelativeTime(tx.created)}
                    </Text>
                    {tx.withdraw_status === "PENDING" && (
                        <Text as="span" customClass="tx-processing-badge">
                            {walletTransactionProcessingLabel}
                        </Text>
                    )}
                </Box>
                <Box customClass="tx-amounts">
                    <Text
                        font="mono"
                        size={14}
                        weight={700}
                        customClass={clsx("tx-amount", isPos ? "pos" : "neg")}
                    >
                        {amountLabel}
                    </Text>
                </Box>
            </Box>
        </Card>
    );
}

export default TransactionItem;
