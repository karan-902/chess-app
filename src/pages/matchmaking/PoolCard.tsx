import { Activity, Users } from "lucide-react";
import clsx from "clsx";
import Card from "../../components/base/Card/Card";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import { formatAmount, formatTimeControl, CATEGORY_META, CURRENCY_META } from "@/constants/currencies";
import type { Pool } from "@/types/types";

interface IPoolCardProps {
    pool: Pool;
    selected: boolean;
    onSelect: () => void;
}

function PoolCard({ pool: p, selected, onSelect }: IPoolCardProps) {
    const stake = formatAmount(p.stake, p.currency);
    const prize = formatAmount(p.prize, p.currency);
    const timeLabel = formatTimeControl(p.time);
    const cat = CATEGORY_META[p.category];
    const meta = CURRENCY_META[p.currency];
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
            </Box>

            <Box customClass="pool-card-top">
                <Box>
                    <Box customClass="pool-stake-row">
                        <CurrencyIcon size={13} strokeWidth={2} style={{ color: meta.color, flexShrink: 0 }} />
                        <Text font="mono" size={16} weight={700} color="white" customClass="pool-stake">
                            {stake}
                        </Text>
                    </Box>
                    <Text font="mono" size={11} color="muted" customClass="pool-meta">
                        {timeLabel}
                    </Text>
                </Box>
                <Box customClass="pool-right">
                    <Text font="mono" size={14} weight={700} color="accent" customClass="pool-prize">
                        {prize}
                    </Text>
                    <Text font="mono" size={10} color="muted">
                        prize
                    </Text>
                </Box>
            </Box>

            <Box customClass="pool-card-bottom">
                <Box customClass="pool-stat">
                    <Users size={10} />
                    <Text font="mono" size={11} color="muted">
                        {p.players} queued
                    </Text>
                </Box>
                <Box customClass="pool-stat">
                    <Activity size={10} />
                    <Text font="mono" size={11} color="muted">
                        {p.active} active
                    </Text>
                </Box>
                <Box customClass="pool-volume-bars">
                    {Array.from({ length: 5 }, (_, i) => (
                        <Box
                            key={i}
                            customClass="pool-volume-bar"
                            style={{
                                height: Math.max(4, Math.min(14, (p.players / 200) * 3 - i * 1.5)),
                                background: i < Math.floor(p.players / 200)
                                    ? "rgba(42,103,255,0.75)"
                                    : "rgba(42,103,255,0.15)",
                            }}
                        />
                    ))}
                </Box>
            </Box>
        </Card>
    );
}

export default PoolCard;
