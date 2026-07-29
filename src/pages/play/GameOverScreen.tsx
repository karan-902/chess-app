import { useEffect, useState } from "react";
import { RefreshCw, Check, Trophy, Flag, Handshake, X } from "lucide-react";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import Button from "../../components/base/Button/Button";

import {
    playGameOverAcceptRematchButton,
    playGameOverAccuracyLabel,
    playGameOverHeaderDraw,
    playGameOverHeaderLose,
    playGameOverHeaderWin,
    playGameOverMovesLabel,
    playGameOverNewGameButton,
    playGameOverRatingLabel,
    playGameOverRematchButton,
    playGameOverRematchFoundStarting,
    playGameOverSettlementLabel,
    playGameOverTimeLabel,
    playGameOverWaitingForOpponent,
} from "@/components/messages";

import type { RematchStatus } from "@/hooks/useRematch";

interface IGameOverScreenProps {
    result: "win" | "lose" | "draw";
    reason: string;
    opponentName: string;
    opponentRating: number;
    totalMoves: number;
    elapsedTime: string;
    onNewGame: () => void;
    onClose: () => void;
    canRematch?: boolean;
    rematchStatus?: RematchStatus;
    rematchSecondsLeft?: number;
    onRematch?: () => void;
    settlementUsd?: number;
    ratingDelta?: number;
    accuracy?: number | null;
    analyzingAccuracy?: boolean;
    mode?: "pvp" | "pvc";
    streakCount?: number;
}

