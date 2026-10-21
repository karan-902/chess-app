import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Card from "@gopvp/common/src/components/Card/Card";
import Text from "@gopvp/common/src/components/Text/Text";
import { icons } from "@gopvp/common/src/components/images";
import { formatAmount } from "@gopvp/common/src/util/format";
import {
 winText,
 entryText,
 addFundsText,
 opponentReadyText,
 claimMatchText,
} from "@gopvp/app/src/constants/message";
import { pressProps } from "@gopvp/app/src/utils";
import type { IPoolCardProps } from "@gopvp/app/src/types/component";

export default function PoolCard({
 pool,
 PoolLabel,
 tone,
 isInsufficient = false,
 onPress,
}: IPoolCardProps) {
 const hasOpponentWaiting = !!onPress && !isInsufficient && pool.players > 0;

 return (
  <Card
   customClass={classNames(
    "pool-card",
    `tone-${tone}`,
    isInsufficient && "insufficient",
    !onPress && "static",
    hasOpponentWaiting && "waiting",
   )}
   {...(onPress && pressProps(onPress))}
  >
   <PoolLabel pool={pool} />
   <Text customClass="pool-card-win">
    {winText} {formatAmount(pool.prize)}
   </Text>
   <Text customClass="pool-card-entry">
    <span>{entryText}</span>
    {formatAmount(pool.bet)}
   </Text>
   {hasOpponentWaiting && (
    <>
     <Text customClass="pool-card-status">
      {opponentReadyText}
      <span>{claimMatchText}</span>
     </Text>
     <Box customClass="pool-card-live" />
    </>
   )}
   {onPress &&
    (isInsufficient ? (
     <Text customClass="pool-card-add">{addFundsText}</Text>
    ) : (
     <icons.moveRight className="pool-card-arrow" />
    ))}
  </Card>
 );
}
