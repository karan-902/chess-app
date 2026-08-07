import {
    Sparkles,
    Shield,
    Award,
    Star,
    Gem,
    Crown,
    type LucideIcon,
} from "lucide-react";

export const DEFAULT_ELO_RATING = 400;

export interface IEloTier {
    name: string;
    color: string;
    icon: LucideIcon;
    min: number;
    max: number | null;
}

const ELO_TIERS: IEloTier[] = [
    { name: "Novice", color: "#34d399", icon: Sparkles, min: 0, max: 999 },
    { name: "Bronze", color: "#cd7f32", icon: Shield, min: 1000, max: 1199 },
    { name: "Silver", color: "#b8c0cc", icon: Award, min: 1200, max: 1399 },
    { name: "Gold", color: "#f0b90b", icon: Star, min: 1400, max: 1599 },
    { name: "Platinum", color: "#00d4ff", icon: Gem, min: 1600, max: 1799 },
    { name: "Diamond", color: "#8b7cff", icon: Gem, min: 1800, max: 1999 },
    { name: "Master", color: "#ff4d6d", icon: Crown, min: 2000, max: null },
];

export interface IEloTierResult extends IEloTier {
    next: IEloTier | null;
    progress: number;
}

export function getEloTier(elo: number): IEloTierResult {
    const tier =
        ELO_TIERS.find(
            (t) => elo >= t.min && (t.max === null || elo <= t.max),
        ) ?? ELO_TIERS[0];
    const next = ELO_TIERS[ELO_TIERS.indexOf(tier) + 1] ?? null;
    const progress = next
        ? Math.min(
              100,
              Math.max(
                  0,
                  Math.round(((elo - tier.min) / (next.min - tier.min)) * 100),
              ),
          )
        : 100;
    return { ...tier, next, progress };
}
