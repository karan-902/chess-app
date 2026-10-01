import type { MatchOutcome, MatchResult } from "@gopvp/common/src/types/index";
import {
 youBeatText,
 youLostToText,
 drawWithText,
 cancelledWithText,
} from "@gopvp/common/src/constants/message";

export const MATCH_RESULT_OUTCOMES: Record<MatchResult, MatchOutcome> = {
 WIN: "win",
 BET: "loss",
 DRAW: "draw",
 MATCH_CANCELLED: "match_cancelled",
};

export const MATCH_OUTCOME_SUBTITLES: Record<
 MatchOutcome,
 (name: string) => string
> = {
 win: youBeatText,
 loss: youLostToText,
 draw: drawWithText,
 match_cancelled: cancelledWithText,
};
