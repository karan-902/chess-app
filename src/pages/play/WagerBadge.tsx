import { STAKE_CURRENCY } from "@/constants/config";
import { formateAmount } from "@/utils/formate";
import { Difficulty, GameMode } from "@/types/components";
import Card from "../../components/base/Card/Card";
import Text from "../../components/base/Text/Text";
import {
    playWagerBadgePractice,
    playWagerBadgeVsComputerNoWager,
    playWagerBadgeWageredEachSide,
    playWagerBadgeLive,
    playWagerBadgeDifficultyLabels,
} from "@/components/messages";

const DIFF_LABEL: Record<Difficulty, string> = playWagerBadgeDifficultyLabels;

const DIFF_COLOR: Record<Difficulty, string> = {
    easy: "wager-diff--easy",
    medium: "wager-diff--medium",
    hard: "wager-diff--hard",
};

const DEFAULT_WAGER = formateAmount(10, STAKE_CURRENCY);

interface IWagerBadgeProps {
    mode: GameMode;
    difficulty?: Difficulty;
    stakeAmount?: number;
}

function WagerBadge({ mode, difficulty, stakeAmount }: IWagerBadgeProps) {
    if (mode === "pvc") {
        return (
            <Card customClass="wager-badge">
                <Text customClass="wager-amount">{playWagerBadgePractice}</Text>
                <Text customClass="wager-label">
                    {playWagerBadgeVsComputerNoWager}
                </Text>
                {difficulty && (
                    <Text customClass={`wager-diff ${DIFF_COLOR[difficulty]}`}>
                        {DIFF_LABEL[difficulty]}
                    </Text>
                )}
            </Card>
        );
    }

    return (
        <Card customClass="wager-badge wager-badge--pvp">
            <Text customClass="wager-amount">
                {stakeAmount !== undefined
                    ? formateAmount(stakeAmount, STAKE_CURRENCY)
                    : DEFAULT_WAGER}
            </Text>
            <Text customClass="wager-label">
                {playWagerBadgeWageredEachSide}
            </Text>
            <Text customClass="live-label">{playWagerBadgeLive}</Text>
            <span className="live-dot" />
        </Card>
    );
}

export default WagerBadge;
