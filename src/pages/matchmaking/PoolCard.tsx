import { Activity, Users, Flame } from "lucide-react";
import clsx from "clsx";
import Card from "../../components/base/Card/Card";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import { CATEGORY_META, CURRENCY_META } from "@/constants/config";
import { formateAmount, formateTimeControl } from "@/utils/formate";
import {
    matchmakingPoolCardHot,
    matchmakingPoolCardPrizeLabel,
    matchmakingPoolCardQueued,
    matchmakingPoolCardActive,
} from "@/components/messages";
import type { Pool } from "@/types/types";

interface IPoolCardProps {
    pool: Pool;
    selected: boolean;
    onSelect: () => void;
}

function PoolCard({ pool: p, selected, onSelect }: IPoolCardProps) {
    const stake = formateAmount(p.stake, p.currency);
    const prize = formateAmount(p.prize, p.currency);
    const timeLabel = formateTimeControl(p.time);
    const cat = CATEGORY_META[p.category];
    // Pools are always staked in USD now.
    const meta = CURRENCY_META.USD;
    const CurrencyIcon = meta.icon;

    return (
        <Card
            customClass={clsx("pool-card", selected && "selected")}
            onClick={onSelect}
        >
            {/* Category badge */}
            <Box customClass="pool-category-row">
                <Text font="mono" size={10} customClass="pool-category-badge">
                    {cat.emoji} {cat.label}
                </Text>
                {p.hot && (
                    <Box customClass="pool-hot-badge">
                        <Flame size={10} strokeWidth={2.5} />
                        <Text as="span" font="mono" size={9} weight={700}>
                            {matchmakingPoolCardHot}
                        </Text>
                    </Box>
                )}
            </Box>

            <Box customClass="pool-card-top">
                <Box>
                    <Box customClass="pool-stake-row">
                        <CurrencyIcon
                            size={13}
                            strokeWidth={2}
                            style={{ color: meta.color, flexShrink: 0 }}
                        />
                        <Text
                            font="mono"
                            size={16}
                            weight={700}
                            color="white"
                            customClass="pool-stake"
                        >
                            {stake}
                        </Text>
                    </Box>
                    <Text
                        font="mono"
                        size={11}
                        color="muted"
                        customClass="pool-meta"
                    >
                        {timeLabel}
                    </Text>
                </Box>
                <Box customClass="pool-right">
                    <Text
                        font="mono"
                        size={14}
                        weight={700}
                        color="accent"
                        customClass="pool-prize"
                    >
                        {prize}
                    </Text>
                    <Text font="mono" size={10} color="muted">
                        {matchmakingPoolCardPrizeLabel}
                    </Text>
                </Box>
            </Box>

            <Box customClass="pool-card-bottom">
                <Box customClass="pool-stat">
                    <Users size={10} />
                    <Text font="mono" size={11} color="muted">
                        {matchmakingPoolCardQueued(p.players)}
                    </Text>
                </Box>
                <Box customClass="pool-stat">
                    <Activity size={10} />
                    <Text font="mono" size={11} color="muted">
                        {matchmakingPoolCardActive(p.active)}
                    </Text>
                </Box>
                <Box customClass="pool-volume-bars">
                    {Array.from({ length: 5 }, (_, i) => (
                        <Box
                            key={i}
                            customClass="pool-volume-bar"
                            style={{
                                height: Math.max(
                                    4,
                                    Math.min(
                                        14,
                                        (p.players / 200) * 3 - i * 1.5,
                                    ),
                                ),
                                background:
                                    i < Math.floor(p.players / 200)
                                        ? "#39ff88"
                                        : "rgba(57,255,136,0.25)",
                            }}
                        />
                    ))}
                </Box>
            </Box>
        </Card>
    );
}

export default PoolCard;
