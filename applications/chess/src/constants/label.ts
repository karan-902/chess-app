import type { GameCategory } from "@gopvp/chess/src/types/index";
import type { Difficulty } from "@gopvp/chess/src/types/component";
import { PROMOTION_PIECES } from "@gopvp/chess/src/constants/board";
import {
 checkmateText,
 resignText,
 drawText,
 stalemateText,
 timeoutText,
 inactivityText,
 rejoinDeclinedText,
 abortedText,
 victoryText,
 drawUpperText,
 defeatText,
 cancelledUpperText,
 queenText,
 rookText,
 bishopText,
 knightText,
} from "@gopvp/chess/src/constants/message";
import type { MatchOutcome } from "@gopvp/common/src/types/index";

export const CATEGORY_LABELS: Record<GameCategory, string> = {
 BULLET: "BULLET",
 BLITZ: "BLITZ",
 RAPID: "RAPID",
 CLASSICAL: "CLASSICAL",
};

export const GAME_END_REASON_LABELS: Record<string, string> = {
 CHECKMATE: checkmateText,
 RESIGN: resignText,
 DRAW: drawText,
 STALEMATE: stalemateText,
 TIMEOUT: timeoutText,
 DISCONNECT: inactivityText,
 DECLINED: rejoinDeclinedText,
 ABORT: abortedText,
};

export const RESULT_HEADERS: Record<MatchOutcome, string> = {
 win: victoryText,
 draw: drawUpperText,
 loss: defeatText,
 match_cancelled: cancelledUpperText,
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
 easy: "Easy",
 medium: "Medium",
 hard: "Hard",
};

export const PROMOTION_LABELS: Record<
 (typeof PROMOTION_PIECES)[number],
 string
> = {
 q: queenText,
 r: rookText,
 b: bishopText,
 n: knightText,
};
