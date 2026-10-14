import classNames from "classnames";
import Card from "@gopvp/common/src/components/Card/Card";
import Text from "@gopvp/common/src/components/Text/Text";
import { icons } from "@gopvp/common/src/components/images";
import { formatAmount } from "@gopvp/common/src/util/format";
import {
 winText,
 entryText,
 addFundsText,
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
 return (
  <Card
   customClass={classNames(
    "pool-card",
    `tone-${tone}`,
    isInsufficient && "insufficient",
    !onPress && "static",
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
   {onPress &&
    (isInsufficient ? (
     <Text customClass="pool-card-add">{addFundsText}</Text>
    ) : (
     <icons.moveRight className="pool-card-arrow" />
    ))}
  </Card>
 );
}
