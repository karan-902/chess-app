import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import Card from "@gopvp/common/src/components/Card/Card";
import CustomDrawer from "@gopvp/common/src/components/Drawer/Drawer";
import PoolCardSkeleton from "@gopvp/app/src/components/common/PoolCardSkeleton";
import type { IBetSheetProps } from "@gopvp/common/src/types/component";
import { playText, practiceText } from "@gopvp/common/src/constants/message";
import {
 largestPrizesTipText,
 forFunText,
 freeToPlayText,
 friendlyText,
 roomText,
 customFeeText,
 winText,
 entryFeeAmountText,
 addFundsText,
 tipText,
} from "@gopvp/app/src/constants/message";
import { renderSkeletons } from "@gopvp/app/src/utils/skeleton";
import { POOL_SKELETON_ROWS } from "@gopvp/app/src/constants/limit";

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
 return (
  <CustomDrawer
   anchor="bottom"
   open={open}
   onClose={onClose}
   customClass="bet-sheet gold-foil"
  >
   <Box customClass="bet-grid">
    {poolsLoading ? (
     renderSkeletons(POOL_SKELETON_ROWS, PoolCardSkeleton)
    ) : (
     <>
      {pools.map((pool) => {
       const canAfford = usdValue >= pool.bet;
       return (
        <Card
         key={pool.id}
         customClass={classNames(
          "bet-card gold-foil",
          !canAfford && "insufficient",
         )}
        >
         <PoolLabel pool={pool} />
         <Text customClass="bet-card-tc">{winText}</Text>
         <Text customClass="pool-win-amt gold-foil">${pool.prize}</Text>
         <Text customClass="pool-entry-fee">
          {entryFeeAmountText(`$${pool.bet}`)}
         </Text>

         <Button
          type="button"
          variant="contained"
          fullWidth
          customClass="common-play gold-foil"
          onClick={() =>
           canAfford ? onPoolPlay(pool) : onInsufficientBalance()
          }
         >
          {canAfford ? playText : addFundsText}
         </Button>
        </Card>
       );
      })}
     </>
    )}
    {onPracticeOpen && (
     <Card customClass="bet-card practice gold-foil">
      <Text customClass="bet-card-tc">{forFunText}</Text>
      <Text customClass="bet-card-practice-title gold-foil">
       {practiceText}
      </Text>
      <Text customClass="caption">{freeToPlayText}</Text>
      <Button
       type="button"
       variant="contained"
       fullWidth
       customClass="common-play gold-foil"
       onClick={onPracticeOpen}
      >
       {playText}
      </Button>
     </Card>
    )}
    <Card customClass="bet-card friend gold-foil">
     <Text customClass="bet-card-tc">{friendlyText}</Text>
     <Text customClass="bet-card-practice-title gold-foil">{roomText}</Text>
     <Text customClass="caption">{customFeeText}</Text>
     <Button
      type="button"
      variant="contained"
      fullWidth
      customClass="common-play gold-foil"
      onClick={onRoomOpen}
     >
      {playText}
     </Button>
    </Card>
   </Box>
   <Text customClass="sheet-tip meta-text">
    <>
     <b>{tipText}</b> {largestPrizesTipText}
    </>
   </Text>
  </CustomDrawer>
 );
}
