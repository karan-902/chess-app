import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router";
import classNames from "classnames";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import Card from "@/components/base/Card/Card";
import Drawer from "@/components/base/Drawer/Drawer";
import Skeleton from "@/components/base/Skeleton/Skeleton";
import Switch from "@/components/base/Switch/Switch";
import Input from "@/components/base/Input/Input";
import Label from "@/components/base/Label/Label";
import OtpInput from "@/components/base/OtpInput/OtpInput";
import ChipSelect from "@/components/common/ChipSelect";
import { formatText } from "@/utils/format";
import { formatMMSS } from "@/utils";
import { Copy, Check, Clipboard } from "lucide-react";
import BoardPreview from "@/components/board/BoardPreview";
import { ShatranjLogo } from "@/components/constants";
import GameRoom from "./GameRoom";
import { usePools } from "@/hooks/usePools";
import { useMatchmaking } from "@/hooks/useMatchmaking";
import { useRoomMatch } from "@/hooks/useRoomMatch";
import { useWalletBalance } from "@/hooks/useWallet";
import { CATEGORY_META, QUEUE_TIMEOUT_SECONDS } from "@/constants/config";
import { TIME_SECONDS } from "@/constants";
import type { GameCategory, Pool } from "@/types/types";
import type {
    Difficulty,
    IDurationWheelProps,
    RoomTab,
} from "@/types/components";
import {
    playPageHint,
    playSheetCardPlayButton,
    playSheetTip,
    playSheetPracticeLabel,
    playSheetPracticeTitle,
    playSheetPracticeDesc,
    playSheetFriendLabel,
    playSheetFriendTitle,
    playSheetFriendDesc,
    roomCreateTabLabel,
    roomJoinTabLabel,
    roomStakeLabel,
    roomStakeRequired,
    roomStakeInsufficientBalance,
    roomTimeLabel,
    roomMinutesSuffix,
    roomRatedLabel,
    roomCreateButton,
    roomJoinCodeLabel,
    roomPasteLabel,
    roomJoinButton,
    roomWaitingTitle,
    roomWaitingDesc,
    roomExpiresIn,
    roomCopyButton,
    roomCopiedButton,
    roomCancelButton,
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
    MAX_AMOUNT_DIGITS,
} from "@/constants/messages";

const PRACTICE_DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

const CATEGORY_ORDER: GameCategory[] = [
    "BULLET",
    "BLITZ",
    "RAPID",
    "CLASSICAL",
];

const ROOM_TABS: RoomTab[] = ["create", "join"];
const STAKE_CHIP_AMOUNTS = [10, 25, 50, 100, 500];
const DURATION_MINUTES = Array.from({ length: 30 }, (_, i) => i + 1);
const DURATION_WHEEL_ITEM_HEIGHT = 44.8;

function DurationWheel({ value, onChange }: IDurationWheelProps) {
    const listRef = useRef<HTMLDivElement>(null);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        listRef.current?.scrollTo({
            top: (value - DURATION_MINUTES[0]) * DURATION_WHEEL_ITEM_HEIGHT,
        });
    }, []);

    const scrollToValue = (minutes: number) => {
        listRef.current?.scrollTo({
            top: (minutes - DURATION_MINUTES[0]) * DURATION_WHEEL_ITEM_HEIGHT,
            behavior: "smooth",
        });
    };

    const handleScroll = () => {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
            const el = listRef.current;
            if (!el) return;
            const index = Math.round(el.scrollTop / DURATION_WHEEL_ITEM_HEIGHT);
            const picked =
                DURATION_MINUTES[
                    Math.min(Math.max(index, 0), DURATION_MINUTES.length - 1)
                ];
            if (picked !== value) onChange(picked);
        }, 120);
    };

    return (
        <Box customClass="duration-wheel">
            <Box customClass="duration-wheel-highlight" />
            <Box
                customClass="duration-wheel-list"
                ref={listRef}
                onScroll={handleScroll}
            >
                <Box customClass="duration-wheel-pad" />
                {DURATION_MINUTES.map((minutes) => (
                    <Text
                        key={minutes}
                        customClass={classNames(
                            "duration-wheel-item",
                            minutes === value && "active",
                        )}
                        onClick={() => {
                            onChange(minutes);
                            scrollToValue(minutes);
                        }}
                    >
                        {minutes} {roomMinutesSuffix}
                    </Text>
                ))}
                <Box customClass="duration-wheel-pad" />
            </Box>
        </Box>
    );
}

