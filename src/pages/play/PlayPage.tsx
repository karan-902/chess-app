import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router";
import classNames from "classnames";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import Card from "@/components/base/Card/Card";
import Drawer from "@/components/base/Drawer/Drawer";
import BoardPreview from "@/components/board/BoardPreview";
import { ShatranjLogo } from "@/components/constants";
import GameRoom from "./GameRoom";
import { usePools } from "@/hooks/usePools";
import { useMatchmaking } from "@/hooks/useMatchmaking";
import { useWalletBalance } from "@/hooks/useWallet";
import { CATEGORY_META, QUEUE_TIMEOUT_SECONDS } from "@/constants/config";
import type { GameCategory, Pool } from "@/types/types";
import { TIME_SECONDS } from "@/types/components";
import type { Difficulty } from "@/types/components";
import {
    playPageHint,
    playSheetCardPlayButton,
    playSheetTip,
    playSheetPracticeLabel,
    playSheetPracticeTitle,
    playSheetPracticeDesc,
    lobbyPlayNowButton,
    matchmakingPoolCardWinLabel,
    matchmakingPoolCardEntryFee,
    matchmakingPoolCardOpponentReady,
    matchmakingPoolCardInsufficientBalance,
    matchmakingSearchingSecondsLeft,
    matchmakingSearchingCancelButton,
    matchmakingSearchingFindingOpponent,
    matchmakingSearchingOpponentFound,
    matchmakingSearchingStakeLabel,
    matchmakingSearchingPrizeLabel,
    matchmakingConfirmTitle,
    matchmakingConfirmDescription,
    matchmakingConfirmCancelButton,
    matchmakingCtaFindOpponentButton,
    historyTimeControlLabel,
    playWagerBadgeDifficultyLabels,
} from "@/constants/messages";

const PRACTICE_DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

const CATEGORY_ORDER: GameCategory[] = [
    "BULLET",
    "BLITZ",
    "RAPID",
    "CLASSICAL",
];

function LivePulse() {
    return (
        <Box customClass="live-ring-wrap">
            <Text component="span" customClass="live-dot" />
            <Text component="span" customClass="live-ring" />
        </Box>
    );
}

function ChipSelect<T extends string>({
    options,
    value,
    onChange,
    label,
    subLabel,
    customClass = "segment",
}: {
    options: T[];
    value: T;
    onChange: (value: T) => void;
    label: (option: T) => string;
    subLabel?: (option: T) => string;
    customClass?: string;
}) {
    const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const [thumb, setThumb] = useState({ left: 0, width: 0 });

    useLayoutEffect(() => {
        const btn = btnRefs.current[options.indexOf(value)];
        if (!btn) return;
        setThumb({ left: btn.offsetLeft, width: btn.offsetWidth });
    }, [value, options]);

    return (
        <Box customClass={customClass}>
            <Box
                customClass="segment-thumb"
                style={{
                    width: thumb.width,
                    transform: `translateX(${thumb.left}px)`,
                }}
            />
            {options.map((option, i) => (
                <Button
                    key={option}
                    ref={(el) => {
                        btnRefs.current[i] = el;
                    }}
                    type="button"
                    customClass={classNames(
                        "segment-btn",
                        value === option && "active",
                    )}
                    onClick={() => onChange(option)}
                >
                    <Text component="span" customClass="segment-btn-label">
                        {label(option)}
                    </Text>
                    {subLabel && (
                        <Text component="span" customClass="segment-btn-sub">
                            {subLabel(option)}
                        </Text>
                    )}
                </Button>
            ))}
        </Box>
    );
}

