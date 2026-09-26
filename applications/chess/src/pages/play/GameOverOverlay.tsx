import classNames from "classnames";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import { formatAmount } from "@/utils/format";
import type { IGameOverOverlayProps } from "@/types/components";
import {
 settlementText,
 backText,
 rematchText,
 waitingForOpponentSecondsText,
 acceptRematchText,
 addFundsText,
} from "@/constants/messages";

export default function GameOverOverlay({
    gameEnded,
    reasonLabel,
    resultHeader,
    isWinner,
    isDrawResult,
    settlementUsd,
    isPvc,
    canAffordRematch,
    rematchStatus,
    rematchSecs,
    onNewGame,
    onRematch,
}: IGameOverOverlayProps) {
    return (
        <Box customClass="gr-overlay">
            <Text customClass="gr-overlay-badge">{reasonLabel}</Text>
            <Text customClass="gr-overlay-title">{resultHeader}</Text>
            {gameEnded.settlement && (
                <Box customClass="gr-settlement">
                    <Box customClass="gr-settlement-item">
                        <Text
                            customClass={classNames(
                                "gr-settlement-val",
                                isWinner && "win",
                                !isWinner && !isDrawResult && "loss",
                            )}
                        >
                            {formatAmount(settlementUsd)}
                        </Text>
                        <Text customClass="gr-settlement-lbl caption">
                            {settlementText}
                        </Text>
                    </Box>
                    {typeof gameEnded.your_elo_gain === "number" && (
                        <Box customClass="gr-settlement-item">
                            <Text customClass="gr-settlement-val">
                                {gameEnded.your_elo_gain >= 0
                                    ? `+${gameEnded.your_elo_gain}`
                                    : gameEnded.your_elo_gain}
                            </Text>
                            <Text customClass="gr-settlement-lbl caption">
                                Elo
                            </Text>
                        </Box>
                    )}
                </Box>
            )}
            <Box customClass="gr-overlay-actions">
                <Button
                    customClass="gr-overlay-btn secondary"
                    onClick={onNewGame}
                >
                    {backText}
                </Button>
                {!isPvc && !canAffordRematch && (
                    <Text customClass="pool-insufficient-label caption">
                        {addFundsText}
                    </Text>
                )}
                {!isPvc && canAffordRematch && (
                    <Button
                        customClass="gr-overlay-btn primary"
                        sx={{ display: "none" }}
                        onClick={onRematch}
                        disabled={rematchStatus === "offered"}
                    >
                        {rematchStatus === "offered"
                            ? waitingForOpponentSecondsText(rematchSecs)
                            : rematchStatus === "opponent-offered"
                              ? acceptRematchText
                              : rematchText}
                    </Button>
                )}
            </Box>
        </Box>
    );
}
