import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import CustomBadge from "@gopvp/common/src/components/Badge/Badge";
import { useGame } from "@gopvp/app/src/hooks/useGame";
import { formatText, formatAmount } from "@gopvp/common/src/util/format";
import type { IMatchRowProps } from "@gopvp/app/src/types/component";
import { vsText } from "@gopvp/app/src/constants/message";

export default function MatchRow({
 outcome,
 opponentName,
 time,
 endReason,
 amount,
 betAmount,
 dateLabel,
 selfName,
}: IMatchRowProps) {
 const {
  gameModule: { MatchIcon, endReasonLabels },
 } = useGame();
 const metaParts = [
  endReason && (endReasonLabels[endReason] ?? formatText(endReason)),
  betAmount !== undefined && `${formatAmount(betAmount)} stake`,
  dateLabel,
 ].filter(Boolean);
 return (
  <Box customClass="match-row-item">
   <Box customClass={classNames("match-row", outcome)}>
    <Box customClass="match-row-info">
     {time !== undefined && (
      <Box customClass="match-row-icon">
       <MatchIcon time={time} />
      </Box>
     )}
     <Box customClass="match-row-text">
      <Text customClass="match-row-headline row-title">
       {selfName && (
        <>
         {selfName}
         <CustomBadge customClass="match-row-vs" badgeContent={vsText} />
        </>
       )}
       {opponentName}
      </Text>
      <Text customClass="match-row-time meta-text">
       {metaParts.join(" · ")}
      </Text>
     </Box>
    </Box>
    <Box customClass="match-row-amt-wrap">
     <Box customClass="match-row-amt-row">
      <Text
       component="span"
       customClass={classNames("amount-value", {
        pos: outcome === "win",
        neg: outcome === "loss",
        neutral: outcome === "draw",
       })}
      >
       {outcome === "win" && `+${formatAmount(amount)}`}
       {outcome === "loss" && `-${formatAmount(amount)}`}
       {outcome === "draw" && `${amount > 0 ? "-" : ""}${formatAmount(amount)}`}
      </Text>
     </Box>
    </Box>
   </Box>
  </Box>
 );
}
