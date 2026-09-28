import {
 Rocket,
 Zap,
 Timer,
 Crown,
 Flag,
 Handshake,
 X,
} from "@gopvp/common/src/components/images";
import type { LucideIcon } from "@gopvp/common/src/components/images";
import type { GameCategory } from "@gopvp/chess/src/types/index";
import type { MatchOutcome } from "@gopvp/common/src/types/index";

export const RESULT_ICONS: Record<MatchOutcome, LucideIcon> = {
 win: Crown,
 draw: Handshake,
 loss: Flag,
 match_cancelled: X,
};

export const CATEGORY_ICONS: Record<GameCategory, LucideIcon> = {
 BULLET: Rocket,
 BLITZ: Zap,
 RAPID: Timer,
 CLASSICAL: Crown,
};
