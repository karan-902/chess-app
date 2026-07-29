import clsx from "clsx";
import { Trophy, Flag, Handshake } from "lucide-react";
import Card from "@/components/base/Card/Card";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Avatar from "@/components/base/Avatar/Avatar";
import { formateAmount } from "@/utils/formate";
import { formatRelativeTime } from "@/utils";
import { getAvatarUrl } from "@/utils/avatar";
import {
    historyAbandonedSuffix,
    historyResultLabels,
    historyTimeControlLabel,
} from "@/components/messages";
import type { IGameHistoryItem } from "@/types/types";

const RESULT_LABEL: Record<IGameHistoryItem["result"], string> =
    historyResultLabels;

interface IGameHistoryRowProps {
    game: IGameHistoryItem;
}

const ABANDONED_REASONS = new Set(["inactivity", "opponent_disconnected"]);

export default function GameHistoryItem({ game }: IGameHistoryRowProps) {
    const isWin = game.result === "win";
    const isLoss = game.result === "loss";
    const timeControlLabel = historyTimeControlLabel(
        Math.round(game.time_seconds / 60),
    );
    const netAmount = game.settlement_usd;

    return (
        <Card customClass="history-item">
            <Box
                customClass={clsx(
                    "history-icon",
                    isWin && "pos",
                    isLoss && "neg",
                    !isWin && !isLoss && "draw",
                )}
            >
                {isWin && <Trophy size={17} strokeWidth={1.8} />}
                {isLoss && <Flag size={17} strokeWidth={1.8} />}
                {!isWin && !isLoss && <Handshake size={17} strokeWidth={1.8} />}
            </Box>
            <Avatar
                letter={game.opponent.username[0]?.toUpperCase() ?? "?"}
                src={getAvatarUrl(game.opponent.avatar_seed)}
                size="sm"
                variant="neutral"
            />
            <Box customClass="history-info">
                <Text
                    font="inter"
                    size={14}
                    color="white"
                    customClass="history-desc"
                >
                    {RESULT_LABEL[game.result]} vs. {game.opponent.username}
                </Text>
                <Text
                    font="mono"
                    size={11}
                    color="muted"
                    customClass="history-meta"
                >
                    {timeControlLabel} · {game.opponent.elo_rating} elo
                    {ABANDONED_REASONS.has(game.end_reason) &&
                        ` · ${historyAbandonedSuffix}`}
                    {" · "}
                    {formatRelativeTime(game.played_at)}
                </Text>
            </Box>
            <Box customClass="history-amounts">
                <Text
                    font="mono"
                    size={14}
                    weight={700}
                    customClass={clsx(
                        "history-amount",
                        isWin && "pos",
                        isLoss && "neg",
                    )}
                >
                    {netAmount > 0
                        ? `+${formateAmount(netAmount, game.currency)}`
                        : netAmount < 0
                          ? `-${formateAmount(Math.abs(netAmount), game.currency)}`
                          : formateAmount(0, game.currency)}
                </Text>
            </Box>
        </Card>
    );
}
