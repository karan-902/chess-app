import type { MatchOutcome, MatchResult } from "@gopvp/common/src/types/index";

export const MATCH_RESULT_OUTCOMES: Record<MatchResult, MatchOutcome> = {
 WIN: "win",
 BET: "loss",
 DRAW: "draw",
 MATCH_CANCELLED: "match_cancelled",
};