function LivePulse() {
    return (
        <Box customClass="live-ring-wrap">
            <Text component="span" customClass="live-dot" />
            <Text component="span" customClass="live-ring" />
        </Box>
    );
}

function PoolCardSkeleton() {
    return (
        <Card customClass="stake-card">
            <Box customClass="pool-meta">
                <Skeleton variant="circular" width={14} height={14} />
                <Skeleton customClass="text" width={78} height={14} />
            </Box>
            <Skeleton
                customClass="text"
                width={40}
                height={14}
                style={{ marginBottom: "0.35rem", alignSelf: "center" }}
            />
            <Skeleton
                customClass="text"
                width={60}
                height={24}
                style={{ marginTop: "0.1rem", alignSelf: "center" }}
            />
            <Skeleton
                customClass="text"
                width={70}
                height={14}
                style={{ marginTop: "0.25rem", alignSelf: "center" }}
            />
            <Skeleton
                variant="rounded"
                width="100%"
                height={35}
                style={{ marginTop: "auto" }}
            />
        </Card>
    );
}

export default function PlayPage() {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { pools, loading: poolsLoading } = usePools();
    const { usdValue } = useWalletBalance();
    const { status, queuedPool, joinQueue, leaveQueue, resetStatus } =
        useMatchmaking();
    const [secondsLeft, setSecondsLeft] = useState(0);
    const gameId = searchParams.get("game_id");
    const [practiceDifficulty, setPracticeDifficulty] =
        useState<Difficulty>("easy");
    const [practiceTimeControl, setPracticeTimeControl] =
        useState<GameCategory>("RAPID");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmPool, setConfirmPool] = useState<Pool | null>(null);
    const [practiceOpen, setPracticeOpen] = useState(false);

    const {
        status: roomStatus,
        roomCode,
        expiresInSeconds,
        createRoom,
        joinRoom,
        cancelRoom,
        resetStatus: resetRoomStatus,
    } = useRoomMatch();

    const [roomOpen, setRoomOpen] = useState(false);
    const [roomTab, setRoomTab] = useState<RoomTab>("create");
    const [roomStake, setRoomStake] = useState("");
    const [roomStakeError, setRoomStakeError] = useState("");
    const [roomMinutes, setRoomMinutes] = useState(String(DURATION_MINUTES[4]));
    const [roomRated, setRoomRated] = useState(false);
    const [joinCode, setJoinCode] = useState("");
    const [codeCopied, setCodeCopied] = useState(false);

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
        setConfirmOpen(false);
        if (!gameId) resetStatus();
    }, [status, gameId, resetStatus]);

    useEffect(() => {
        if (status === "idle") {
            setConfirmOpen(false);
            setConfirmPool(null);
        }
    }, [status]);

    useEffect(() => {
        if (roomStatus !== "found") return;
        setRoomOpen(false);
    }, [roomStatus]);

    if (gameId) {
        return <GameRoom />;
    }

    const handlePractice = () => {
        setPracticeOpen(false);
        const gameId = `pvc-${Date.now()}`;
        const color = Math.random() < 0.5 ? "white" : "black";
        try {
            sessionStorage.setItem(`pvc_color:${gameId}`, color);
        } catch {}
        navigate(
            `/play?mode=pvc&time=${practiceTimeControl}&difficulty=${practiceDifficulty}&game_id=${gameId}&color=${color}`,
            { replace: true },
        );
    };

    const handlePracticeOpen = () => {
        setSheetOpen(false);
        setPracticeOpen(true);
    };

    const handlePracticeCancel = () => {
        setPracticeOpen(false);
        setSheetOpen(true);
    };

    const handleRoomOpen = () => {
        setSheetOpen(false);
        setRoomTab("create");
        setRoomStake("");
        setRoomStakeError("");
        setRoomMinutes(String(DURATION_MINUTES[4]));
        setRoomRated(false);
        setJoinCode("");
        resetRoomStatus();
        setRoomOpen(true);
    };

    const handleRoomClose = () => {
        if (roomStatus === "waiting") cancelRoom();
        setRoomOpen(false);
    };

    const handleRoomCancel = () => {
        cancelRoom();
        setRoomOpen(false);
        setSheetOpen(true);
    };

    const handleCreateRoomSubmit = () => {
        const stake = Number(roomStake);
        if (!stake || stake <= 0) {
            setRoomStakeError(roomStakeRequired);
            return;
        }
        if (stake > usdValue) {
            setRoomStakeError(roomStakeInsufficientBalance);
            return;
        }
        setRoomStakeError("");
        const minutes = Number(roomMinutes);
        if (!minutes || minutes <= 0) return;
        createRoom(stake, Math.round(minutes * 60), roomRated);
    };

    const handleJoinRoomSubmit = () => {
        const code = joinCode.trim();
        if (!code) return;
        joinRoom(code);
    };

    const handleCopyCode = () => {
        if (!roomCode) return;
        navigator.clipboard.writeText(roomCode);
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 1500);
    };

    const handlePasteCode = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setJoinCode(
                text
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "")
                    .slice(0, 6),
            );
        } catch {}
    };

    const handlePoolPlay = (pool: Pool) => {
        setSheetOpen(false);
        setConfirmPool(pool);
        setConfirmOpen(true);
    };

    const handleConfirmJoin = () => {
        if (!confirmPool) return;
        joinQueue(confirmPool);
    };

    const handleConfirmCancel = () => {
        setConfirmOpen(false);
        setConfirmPool(null);
        setSheetOpen(true);
    };

    const handleConfirmDrawerClose = () => {
        if (status === "joining" || status === "queued") leaveQueue();
        setConfirmOpen(false);
        setConfirmPool(null);
    };

    return (
        <Box customClass="play-page">
            <Box customClass="play-body">
                <Box customClass="board-wrap">
                    <BoardPreview />
                </Box>
                <Text customClass="play-hint description">{playPageHint}</Text>
            </Box>

            <Box customClass="cta-bottom">
                <Button
                    type="button"
                    variant="contained"
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
                onClose={() => setSheetOpen(false)}
                customClass="stake-sheet"
            >
                <Box customClass="stake-grid">
                    {poolsLoading ? (
                        Array.from({ length: 4 }, (_, i) => (
                            <PoolCardSkeleton key={i} />
                        ))
                    ) : (
                        <>
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
                                        )}
                                    >
                                        {pool.players > 0 && (
                                            <Box customClass="stake-card-live-corner">
                                                <LivePulse />
                                            </Box>
                                        )}
                                        <Box customClass="pool-meta">
                                            <CategoryIcon
                                                className="stake-card-icon"
                                                size="1em"
                                                strokeWidth={2}
                                            />
                                            <Text
                                                customClass="description"
                                                component="span"
                                            >
                                                {formatText(
                                                    CATEGORY_META[pool.category]
                                                        ?.label ?? "",
                                                )}{" "}
                                                &middot;{" "}
                                            </Text>
                                            <Text
                                                component="span"
                                                customClass="description"
                                            >
                                                {timeLabel}
                                            </Text>
                                            {pool.active > 0 && <LivePulse />}
                                        </Box>
                                        <Text customClass="stake-card-tc">
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
                                            <Text customClass="pool-opponent-ready caption">
                                                {
                                                    matchmakingPoolCardOpponentReady
                                                }
                                            </Text>
                                        )}

                                        <Button
                                            type="button"
                                            variant="contained"
                                            fullWidth
                                            customClass="stake-card-go"
                                            onClick={() =>
                                                canAfford
                                                    ? handlePoolPlay(pool)
                                                    : navigate("/wallet")
                                            }
                                        >
                                            {canAfford
                                                ? playSheetCardPlayButton
                                                : matchmakingPoolCardInsufficientBalance}
                                        </Button>
                                    </Card>
                                );
                            })}
                        </>
                    )}
                    <Card customClass={classNames("stake-card", "practice")}>
                        <Text customClass="stake-card-tc">
                            {playSheetPracticeLabel}
                        </Text>
                        <Text customClass="stake-card-practice-title">
                            {playSheetPracticeTitle}
                        </Text>
                        <Text customClass="caption">
                            {playSheetPracticeDesc}
                        </Text>
                        <Button
                            type="button"
                            variant="contained"
                            fullWidth
                            customClass="stake-card-go"
                            onClick={handlePracticeOpen}
                        >
                            {playSheetCardPlayButton}
                        </Button>
                    </Card>
                    <Card customClass={classNames("stake-card", "friend")}>
                        <Text customClass="stake-card-tc">
                            {playSheetFriendLabel}
                        </Text>
                        <Text customClass="stake-card-practice-title">
                            {playSheetFriendTitle}
                        </Text>
                        <Text customClass="caption">
                            {playSheetFriendDesc}
                        </Text>
                        <Button
                            type="button"
                            variant="contained"
                            fullWidth
                            customClass="stake-card-go"
                            onClick={handleRoomOpen}
                        >
                            {playSheetCardPlayButton}
                        </Button>
                    </Card>
                </Box>
                <Text customClass="sheet-tip meta-text">
                    <b>Tip:</b> {playSheetTip}
                </Text>
            </Drawer>

            <Drawer
                anchor="bottom"
                open={practiceOpen}
                onClose={() => setPracticeOpen(false)}
                customClass="practice-sheet"
            >
                <Box customClass="matchmaking-searching practice-options">
                    <ChipSelect
                        options={PRACTICE_DIFFICULTIES}
                        value={practiceDifficulty}
                        onChange={setPracticeDifficulty}
                        label={(d) => playWagerBadgeDifficultyLabels[d]}
                        customClass="segment compact"
                    />
                    <ChipSelect
                        options={CATEGORY_ORDER}
                        value={practiceTimeControl}
                        onChange={setPracticeTimeControl}
                        label={(c) => CATEGORY_META[c]?.label}
                        subLabel={(c) =>
                            historyTimeControlLabel(TIME_SECONDS[c] / 60)
                        }
                        customClass="segment category-select"
                    />
                    <Box customClass="pool-confirm-actions">
                        <Button
                            type="button"
                            variant="contained"
                            fullWidth
                            customClass="stake-card-go"
                            onClick={handlePractice}
                        >
                            {playSheetCardPlayButton}
                        </Button>
                        <Button
                            type="button"
                            variant="outlined"
                            fullWidth
                            customClass="pool-confirm-cancel-btn"
                            onClick={handlePracticeCancel}
                        >
                            {matchmakingConfirmCancelButton}
                        </Button>
                    </Box>
                </Box>
            </Drawer>

            <Drawer
                anchor="bottom"
                open={roomOpen}
                onClose={handleRoomClose}
                customClass="room-sheet"
            >
                {roomStatus === "waiting" ? (
                    <Box customClass="matchmaking-searching">
                        <Text customClass="dialog-title">
                            {roomWaitingTitle}
                        </Text>
                        <Text customClass="matches-empty-desc description">
                            {roomWaitingDesc}
                        </Text>
                        <Text customClass="searching-timer">{roomCode}</Text>
                        <Text customClass="matches-empty-desc description">
                            {roomExpiresIn(formatMMSS(expiresInSeconds))}
                        </Text>
                        <Button
                            type="button"
                            variant="outlined"
                            fullWidth
                            customClass="pool-confirm-cancel-btn"
                            startIcon={
                                codeCopied ? (
                                    <Check size={14} />
                                ) : (
                                    <Copy size={14} />
                                )
                            }
                            onClick={handleCopyCode}
                        >
                            {codeCopied ? roomCopiedButton : roomCopyButton}
                        </Button>
                        <Box customClass="pool-confirm-actions">
                            <Button
                                type="button"
                                variant="outlined"
                                fullWidth
                                customClass="pool-confirm-cancel-btn"
                                onClick={handleRoomCancel}
                            >
                                {roomCancelButton}
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Box customClass="matchmaking-searching room-options">
                        <Text customClass="sheet-title dialog-title">
                            {playSheetFriendTitle}
                        </Text>
                        <ChipSelect
                            options={ROOM_TABS}
                            value={roomTab}
                            onChange={setRoomTab}
                            label={(t) =>
                                t === "create"
                                    ? roomCreateTabLabel
                                    : roomJoinTabLabel
                            }
                            customClass="segment compact"
                        />
                        {roomTab === "create" ? (
                            <>
                                <Box customClass="room-field room-stake-field">
                                    <Label
                                        htmlFor="room-stake"
                                        customClass="room-field-label room-stake-label"
                                    >
                                        {roomStakeLabel}
                                    </Label>
                                    <Input
                                        id="room-stake"
                                        type="text"
                                        inputMode="numeric"
                                        slotProps={{
                                            input: {
                                                maxLength: MAX_AMOUNT_DIGITS,
                                            },
                                        }}
                                        fullWidth
                                        placeholder="0.00"
                                        customClass="amount-input-hero"
                                        value={roomStake}
                                        isError={!!roomStakeError}
                                        helperText={roomStakeError}
                                        onChange={(e) => {
                                            setRoomStake(
                                                e.target.value
                                                    .replace(/\D/g, "")
                                                    .replace(/^0+/, "")
                                                    .slice(
                                                        0,
                                                        MAX_AMOUNT_DIGITS,
                                                    ),
                                            );
                                            setRoomStakeError("");
                                        }}
                                    />
                                    <Box customClass="tx-filter-chip-grid room-stake-chips">
                                        {STAKE_CHIP_AMOUNTS.map((amount) => (
                                            <Button
                                                key={amount}
                                                type="button"
                                                customClass={classNames(
                                                    "tx-filter-chip",
                                                    roomStake ===
                                                        String(amount) &&
                                                        "active",
                                                )}
                                                onClick={() => {
                                                    setRoomStake(
                                                        String(amount),
                                                    );
                                                    setRoomStakeError("");
                                                }}
                                            >
                                                ${amount}
                                            </Button>
                                        ))}
                                    </Box>
                                </Box>

                                <Box customClass="room-field room-duration-field">
                                    <Label customClass="room-field-label room-stake-label">
                                        {roomTimeLabel}
                                    </Label>
                                    <DurationWheel
                                        value={Number(roomMinutes)}
                                        onChange={(minutes) =>
                                            setRoomMinutes(String(minutes))
                                        }
                                    />
                                </Box>

                                <Box
                                    sx={{ display: "none !important" }}
                                    customClass="matches-stat-row"
                                >
                                    <Text component="span">
                                        {roomRatedLabel}
                                    </Text>
                                    <Switch
                                        checked={roomRated}
                                        onChange={(e) =>
                                            setRoomRated(e.target.checked)
                                        }
                                    />
                                </Box>
                                <Box customClass="create-room-button-wrap">
                                    <Button
                                        type="button"
                                        variant="contained"
                                        fullWidth
                                        customClass="create-room-button stake-card-go"
                                        disabled={
                                            !(Number(roomStake) > 0) ||
                                            !(Number(roomMinutes) > 0)
                                        }
                                        isLoading={roomStatus === "creating"}
                                        loaderOnDark
                                        onClick={handleCreateRoomSubmit}
                                    >
                                        {roomCreateButton}
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box customClass="room-field">
                                    <Box customClass="room-field-head">
                                        <Label customClass="room-field-label">
                                            {roomJoinCodeLabel}
                                        </Label>
                                        <Button
                                            customClass="room-paste-btn"
                                            onClick={handlePasteCode}
                                        >
                                            <Clipboard size={14} />
                                            {roomPasteLabel}
                                        </Button>
                                    </Box>
                                    <OtpInput
                                        length={6}
                                        value={joinCode}
                                        alphanumeric
                                        onChange={(v) =>
                                            setJoinCode(
                                                v
                                                    .toUpperCase()
                                                    .replace(/[^A-Z0-9]/g, ""),
                                            )
                                        }
                                    />
                                </Box>
                                <Button
                                    type="button"
                                    variant="contained"
                                    fullWidth
                                    customClass="create-room-button stake-card-go"
                                    disabled={joinCode.length !== 6}
                                    isLoading={roomStatus === "joining"}
                                    loaderOnDark
                                    onClick={handleJoinRoomSubmit}
                                >
                                    {roomJoinButton}
                                </Button>
                            </>
                        )}
                    </Box>
                )}
            </Drawer>

            <Drawer
                anchor="bottom"
                open={confirmOpen}
                onClose={handleConfirmDrawerClose}
                customClass="pool-confirm-sheet"
            >
                {status === "queued" || status === "found" ? (
                    <Box customClass="matchmaking-searching">
                        <Box customClass="live-ring-wrap searching-ring">
                            <Box customClass="searching-logo">
                                <ShatranjLogo size={44} showText={false} />
                            </Box>
                            <Text component="span" customClass="live-ring" />
                        </Box>
                        <Text customClass="dialog-title" aria-live="polite">
                            {status === "found"
                                ? matchmakingSearchingOpponentFound
                                : matchmakingSearchingFindingOpponent}
                        </Text>
                        <Text customClass="searching-timer">
                            {matchmakingSearchingSecondsLeft(secondsLeft)}
                        </Text>
                        <Box customClass="searching-details">
                            <Box customClass="searching-detail-item">
                                <Text customClass="searching-detail-label caption">
                                    {matchmakingSearchingStakeLabel}
                                </Text>
                                <Text customClass="searching-detail-value value-heading">
                                    ${queuedPool?.stake}
                                </Text>
                            </Box>
                            <Box customClass="searching-detail-item">
                                <Text customClass="searching-detail-label caption">
                                    {matchmakingSearchingPrizeLabel}
                                </Text>
                                <Text customClass="searching-detail-value value-heading win-prize">
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
                ) : (
                    confirmPool && (
                        <Box customClass="matchmaking-searching">
                            <Text customClass="dialog-title">
                                {matchmakingConfirmTitle}
                            </Text>
                            <Text customClass="matches-empty-desc description">
                                {matchmakingConfirmDescription}
                            </Text>
                            <Box customClass="searching-details">
                                <Box customClass="searching-detail-item">
                                    <Text customClass="searching-detail-label caption">
                                        {matchmakingSearchingStakeLabel}
                                    </Text>
                                    <Text customClass="searching-detail-value value-heading">
                                        ${confirmPool.stake}
                                    </Text>
                                </Box>
                                <Box customClass="searching-detail-item">
                                    <Text customClass="searching-detail-label caption">
                                        {matchmakingSearchingPrizeLabel}
                                    </Text>
                                    <Text customClass="searching-detail-value value-heading win-prize">
                                        ${confirmPool.prize}
                                    </Text>
                                </Box>
                            </Box>
                            <Box customClass="pool-confirm-actions">
                                <Button
                                    type="button"
                                    variant="contained"
                                    fullWidth
                                    customClass="stake-card-go"
                                    isLoading={status === "joining"}
                                    loaderOnDark
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
                                    onClick={handleConfirmCancel}
                                >
                                    {matchmakingConfirmCancelButton}
                                </Button>
                            </Box>
                        </Box>
                    )
                )}
            </Drawer>
        </Box>
    );
}
