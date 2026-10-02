import type { MatchOutcome } from "@gopvp/common/src/types/index";
import type { TResultTone } from "@gopvp/app/src/types/component";
import {
 youBeatText,
 drawWithText,
 cancelledWithText,
} from "@gopvp/common/src/constants/message";
import { beatsYouText } from "@gopvp/app/src/constants/message";

export const MATCH_OUTCOME_TONES: Record<MatchOutcome, TResultTone> = {
 win: "win",
 loss: "loss",
 draw: "neutral",
 match_cancelled: "neutral",
};

export const MATCH_ROW_HEADLINES: Record<
 MatchOutcome,
 (name: string) => string
> = {
 win: youBeatText,
 loss: beatsYouText,
 draw: drawWithText,
 match_cancelled: cancelledWithText,
};