export default function GameOverScreen({
    result,
    reason,
    opponentName,
    opponentRating,
    totalMoves,
    elapsedTime,
    onNewGame,
    onClose,
    canRematch,
    rematchStatus = "idle",
    rematchSecondsLeft,
    onRematch,
    settlementUsd,
    ratingDelta,
    accuracy,
    analyzingAccuracy,
    mode,
    streakCount,
}: IGameOverScreenProps) {
    const [displayedDelta, setDisplayedDelta] = useState(0);

    useEffect(() => {
        if (ratingDelta == null || ratingDelta === 0) {
            setDisplayedDelta(0);
            return;
        }
        const steps = 28;
        const stepMs = 40;
        const increment = ratingDelta / steps;
        let count = 0;
        const id = setInterval(() => {
            count++;
            if (count >= steps) {
                setDisplayedDelta(ratingDelta);
                clearInterval(id);
            } else {
                setDisplayedDelta(Math.round(increment * count));
            }
        }, stepMs);
        return () => clearInterval(id);
    }, [ratingDelta]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
                return;
            }
            if ((e.key === "n" || e.key === "N") && !e.ctrlKey && !e.metaKey) {
                onNewGame();
                return;
            }
            if (
                (e.key === "r" || e.key === "R") &&
                canRematch &&
                rematchStatus === "idle"
            ) {
                onRematch?.();
                return;
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose, onNewGame, canRematch, rematchStatus, onRematch]);

    const isWin = result === "win";
    const isDraw = result === "draw";

    const headerLabel = isWin
        ? playGameOverHeaderWin
        : isDraw
          ? playGameOverHeaderDraw
          : playGameOverHeaderLose;
    const reasonLabel = reason.toUpperCase();
    const ratingDeltaLabel =
        ratingDelta === undefined
            ? "—"
            : displayedDelta === 0 && ratingDelta !== 0
              ? ratingDelta > 0
                  ? "+…"
                  : "−…"
              : displayedDelta === 0
                ? "±0"
                : displayedDelta > 0
                  ? `+${displayedDelta}`
                  : `${displayedDelta}`;
    const showStreakBanner = isWin && streakCount != null && streakCount >= 3;
    const accuracyLabel = analyzingAccuracy
        ? "…"
        : accuracy == null
          ? "—"
          : `${accuracy}%`;

    return (
        <Box customClass={`gos-overlay gos-overlay--${result}`}>
            <Box customClass="gos-inner">
                <Box customClass="gos-header">
                    <Button
                        variant="ghost"
                        size="sm"
                        customClass="gos-icon-btn"
                        onClick={onClose}
                    >
                        <X size={16} />
                    </Button>
                    <Text
                        as="span"
                        customClass={`gos-title gos-title--${result}`}
                    >
                        {headerLabel}
                    </Text>
                    <Box customClass="gos-icon-btn" style={{ opacity: 0 }} />
                </Box>

                {/* ── Scrollable body ── */}
                <Box customClass="gos-body">
                    {/* Top stats — float on background */}
                    <Box customClass="gos-stats-row">
                        <Box customClass="gos-stat">
                            <Text as="span" customClass="gos-stat-label">
                                {playGameOverMovesLabel}
                            </Text>
                            <Text as="span" customClass="gos-stat-value">
                                {totalMoves}
                            </Text>
                        </Box>
                        <Box customClass="gos-stat gos-stat--right">
                            <Text as="span" customClass="gos-stat-label">
                                {playGameOverTimeLabel}
                            </Text>
                            <Text as="span" customClass="gos-stat-value">
                                {elapsedTime}
                            </Text>
                        </Box>
                    </Box>

                    {/* Reason badge + label */}
                    <Box customClass="gos-reason-block">
                        <Box
                            customClass={`gos-result-badge gos-result-badge--${result}`}
                        >
                            {isWin && <Trophy size={22} strokeWidth={2} />}
                            {isDraw && <Handshake size={22} strokeWidth={2} />}
                            {!isWin && !isDraw && (
                                <Flag size={22} strokeWidth={2} />
                            )}
                        </Box>
                        <Text
                            as="span"
                            customClass={`gos-reason gos-reason--${result}`}
                        >
                            {reasonLabel}
                        </Text>
                    </Box>

                    {/* Streak banner — shown on win with streak ≥ 3 */}
                    {showStreakBanner && (
                        <Box customClass="gos-streak-banner">
                            <Text as="span" customClass="gos-streak-fire">
                                🔥
                            </Text>
                            <Text as="span" customClass="gos-streak-text">
                                {streakCount} WIN STREAK!
                            </Text>
                            <Text as="span" customClass="gos-streak-fire">
                                🔥
                            </Text>
                        </Box>
                    )}

                    {/* Bottom stats — Rating (PvP only) + Accuracy */}
                    {mode === "pvp" ? (
                        <Box customClass="gos-stats-row">
                            <Box customClass="gos-stat">
                                <Text as="span" customClass="gos-stat-label">
                                    {playGameOverRatingLabel}
                                </Text>
                                <Text
                                    as="span"
                                    customClass={`gos-stat-value gos-rating--${result}`}
                                >
                                    {ratingDeltaLabel}
                                </Text>
                            </Box>
                            <Box customClass="gos-stat gos-stat--right">
                                <Text as="span" customClass="gos-stat-label">
                                    {playGameOverAccuracyLabel}
                                </Text>
                                <Text
                                    as="span"
                                    customClass="gos-stat-value gos-accuracy"
                                >
                                    {accuracyLabel}
                                </Text>
                            </Box>
                        </Box>
                    ) : (
                        <Box customClass="gos-accuracy-solo">
                            <Text as="span" customClass="gos-stat-label">
                                {playGameOverAccuracyLabel}
                            </Text>
                            <Text
                                as="span"
                                customClass={`gos-accuracy-solo-value gos-accuracy`}
                            >
                                {accuracyLabel}
                            </Text>
                        </Box>
                    )}
                    {settlementUsd !== undefined && (
                        <Box customClass="gos-stats-row">
                            <Box customClass="gos-stat">
                                <Text as="span" customClass="gos-stat-label">
                                    {playGameOverSettlementLabel}
                                </Text>
                                <Text
                                    as="span"
                                    customClass={`gos-stat-value gos-rating--${result}`}
                                >
                                    {settlementUsd >= 0 ? "+" : ""}$
                                    {settlementUsd.toFixed(2)}
                                </Text>
                            </Box>
                        </Box>
                    )}

                    {/* Opponent badge */}
                    <Box customClass="gos-opponent-row">
                        <Box customClass="gos-opponent">
                            <Text as="span" customClass="gos-opponent-icon">
                                ⚙
                            </Text>
                            <Text as="span" customClass="gos-opponent-name">
                                vs {opponentName} ({opponentRating})
                            </Text>
                        </Box>
                    </Box>

                    {/* Progress line */}
                    <Box customClass="gos-progress">
                        <Box
                            customClass={`gos-progress-bar gos-progress-bar--${result}`}
                        />
                    </Box>
                </Box>

                {/* ── Buttons ── */}
                <Box customClass="gos-actions">
                    {canRematch && (
                        <Box
                            customClass={`gos-rematch gos-rematch--${rematchStatus}`}
                        >
                            {rematchStatus === "idle" && (
                                <Button
                                    variant="outline"
                                    fullWidth
                                    customClass="gos-btn-secondary gos-rematch-btn"
                                    onClick={onRematch}
                                >
                                    <RefreshCw size={14} />
                                    <Text as="span">
                                        {playGameOverRematchButton}
                                    </Text>
                                </Button>
                            )}
                            {rematchStatus === "offered" && (
                                <Box customClass="gos-rematch-waiting">
                                    <Text
                                        as="span"
                                        customClass="gos-rematch-waiting-text"
                                    >
                                        {playGameOverWaitingForOpponent(
                                            rematchSecondsLeft,
                                        )}
                                    </Text>
                                </Box>
                            )}
                            {rematchStatus === "opponent-offered" && (
                                <Button
                                    variant="primary"
                                    fullWidth
                                    customClass="gos-rematch-accept-btn"
                                    onClick={onRematch}
                                >
                                    <Check size={14} />
                                    <Text as="span">
                                        {playGameOverAcceptRematchButton}
                                    </Text>
                                </Button>
                            )}
                            {rematchStatus === "found" && (
                                <Text
                                    as="span"
                                    customClass="gos-rematch-waiting-text"
                                >
                                    {playGameOverRematchFoundStarting}
                                </Text>
                            )}
                        </Box>
                    )}
                    <Button variant="primary" fullWidth onClick={onNewGame}>
                        <Text as="span" customClass="gos-btn-icon">
                            ⊕
                        </Text>
                        <Text as="span">{playGameOverNewGameButton}</Text>
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
