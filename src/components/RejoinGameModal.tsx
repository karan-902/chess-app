import { motion } from "motion/react";
import { Swords } from "lucide-react";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import { formateAmount } from "@/utils/formate";
import {
    rejoinGameTitle,
    rejoinGameBody,
    rejoinGameStakeLabel,
    rejoinGameOpponentLabel,
    rejoinGameRejoinButton,
    rejoinGameExitButton,
} from "@/components/messages";
import type { Currency } from "@/types/types";

interface IRejoinGameModalProps {
    opponentName: string;
    opponentRating: number;
    stakeAmount: number;
    currency: Currency;
    onRejoin: () => void;
    onExit: () => void;
}

function RejoinGameModal({
    opponentName,
    opponentRating,
    stakeAmount,
    currency,
    onRejoin,
    onExit,
}: IRejoinGameModalProps) {
    return (
        <motion.div
            className="gsm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onExit}
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
                        {rejoinGameTitle}
                    </Text>
                </Box>

                <Box customClass="gsm-body">
                    <Box customClass="device-conflict-icon">
                        <Swords size={22} strokeWidth={2} />
                    </Box>
                    <Text customClass="device-conflict-desc">
                        {rejoinGameBody(opponentName)}
                    </Text>
                    <Box customClass="rejoin-stats">
                        <Box customClass="rejoin-stat">
                            <Text as="span" customClass="rejoin-stat-label">
                                {rejoinGameOpponentLabel}
                            </Text>
                            <Text as="span" customClass="rejoin-stat-value">
                                {opponentName} · {opponentRating}
                            </Text>
                        </Box>
                        <Box customClass="rejoin-stat">
                            <Text as="span" customClass="rejoin-stat-label">
                                {rejoinGameStakeLabel}
                            </Text>
                            <Text as="span" customClass="rejoin-stat-value">
                                {formateAmount(stakeAmount, currency)}
                            </Text>
                        </Box>
                    </Box>
                </Box>

                <Box customClass="gsm-footer device-conflict-actions">
                    <Button variant="outline" fullWidth onClick={onExit}>
                        {rejoinGameExitButton}
                    </Button>
                    <Button variant="primary" fullWidth onClick={onRejoin}>
                        {rejoinGameRejoinButton}
                    </Button>
                </Box>
            </motion.div>
        </motion.div>
    );
}

export default RejoinGameModal;
