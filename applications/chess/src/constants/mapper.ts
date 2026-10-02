import type { MatchOutcome, MatchResult } from "@gopvp/common/src/types/index";

export const PVC_RESULTS: Record<MatchOutcome, MatchResult> = {
 win: "WIN",
 loss: "BET",
 draw: "DRAW",
 match_cancelled: "MATCH_CANCELLED",
};
