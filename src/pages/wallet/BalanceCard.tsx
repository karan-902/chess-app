import { useCurrency } from "@/context/CurrencyContext";
import { BALANCE_BY_CURRENCY, CURRENCY_META } from "@/constants/currencies";
import Card from "../../components/base/Card/Card";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";

function BalanceCard() {
    const { currency } = useCurrency();
    const { amount, usd, profit } = BALANCE_BY_CURRENCY[currency];
    const meta = CURRENCY_META[currency];
    const CurrencyIcon = meta.icon;

    return (
        <Card customClass="balance-card">
            <Text font="mono" size={10} color="muted" uppercase customClass="balance-label">
                Total Balance
            </Text>
            <Box customClass="balance-row">
                <Text customClass="balance-amount-text">{amount}</Text>
                <Box customClass="balance-currency-tag" style={{ "--currency-color": meta.color } as React.CSSProperties}>
                    <CurrencyIcon size={12} strokeWidth={2.5} />
                    <Text customClass="balance-currency-text">{currency}</Text>
                </Box>
            </Box>
            <Text customClass="balance-usd-text">{usd}</Text>
            <Text customClass="balance-profit-text">{profit}</Text>
        </Card>
    );
}

export default BalanceCard;
