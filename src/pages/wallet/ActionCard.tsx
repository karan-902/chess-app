import { useState } from "react";
import clsx from "clsx";
import { useCurrency } from "@/context/CurrencyContext";
import { CURRENCY_META } from "@/constants/currencies";
import Card from "../../components/base/Card/Card";
import Box from "../../components/base/Box/Box";
import Button from "../../components/base/Button/Button";
import Text from "../../components/base/Text/Text";
import Input from "../../components/base/Input/Input";

interface IActionCardProps {
    tab: "deposit" | "withdraw";
    onTabChange: (tab: "deposit" | "withdraw") => void;
}

function ActionCard({ tab, onTabChange }: IActionCardProps) {
    const { currency } = useCurrency();
    const meta = CURRENCY_META[currency];
    const [amount, setAmount] = useState("");
    const [network, setNetwork] = useState(meta.networks[0].id);

    // Reset network when currency changes
    const currentNetworkValid = meta.networks.some(n => n.id === network);
    const activeNetwork = currentNetworkValid ? network : meta.networks[0].id;

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/[^0-9.]/g, "");
        const parts = val.split(".");
        if (parts.length > 2) val = parts[0] + "." + parts.slice(1).join("");
        setAmount(val);
    };

    return (
        <Card customClass="action-card">
            <Box customClass="action-tabs">
                {(["deposit", "withdraw"] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => onTabChange(t)}
                        className={clsx("action-tab", tab === t && "active")}
                    >
                        {t === "deposit" ? "↓ Deposit" : "↑ Withdraw"}
                    </button>
                ))}
            </Box>
            <Box customClass="action-content">
                <Box customClass="field-group">
                    <Text font="mono" size={10} color="muted" uppercase customClass="field-label">
                        Amount ({currency})
                    </Text>
                    <Input
                        type="text"
                        inputMode="decimal"
                        placeholder={meta.placeholder}
                        customClass="amount-input"
                        fullWidth
                        value={amount}
                        onChange={handleAmountChange}
                    />
                </Box>
                <Box customClass="field-group">
                    <Text font="mono" size={10} color="muted" uppercase customClass="field-label">
                        Network
                    </Text>
                    <Box customClass="network-options">
                        {meta.networks.map((n) => (
                            <button
                                key={n.id}
                                className={clsx("network-btn", activeNetwork === n.id && "active")}
                                onClick={() => setNetwork(n.id)}
                            >
                                {n.label}
                            </button>
                        ))}
                    </Box>
                </Box>
                <Button variant="primary" size="lg" fullWidth>
                    {tab === "deposit" ? "GENERATE ADDRESS" : "REQUEST WITHDRAWAL"}
                </Button>
            </Box>
        </Card>
    );
}

export default ActionCard;
