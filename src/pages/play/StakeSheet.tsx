import classNames from "classnames";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import Card from "@/components/base/Card/Card";
import Drawer from "@/components/base/Drawer/Drawer";
import PoolCardSkeleton from "@/components/common/PoolCardSkeleton";
import { formatText } from "@/utils/format";
import { CATEGORY_META } from "@/constants/config";
import type { IStakeSheetProps } from "@/types/components";
import {
    playSheetCardPlayButton,
    playSheetTip,
    playSheetPracticeLabel,
    playSheetPracticeTitle,
    playSheetPracticeDesc,
    playSheetFriendLabel,
    playSheetFriendTitle,
    playSheetFriendDesc,
    matchmakingPoolCardWinLabel,
    matchmakingPoolCardEntryFee,
    matchmakingPoolCardOpponentReady,
    matchmakingPoolCardInsufficientBalance,
    historyTimeControlLabel,
} from "@/constants/messages";

function LivePulse() {
    return (
        <Box customClass="live-ring-wrap">
            <Text component="span" customClass="live-dot" />
            <Text component="span" customClass="live-ring" />
        </Box>
    );
}

export default function StakeSheet({
    open,
    onClose,
    pools,
    poolsLoading,
    usdValue,
    onPoolPlay,
    onPracticeOpen,
    onRoomOpen,
    onInsufficientBalance,
}: IStakeSheetProps) {
    return (
        <Drawer
            anchor="bottom"
            open={open}
            onClose={onClose}
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
                                            {matchmakingPoolCardOpponentReady}
                                        </Text>
                                    )}

                                    <Button
                                        type="button"
                                        variant="contained"
                                        fullWidth
                                        customClass="stake-card-go"
                                        onClick={() =>
                                            canAfford
                                                ? onPoolPlay(pool)
                                                : onInsufficientBalance()
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
                    <Text customClass="caption">{playSheetPracticeDesc}</Text>
                    <Button
                        type="button"
                        variant="contained"
                        fullWidth
                        customClass="stake-card-go"
                        onClick={onPracticeOpen}
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
                    <Text customClass="caption">{playSheetFriendDesc}</Text>
                    <Button
                        type="button"
                        variant="contained"
                        fullWidth
                        customClass="stake-card-go"
                        onClick={onRoomOpen}
                    >
                        {playSheetCardPlayButton}
                    </Button>
                </Card>
            </Box>
            <Text customClass="sheet-tip meta-text">
                <b>Tip:</b> {playSheetTip}
            </Text>
        </Drawer>
    );
}
