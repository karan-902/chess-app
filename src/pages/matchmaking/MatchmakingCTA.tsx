import Box from "../../components/base/Box/Box";
import Card from "../../components/base/Card/Card";
import Button from "../../components/base/Button/Button";
import Text from "../../components/base/Text/Text";
import { formateAmount } from "@/utils/formate";
import {
    matchmakingCtaWager,
    matchmakingCtaWinFee,
    matchmakingCtaFindOpponentButton,
} from "@/components/messages";
import type { Pool } from "../../types/types";

interface IMatchmakingCTAProps {
    pool: Pool;
    onJoin: () => void;
    onClose: () => void;
}

export default function MatchmakingCTA({
    pool,
    onJoin,
    onClose,
}: IMatchmakingCTAProps) {
    const stake = formateAmount(pool.stake, pool.currency);
    const prize = formateAmount(pool.prize, pool.currency);

    return (
        <Box customClass="cta-sticky">
            <Card customClass="matchmaking-cta">
                <Box customClass="cta-header">
                    <Box>
                        <Text
                            font="rajdhani"
                            size={16}
                            weight={700}
                            customClass="cta-stake"
                        >
                            {matchmakingCtaWager(stake)}
                        </Text>
                        <Text
                            font="mono"
                            size={11}
                            color="muted"
                            customClass="cta-fee"
                        >
                            {matchmakingCtaWinFee(prize)}
                        </Text>
                    </Box>
                    <Button
                        variant="outline"
                        size="sm"
                        customClass="cta-close"
                        onClick={onClose}
                    >
                        ✕
                    </Button>
                </Box>
                <Button variant="primary" size="lg" fullWidth onClick={onJoin}>
                    {matchmakingCtaFindOpponentButton}
                </Button>
            </Card>
        </Box>
    );
}
