import { useCurrency } from "@/context/CurrencyContext";
import { TRANSACTIONS_BY_CURRENCY } from "@/constants/currencies";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import TransactionItem from "./TransactionItem";

function TransactionList() {
    const { currency } = useCurrency();
    const transactions = TRANSACTIONS_BY_CURRENCY[currency];

    return (
        <Box customClass="tx-section">
            <Text customClass="section-title">Recent Transactions</Text>
            <Box customClass="tx-list">
                {transactions.map((tx) => (
                    <TransactionItem key={tx.id} tx={tx} />
                ))}
            </Box>
        </Box>
    );
}

export default TransactionList;
