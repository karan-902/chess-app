import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import { formatAmount } from "@gopvp/common/src/util/format";
import type { IMatchRowProps } from "@gopvp/app/src/types/component";

export default function MatchRow({
 outcome,
 headline,
 amount,
 onClick,
}: IMatchRowProps) {
 return (
  <Box customClass="match-row-item">
   <Box
    customClass={classNames("match-row", outcome, onClick && "clickable")}
    onClick={onClick}
   >
    <Box customClass="match-row-info">
     <Box customClass="match-row-text">
      <Text customClass="match-row-headline row-title">{headline}</Text>
     </Box>
    </Box>
    <Box customClass="match-row-amt-wrap">
     <Box customClass="match-row-amt-row">
      <Text
       component="span"
       customClass={classNames(
        "amount-value",
        outcome === "loss" ? "neg" : "pos",
       )}
      >
       {`${outcome === "loss" ? "-" : "+"}${formatAmount(amount)}`}
      </Text>
     </Box>
    </Box>
   </Box>
  </Box>
 );
}
