import { Rocket, Zap, Timer, Crown } from "@gopvp/common/src/components/images";
import type { LucideIcon } from "@gopvp/common/src/components/images";
import type { GameCategory } from "@gopvp/chess/src/types/index";

export const CATEGORY_ICONS: Record<GameCategory, LucideIcon> = {
 BULLET: Rocket,
 BLITZ: Zap,
 RAPID: Timer,
 CLASSICAL: Crown,
};
