import classNames from "classnames";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import Card from "@/components/base/Card/Card";
import CustomModal from "@/components/base/Modal/Modal";
import PoolCardSkeleton from "@/components/common/PoolCardSkeleton";
import { deriveCategory, msToSeconds } from "@/utils";
import { formatText } from "@/utils/format";
import { CATEGORY_META } from "@/constants/config";
import type { IBetSheetProps } from "@gopvp/common/src/types/component";
import {
 playText,
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
 minutesText,
} from "@/constants/messages";

export default function BetSheet({
 open,
 onClose,
 pools,
 poolsLoading,
 usdValue,
 onPoolPlay,
 onPracticeOpen,
 onRoomOpen,
 onInsufficientBalance,
}: IBetSheetProps) {
 return (
  <CustomModal open={open} onClose={onClose} customClass="bet-modal">
   <Box customClass="bet-grid">
    {poolsLoading ? (
     Array.from({ length: 4 }, (_, i) => <PoolCardSkeleton key={i} />)
    ) : (
     <>
      {pools.map((pool) => {
       const poolSeconds = msToSeconds(pool.time);
       const category = CATEGORY_META[deriveCategory(poolSeconds)];
       const CategoryIcon = category?.icon;
       const timeLabel = minutesText(poolSeconds / 60);
       const canAfford = usdValue >= pool.bet;
       return (
        <Card
         key={pool.id}
         customClass={classNames("bet-card", !canAfford && "insufficient")}
        >
         <Box customClass="pool-meta">
          <CategoryIcon className="bet-card-icon" size="1em" strokeWidth={2} />
          <Text customClass="description" component="span">
           {formatText(category?.label ?? "")}
          </Text>
          <Text component="span" customClass="description">
           {timeLabel}
          </Text>
         </Box>
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
    <b>Tip:</b> {largestPrizesTipText}
   </Text>
  </CustomModal>
 );
}
