import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import Card from "@gopvp/common/src/components/Card/Card";
import CustomModal from "@gopvp/common/src/components/Modal/Modal";
import PoolCardSkeleton from "@gopvp/app/src/components/common/PoolCardSkeleton";
import type { IBetSheetProps } from "@gopvp/common/src/types/component";
import { playText } from "@gopvp/common/src/constants/message";
import {
 largestPrizesTipText,
 forFunText,
 practiceText,
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
  <CustomModal open={open} onClose={onClose} customClass="bet-modal">
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
         <Text customClass="bet-card-tc">{winText}</Text>
         <Text customClass="pool-win-amt">${pool.prize}</Text>
         <Text customClass="pool-entry-fee">
          {entryFeeAmountText(`$${pool.bet}`)}
         </Text>

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
      <Text customClass="bet-card-tc">{forFunText}</Text>
      <Text customClass="bet-card-practice-title">{practiceText}</Text>
      <Text customClass="caption">{freeToPlayText}</Text>
      <Button
       type="button"
       variant="contained"
       fullWidth
       customClass="common-play"
       onClick={onPracticeOpen}
      >
       {playText}
      </Button>
     </Card>
    )}
    <Card customClass={classNames("bet-card", "friend")}>
     <Text customClass="bet-card-tc">{friendlyText}</Text>
     <Text customClass="bet-card-practice-title">{roomText}</Text>
     <Text customClass="caption">{customFeeText}</Text>
     <Button
      type="button"
      variant="contained"
      fullWidth
      customClass="common-play"
      onClick={onRoomOpen}
     >
      {playText}
     </Button>
    </Card>
   </Box>
   <Text customClass="sheet-tip meta-text">
    <b>{tipText}</b> {largestPrizesTipText}
   </Text>
  </CustomModal>
 );
}
