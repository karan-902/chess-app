import { Rocket, Zap, Timer, Crown } from "@gopvp/common/src/components/images";
import type { LucideIcon } from "@gopvp/common/src/components/images";
import type { GameCategory } from "@gopvp/chess/src/types/index";
import {
 checkmateText,
 resignText,
 drawText,
 stalemateText,
 timeoutText,
 inactivityText,
} from "@gopvp/chess/src/constants/messages";

export const CATEGORY_META: Record<
 GameCategory,
 { icon: LucideIcon; label: string }
> = {
 BULLET: { icon: Rocket, label: "BULLET" },
 BLITZ: { icon: Zap, label: "BLITZ" },
 RAPID: { icon: Timer, label: "RAPID" },
 CLASSICAL: { icon: Crown, label: "CLASSICAL" },
};

export const GAME_END_REASON_LABELS: Record<string, string> = {
 CHECKMATE: checkmateText,
 RESIGN: resignText,
 DRAW: drawText,
 STALEMATE: stalemateText,
 TIMEOUT: timeoutText,
 DISCONNECT: inactivityText,
};
