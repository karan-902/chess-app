import Card from "../../components/base/Card/Card";
import Text from "../../components/base/Text/Text";
import Skeleton from "@/components/base/Skeleton/Skeleton";
import {
    walletBalanceCardTotalBalance,
    walletBalanceCardWithdrawable,
} from "@/components/messages";

interface IBalanceCardProps {
    usdValue: number;
    withdrawableUsd: number;
    loading: boolean;
}

function BalanceCard({
    usdValue,
    withdrawableUsd,
    loading,
}: IBalanceCardProps) {
    return (
        <Card customClass="balance-card hud-frame">
            <Text
                font="mono"
                size={10}
                color="muted"
                uppercase
                customClass="balance-label"
            >
                {walletBalanceCardTotalBalance}
            </Text>
            {loading ? (
                <Skeleton variant="text" width="50%" height={36} />
            ) : (
                <>
                    <Text customClass="balance-amount-text">
                        ${usdValue.toFixed(2)}
                    </Text>
                    <Text
                        font="mono"
                        size={14}
                        color="accent"
                        customClass="balance-withdrawable-text"
                    >
                        {walletBalanceCardWithdrawable} $
                        {withdrawableUsd.toFixed(2)}
                    </Text>
                </>
            )}
        </Card>
    );
}

export default BalanceCard;
