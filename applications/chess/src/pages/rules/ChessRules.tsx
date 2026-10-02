import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Card from "@gopvp/common/src/components/Card/Card";
import Text from "@gopvp/common/src/components/Text/Text";
import { Crown, Handshake, Timer } from "@gopvp/common/src/components/images";
import {
 howBettingWorksText,
 bettingExplainedText,
 payoutsText,
 anyWinText,
 potMinusFeeText,
 drawText,
 splitPotMinusFeeText,
 inactiveTooLongText,
 forfeitText,
 payoutExampleText,
 fairMatchingText,
 fairMatchingExplainedText,
 appVersionText,
 pieceSetCreditText,
} from "@gopvp/chess/src/constants/message";

const PAYOUT_ROWS = [
 { icon: Crown, tone: "gold", label: anyWinText, value: potMinusFeeText },
 {
  icon: Handshake,
  tone: "silver",
  label: drawText,
  value: splitPotMinusFeeText,
 },
 {
  icon: Timer,
  tone: "bronze",
  label: inactiveTooLongText,
  value: forfeitText,
 },
];

const RULE_SECTIONS: {
 title: string;
 body: string;
 rows?: typeof PAYOUT_ROWS;
}[] = [
 { title: howBettingWorksText, body: bettingExplainedText },
 { title: payoutsText, rows: PAYOUT_ROWS, body: payoutExampleText },
 { title: fairMatchingText, body: fairMatchingExplainedText },
];

export default function ChessRules() {
 return (
  <Box customClass="rules-page">
   {RULE_SECTIONS.map(({ title, body, rows }) => (
    <Card key={title} customClass="rules-card">
     <Text component="h3" customClass="section-heading">
      {title}
     </Text>
     {rows?.map(({ icon: Icon, tone, label, value }) => (
      <Box key={label} customClass="stat-row">
       <Box customClass="stat-label">
        <Icon className={classNames("stat-icon", tone)} strokeWidth={2} />
        <Text component="span" customClass="stat-title">
         {label}
        </Text>
       </Box>
       <Text component="span" customClass="stat-val">
        {value}
       </Text>
      </Box>
     ))}
     <Text customClass="rules-text">{body}</Text>
    </Card>
   ))}

   <Text customClass="rules-about">
    {appVersionText}
    <br />
    {pieceSetCreditText}
   </Text>
  </Box>
 );
}
