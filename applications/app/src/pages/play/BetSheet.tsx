import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Card from "@gopvp/common/src/components/Card/Card";
import CustomDrawer from "@gopvp/common/src/components/Drawer/Drawer";
import PoolCard from "@gopvp/app/src/components/common/PoolCard";
import PoolCardSkeleton from "@gopvp/app/src/components/common/PoolCardSkeleton";
import type { IBetSheetProps } from "@gopvp/common/src/types/component";
import { icons } from "@gopvp/common/src/components/images";
import { practiceText } from "@gopvp/common/src/constants/message";
import {
 freeToPlayText,
 playAFriendText,
 customFeeText,
 addFundsText,
} from "@gopvp/app/src/constants/message";
import { renderSkeletons } from "@gopvp/app/src/utils/skeleton";
import { pressProps, poolTone } from "@gopvp/app/src/utils";
import {
 POOL_SKELETON_ROWS,
 MIN_ROOM_FEE_USD,
} from "@gopvp/app/src/constants/limit";

export default function BetSheet({
 open,
 onClose,
 pools,
 poolsLoading,
 usdValue,
 PoolLabel,
 onPoolPlay,
 onPracticeOpen,
 onRoomOpen,
 onInsufficientBalance,
}: IBetSheetProps) {
 const canAffordRoom = usdValue >= MIN_ROOM_FEE_USD;
 return (
  <CustomDrawer
   anchor="bottom"
   open={open}
   onClose={onClose}
   customClass="bet-sheet"
  >
   <Box customClass="bet-grid">
    {poolsLoading
     ? renderSkeletons(POOL_SKELETON_ROWS, PoolCardSkeleton)
     : pools.map((pool, index) => {
        const canAfford = usdValue >= pool.bet;
        return (
         <PoolCard
          key={pool.id}
          pool={pool}
          PoolLabel={PoolLabel}
          tone={poolTone(index)}
          isInsufficient={!canAfford}
          onPress={() =>
           canAfford ? onPoolPlay(pool) : onInsufficientBalance()
          }
         />
        );
       })}
   </Box>
   <Box customClass="bet-grid">
    {onPracticeOpen && (
     <Card customClass="pool-card more" {...pressProps(onPracticeOpen)}>
      <Box customClass="pool-mode-icon">
       <icons.bot />
      </Box>
      <Text customClass="pool-card-title">{practiceText}</Text>
      <Text customClass="pool-card-sub">{freeToPlayText}</Text>
      <icons.moveRight className="pool-card-arrow" />
     </Card>
    )}
    <Card
     customClass={classNames(
      "pool-card",
      "more",
      !canAffordRoom && "insufficient",
     )}
     {...pressProps(canAffordRoom ? onRoomOpen : onInsufficientBalance)}
    >
     <Box customClass="pool-mode-icon">
      <icons.users />
     </Box>
     <Text customClass="pool-card-title">{playAFriendText}</Text>
     <Text customClass="pool-card-sub">{customFeeText}</Text>
     {canAffordRoom ? (
      <icons.moveRight className="pool-card-arrow" />
     ) : (
      <Text customClass="pool-card-add">{addFundsText}</Text>
     )}
    </Card>
   </Box>
   {/* <Text customClass="sheet-tip meta-text">
    <>
     <b>{tipText}</b> {largestPrizesTipText}
    </>
   </Text> */}
  </CustomDrawer>
 );
}
