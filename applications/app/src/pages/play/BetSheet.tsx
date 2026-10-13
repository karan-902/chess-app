import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import Card from "@gopvp/common/src/components/Card/Card";
import CustomDrawer from "@gopvp/common/src/components/Drawer/Drawer";
import PoolCardSkeleton from "@gopvp/app/src/components/common/PoolCardSkeleton";
import type { IBetSheetProps } from "@gopvp/common/src/types/component";
import { icons } from "@gopvp/common/src/components/images";
import { playText, practiceText } from "@gopvp/common/src/constants/message";
import {
 forFunText,
 freeToPlayText,
 friendlyText,
 roomText,
 customFeeText,
 winText,
 entryText,
 addFundsText,
} from "@gopvp/app/src/constants/message";
import { renderSkeletons } from "@gopvp/app/src/utils/skeleton";
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
    {poolsLoading ? (
     renderSkeletons(POOL_SKELETON_ROWS, PoolCardSkeleton)
    ) : (
     <>
      {pools.map((pool) => {
       const canAfford = usdValue >= pool.bet;
       return (
        <Card
         key={pool.id}
         customClass={classNames("bet-card", !canAfford && "insufficient")}
        >
         <PoolLabel pool={pool} />
         <Box customClass="pool-stats">
          <Box customClass="pool-stat">
           <Text customClass="stake-label win">{winText}</Text>
           <Text customClass="stake-value win">${pool.prize}</Text>
          </Box>
          <Box customClass="pool-stat entry">
           <Text customClass="stake-label">{entryText}</Text>
           <Text customClass="pool-entry-fee">${pool.bet}</Text>
          </Box>
         </Box>
         <Button
          type="button"
          variant="contained"
          fullWidth
          customClass="common-play"
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
     <Card customClass={classNames("bet-card", "practice")}>
      <Text customClass="bet-card-tc">
       <icons.bot />
       {forFunText}
      </Text>
      <Text customClass="bet-card-practice-title">{practiceText}</Text>
      <Text customClass="bet-card-sub">{freeToPlayText}</Text>
      <Button
       type="button"
       variant="outlined"
       fullWidth
       customClass="common-play"
       onClick={onPracticeOpen}
      >
       {playText}
      </Button>
     </Card>
    )}
    <Card
     customClass={classNames(
      "bet-card",
      "friend",
      !canAffordRoom && "insufficient",
     )}
    >
     <Text customClass="bet-card-tc">
      <icons.users />
      {friendlyText}
     </Text>
     <Text customClass="bet-card-practice-title">{roomText}</Text>
     <Text customClass="bet-card-sub">{customFeeText}</Text>
     <Button
      type="button"
      variant="outlined"
      fullWidth
      customClass="common-play"
      onClick={canAffordRoom ? onRoomOpen : onInsufficientBalance}
     >
      {canAffordRoom ? playText : addFundsText}
     </Button>
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
