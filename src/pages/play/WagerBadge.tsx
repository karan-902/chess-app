import { useCurrency } from "@/context/CurrencyContext";
import { Difficulty, GameMode } from "@/types/components";
import Card from "../../components/base/Card/Card";
import Text from "../../components/base/Text/Text";

const DIFF_LABEL: Record<Difficulty, string> = {
    easy:   "Easy",
    medium: "Medium",
    hard:   "Hard",
};

const DIFF_COLOR: Record<Difficulty, string> = {
    easy:   "wager-diff--easy",
    medium: "wager-diff--medium",
    hard:   "wager-diff--hard",
};

const DEFAULT_WAGER: Record<string, string> = {
    BTC:  "0.001 BTC",
    USDT: "10 USDT",
    USDC: "10 USDC",
};

interface IWagerBadgeProps {
    mode: GameMode;
    difficulty?: Difficulty;
    stakeAmount?: string;
}

function WagerBadge({ mode, difficulty, stakeAmount }: IWagerBadgeProps) {
    const { currency } = useCurrency();

    if (mode === "pvc") {
        return (
            <Card customClass="wager-badge">
                <Text customClass="wager-amount">Practice</Text>
                <Text customClass="wager-label">vs Computer · no wager</Text>
                {difficulty && (
                    <Text customClass={`wager-diff ${DIFF_COLOR[difficulty]}`}>
                        {DIFF_LABEL[difficulty]}
                    </Text>
                )}
            </Card>
        );
    }

    return (
        <Card customClass="wager-badge">
            <Text customClass="wager-amount">{stakeAmount ?? DEFAULT_WAGER[currency]}</Text>
            <Text customClass="wager-label">wagered each side</Text>
            <Text customClass="live-label">LIVE</Text>
            <span className="live-dot" />
        </Card>
    );
}

export default WagerBadge;
