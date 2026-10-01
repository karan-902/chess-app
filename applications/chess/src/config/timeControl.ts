import type { GameCategory } from "@gopvp/chess/src/types/index";

export const TIME_SECONDS: Record<GameCategory, number> = {
 BULLET: 60,
 BLITZ: 180,
 RAPID: 600,
 CLASSICAL: 1800,
};
