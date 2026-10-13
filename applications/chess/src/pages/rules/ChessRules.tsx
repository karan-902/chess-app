import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Card from "@gopvp/common/src/components/Card/Card";
import Text from "@gopvp/common/src/components/Text/Text";
import {
 Check,
 Crown,
 DollarSign,
 Handshake,
 Scale,
 Timer,
} from "@gopvp/common/src/components/images";
import type { LucideIcon } from "@gopvp/common/src/components/images";
import {
 howBettingWorksText,
 winnerTakeMostText,
 equalBetText,
 winnerTakesPotText,
 withdrawableWinningsText,
 payoutsText,
 anyWinText,
 potMinusFeeText,
 drawText,
 splitPotMinusFeeText,
 inactiveTooLongText,
 forfeitText,
 exampleText,
 examplePotText,
 exampleWinnerText,
 exampleDrawText,
 fairMatchingText,
 matchedByScoreText,
 evenBoardText,
 pieceSetCreditText,
} from "@gopvp/chess/src/constants/message";

const PAYOUT_ROWS = [
 { icon: Crown, label: anyWinText, value: potMinusFeeText },
 { icon: Handshake, label: drawText, value: splitPotMinusFeeText },
 {
  icon: Timer,
  label: inactiveTooLongText,
  value: forfeitText,
  isLoss: true,
 },
];

const RULE_SECTIONS: {
 title: string;
 icon: LucideIcon;
 bullets?: string[];
 rows?: typeof PAYOUT_ROWS;
 example?: string[];
}[] = [
 {
  title: howBettingWorksText,
  icon: DollarSign,
  bullets: [
   winnerTakeMostText,
   equalBetText,
   winnerTakesPotText,
   withdrawableWinningsText,
  ],
 },
 {
  title: payoutsText,
  icon: Crown,
  rows: PAYOUT_ROWS,
  example: [examplePotText, exampleWinnerText, exampleDrawText],
 },
 {
  title: fairMatchingText,
  icon: Scale,
  bullets: [matchedByScoreText, evenBoardText],
 },
];

export default function ChessRules() {
 return (
  <Box customClass="rules-page">
   {RULE_SECTIONS.map(({ title, icon: TitleIcon, bullets, rows, example }) => (
    <Card key={title} customClass="rules-card">
     <Box customClass="rules-title-row">
      <TitleIcon strokeWidth={2} />
      <Text component="h3" customClass="rules-title">
       {title}
      </Text>
     </Box>
     {bullets?.map((bullet) => (
      <Box key={bullet} customClass="rules-bullet">
       <Check strokeWidth={2.5} />
       <Text customClass="rules-text">{bullet}</Text>
      </Box>
     ))}
     {rows?.map(({ icon: Icon, label, value, isLoss }) => (
      <Box key={label} customClass="stat-row">
       <Box customClass="stat-label">
        <Icon className="stat-icon" strokeWidth={2} />
        <Text component="span" customClass="stat-title">
         {label}
        </Text>
       </Box>
       <Text
        component="span"
        customClass={classNames("stat-val", isLoss && "neg")}
       >
        {value}
       </Text>
      </Box>
     ))}
     {example && (
      <Box customClass="rules-example">
       <Text customClass="rules-example-title">{exampleText}</Text>
       {example.map((line) => (
        <Text key={line} customClass="rules-text">
         {line}
        </Text>
       ))}
      </Box>
     )}
    </Card>
   ))}

   <Text customClass="rules-about">{pieceSetCreditText}</Text>
  </Box>
 );
}