export default function PlayPage() {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { pools } = usePools();
    const { usdValue } = useWalletBalance();
    const { status, queuedPool, joinQueue, leaveQueue, resetStatus } =
        useMatchmaking();
    const [secondsLeft, setSecondsLeft] = useState(0);
    const gameId = searchParams.get("game_id");
    const [practiceDifficulty, setPracticeDifficulty] =
        useState<Difficulty>("easy");
    const [practiceTimeControl, setPracticeTimeControl] =
        useState<GameCategory>("RAPID");
    const [confirmPool, setConfirmPool] = useState<Pool | null>(null);
    const [selection, setSelection] = useState<string | "practice" | null>(
        null,
    );
    const selectedPool =
        selection && selection !== "practice"
            ? (pools.find((p) => p.id === selection) ?? null)
            : null;

    useEffect(() => {
        if (status !== "queued" || !queuedPool) return;
        setSecondsLeft(QUEUE_TIMEOUT_SECONDS[queuedPool.category]);
        const interval = setInterval(() => {
            setSecondsLeft((s) => Math.max(s - 1, 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [status, queuedPool]);

    useEffect(() => {
        if (status !== "found") return;
        setSheetOpen(false);
        if (!gameId) resetStatus();
    }, [status, gameId, resetStatus]);

    useEffect(() => {
        if (status === "idle") {
            setConfirmPool(null);
            setSelection(null);
        }
    }, [status]);

    if (gameId) {
        return <GameRoom />;
    }

    const handlePractice = () => {
        setSheetOpen(false);
        navigate(
            `/play?mode=pvc&time=${practiceTimeControl}&difficulty=${practiceDifficulty}&game_id=pvc-${Date.now()}&color=white`,
            { replace: true },
        );
    };

    const handleConfirmJoin = () => {
        if (!confirmPool) return;
        joinQueue(confirmPool);
    };

    return (
        <Box customClass="play-page">
            <Box customClass="play-body">
                <Box customClass="board-wrap">
                    <BoardPreview />
                </Box>
                <Text customClass="play-hint">{playPageHint}</Text>
            </Box>

            <Box customClass="cta-bottom">
                <Button
                    type="button"
                    variant="outlined"
                    fullWidth
                    customClass="play-cta"
                    onClick={() => setSheetOpen(true)}
                >
                    {lobbyPlayNowButton}
                </Button>
            </Box>

            <Drawer
                anchor="bottom"
                open={sheetOpen}
                onClose={() => {
                    if (status === "joining" || status === "queued")
                        leaveQueue();
                    setConfirmPool(null);
                    setSelection(null);
                    setSheetOpen(false);
                }}
                customClass="stake-sheet"
            >
                {status === "queued" || status === "found" ? (
                    <Box customClass="matchmaking-searching">
                        <Box customClass="live-ring-wrap searching-ring">
                            <Box customClass="searching-logo">
                                <ShatranjLogo size={44} showText={false} />
                            </Box>
                            <Text component="span" customClass="live-ring" />
                        </Box>
                        <Text customClass="searching-title" aria-live="polite">
                            {status === "found"
                                ? matchmakingSearchingOpponentFound
                                : matchmakingSearchingFindingOpponent}
                        </Text>
                        <Text customClass="searching-timer">
                            {matchmakingSearchingSecondsLeft(secondsLeft)}
                        </Text>
                        <Box customClass="searching-details">
                            <Box customClass="searching-detail-item">
                                <Text customClass="searching-detail-label">
                                    {matchmakingSearchingStakeLabel}
                                </Text>
                                <Text customClass="searching-detail-value">
                                    ${queuedPool?.stake}
                                </Text>
                            </Box>
                            <Box customClass="searching-detail-item">
                                <Text customClass="searching-detail-label">
                                    {matchmakingSearchingPrizeLabel}
                                </Text>
                                <Text customClass="searching-detail-value">
                                    ${queuedPool?.prize}
                                </Text>
                            </Box>
                        </Box>
                        <Button
                            type="button"
                            variant="outlined"
                            fullWidth
                            customClass="searching-cancel-btn"
                            disabled={status === "found"}
                            onClick={() => leaveQueue()}
                        >
                            {matchmakingSearchingCancelButton}
                        </Button>
                    </Box>
                ) : confirmPool ? (
                    <Box customClass="matchmaking-searching">
                        <Text customClass="searching-title">
                            {matchmakingConfirmTitle}
                        </Text>
                        <Text customClass="matches-empty-desc">
                            {matchmakingConfirmDescription}
                        </Text>
                        <Box customClass="searching-details">
                            <Box customClass="searching-detail-item">
                                <Text customClass="searching-detail-label">
                                    {matchmakingSearchingStakeLabel}
                                </Text>
                                <Text customClass="searching-detail-value">
                                    ${confirmPool.stake}
                                </Text>
                            </Box>
                            <Box customClass="searching-detail-item">
                                <Text customClass="searching-detail-label">
                                    {matchmakingSearchingPrizeLabel}
                                </Text>
                                <Text customClass="searching-detail-value">
                                    ${confirmPool.prize}
                                </Text>
                            </Box>
                        </Box>
                        <Box customClass="pool-confirm-actions">
                            <Button
                                type="button"
                                variant="outlined"
                                fullWidth
                                customClass="stake-card-go"
                                isLoading={status === "joining"}
                                onClick={handleConfirmJoin}
                            >
                                {matchmakingCtaFindOpponentButton}
                            </Button>
                            <Button
                                type="button"
                                variant="outlined"
                                fullWidth
                                customClass="pool-confirm-cancel-btn"
                                disabled={status === "joining"}
                                onClick={() => setConfirmPool(null)}
                            >
                                {matchmakingConfirmCancelButton}
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <>
                        <Box customClass="stake-grid">
                            {pools.map((pool) => {
                                const CategoryIcon =
                                    CATEGORY_META[pool.category]?.icon;
                                const timeLabel = historyTimeControlLabel(
                                    pool.timeSeconds / 60,
                                );
                                const canAfford = usdValue >= pool.stake;
                                return (
                                    <Card
                                        key={pool.id}
                                        customClass={classNames(
                                            "stake-card",
                                            !canAfford && "insufficient",
                                            pool.id === selection &&
                                                "selected",
                                        )}
                                        onClick={
                                            canAfford
                                                ? () => setSelection(pool.id)
                                                : undefined
                                        }
                                    >
                                        {pool.players > 0 && (
                                            <Box customClass="stake-card-live-corner">
                                                <LivePulse />
                                            </Box>
                                        )}
                                        <Box customClass="pool-meta">
                                            <CategoryIcon
                                                className="stake-card-icon"
                                                size={12}
                                                strokeWidth={2}
                                            />
                                            <Text component="span">
                                                {
                                                    CATEGORY_META[pool.category]
                                                        ?.label
                                                }
                                            </Text>
                                            <Text
                                                component="span"
                                                customClass="pool-meta-time"
                                            >
                                                {timeLabel}
                                            </Text>
                                            {pool.active > 0 && <LivePulse />}
                                        </Box>
                                        <Text customClass="pool-win-label">
                                            {matchmakingPoolCardWinLabel}
                                        </Text>
                                        <Text customClass="pool-win-amt">
                                            ${pool.prize}
                                        </Text>
                                        <Text customClass="pool-entry-fee">
                                            {matchmakingPoolCardEntryFee(
                                                `$${pool.stake}`,
                                            )}
                                        </Text>

                                        {pool.players > 0 && (
                                            <Text customClass="pool-opponent-ready">
                                                {
                                                    matchmakingPoolCardOpponentReady
                                                }
                                            </Text>
                                        )}

                                        {!canAfford && (
                                            <Text customClass="pool-insufficient-label">
                                                {
                                                    matchmakingPoolCardInsufficientBalance
                                                }
                                            </Text>
                                        )}
                                    </Card>
                                );
                            })}
                            <Card
                                customClass={classNames(
                                    "stake-card",
                                    "practice",
                                    "wide",
                                    selection === "practice" && "selected",
                                )}
                                onClick={() => setSelection("practice")}
                            >
                                <Text customClass="stake-card-tc">
                                    {playSheetPracticeLabel}
                                </Text>
                                <Text customClass="stake-card-practice-title">
                                    {playSheetPracticeTitle}
                                </Text>
                                <Text customClass="stake-card-fee">
                                    {playSheetPracticeDesc}
                                </Text>
                                <ChipSelect
                                    options={PRACTICE_DIFFICULTIES}
                                    value={practiceDifficulty}
                                    onChange={setPracticeDifficulty}
                                    label={(d) =>
                                        playWagerBadgeDifficultyLabels[d]
                                    }
                                    customClass="segment compact"
                                />
                                <ChipSelect
                                    options={CATEGORY_ORDER}
                                    value={practiceTimeControl}
                                    onChange={setPracticeTimeControl}
                                    label={(c) => CATEGORY_META[c]?.label}
                                    subLabel={(c) =>
                                        historyTimeControlLabel(
                                            TIME_SECONDS[c] / 60,
                                        )
                                    }
                                    customClass="segment category-select"
                                />
                            </Card>
                        </Box>
                        <Button
                            type="button"
                            variant="outlined"
                            fullWidth
                            customClass="stake-card-go"
                            disabled={!selection}
                            onClick={() => {
                                if (selection === "practice") handlePractice();
                                else if (selectedPool)
                                    setConfirmPool(selectedPool);
                            }}
                        >
                            {playSheetCardPlayButton}
                        </Button>
                        <Text customClass="sheet-tip">
                            <b>Tip:</b> {playSheetTip}
                        </Text>
                    </>
                )}
            </Drawer>
        </Box>
    );
}
