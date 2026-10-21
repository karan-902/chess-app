import type { MatchOutcome, MatchResult } from "@gopvp/common/src/types/index";
import {
 youBeatText,
 youLostToText,
 drawWithText,
 betReturnedText,
} from "@gopvp/common/src/constants/message";

export const ERROR_TYPES = {
 POOL_JOIN_IN_PROGRESS: "pool_join_in_progress",
 AMOUNT_BELOW_MINIMUM: "amount_below_minimum",
 DAILY_WITHDRAW_LIMIT_REACHED: "daily_withdraw_limit_reached",
} as const;

export const MATCH_RESULT_OUTCOMES: Record<MatchResult, MatchOutcome> = {
 WON: "win",
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
 match_cancelled: betReturnedText,
};
