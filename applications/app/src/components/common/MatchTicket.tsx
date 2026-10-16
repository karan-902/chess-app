import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import CustomAvatar from "@gopvp/common/src/components/Avatar/Avatar";
import { formatAmount } from "@gopvp/common/src/util/format";
import {
 RIVAL_MASK_PATH,
 HERO_SPARK_PATH,
} from "@gopvp/app/src/constants/asset";
import {
 matchTicketText,
 matchConfirmedText,
 noMatchFoundText,
 noMatchText,
 rivalText,
 noRivalText,
 vsText,
 timeText,
 entryText,
 winText,
 poolMinutesText,
} from "@gopvp/app/src/constants/message";
import {
 MS_PER_MINUTE,
 POOL_TONE_COUNT,
 MATCH_SPARK_COUNT,
} from "@gopvp/app/src/constants/limit";
import type { IMatchTicketProps } from "@gopvp/app/src/types/component";

const MASK_LAYERS = Array.from({ length: POOL_TONE_COUNT }, (_, i) => i);
const SPARKS = Array.from({ length: MATCH_SPARK_COUNT }, (_, i) => i);
const initialOf = (name: string) => name.charAt(0).toUpperCase();

export default function MatchTicket({
 status,
 pool,
 tone,
 myName,
 opponentName,
}: IMatchTicketProps) {
 const phase =
  status === "timeout"
   ? "lost"
   : status === "revealing" || status === "found"
     ? "found"
     : "searching";
 const rivalName =
  phase === "lost" ? noRivalText : opponentName || rivalText;

 const renderHalf = (half: "top" | "bottom") => (
  <Box customClass={classNames("ticket-half", half)} aria-hidden={half === "bottom"}>
   <Box customClass="ticket-stub">
    <Text component="span" customClass="ticket-stub-label pending">
     {matchTicketText}
    </Text>
    <Text component="span" customClass="ticket-stub-label confirmed">
     {matchConfirmedText}
    </Text>
    <Text component="span" customClass="ticket-stub-label none">
     {noMatchFoundText}
    </Text>
   </Box>
   <Box customClass="ticket-players">
    <Box customClass="ticket-side">
     <CustomAvatar letter={initialOf(myName)} customClass="ticket-me" />
     <Text customClass="ticket-name">{myName}</Text>
    </Box>
    <Text component="span" customClass="ticket-vs">
     {vsText}
    </Text>
    <Box customClass="ticket-side">
     <Box customClass="ticket-seat">
      <Box customClass="ticket-flipper">
       <Box customClass="ticket-masks">
        {MASK_LAYERS.map((layer) => (
         <Box key={layer} customClass={`ticket-mask mask-${layer + 1}`}>
          <img src={RIVAL_MASK_PATH} alt="" />
         </Box>
        ))}
       </Box>
       <Box customClass="ticket-empty-seat" />
       <CustomAvatar
        letter={initialOf(opponentName)}
        customClass="ticket-rival"
       />
      </Box>
     </Box>
     <Text
      customClass={classNames("ticket-name", phase !== "found" && "pending")}
     >
      {rivalName}
     </Text>
    </Box>
   </Box>
   <Box customClass="ticket-stats">
    <Box customClass="ticket-stat">
     <Text customClass="ticket-stat-label">{timeText}</Text>
     <Text customClass="ticket-stat-value">
      {poolMinutesText(Math.round(pool.time / MS_PER_MINUTE))}
     </Text>
    </Box>
    <Box customClass="ticket-stat">
     <Text customClass="ticket-stat-label">{entryText}</Text>
     <Text customClass="ticket-stat-value">{formatAmount(pool.bet)}</Text>
    </Box>
    <Box customClass="ticket-stat win">
     <Text customClass="ticket-stat-label">{winText}</Text>
     <Text customClass="ticket-stat-value">{formatAmount(pool.prize)}</Text>
    </Box>
   </Box>
   <Box customClass="ticket-perf" />
   <Box customClass="ticket-glare" />
   <Box customClass="ticket-dim" />
   <Text component="span" customClass="ticket-void">
    {noMatchText}
   </Text>
  </Box>
 );

 return (
  <Box customClass={classNames("match-ticket", `tone-${tone}`, phase)}>
   <Box customClass="match-beam" />
   <Box customClass="match-rise">
    <Box customClass="match-ticket-wrap">
     {renderHalf("top")}
     {renderHalf("bottom")}
    </Box>
   </Box>
   <Box customClass="match-slot" />
   {SPARKS.map((spark) => (
    <img
     key={spark}
     className={`match-spark spark-${spark + 1}`}
     src={HERO_SPARK_PATH}
     alt=""
    />
   ))}
  </Box>
 );
}
