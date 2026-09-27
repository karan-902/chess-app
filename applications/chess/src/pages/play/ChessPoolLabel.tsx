import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import { formatText } from "@gopvp/common/src/util/format";
import { deriveCategory, msToSeconds } from "@gopvp/chess/src/utils";
import { CATEGORY_META } from "@gopvp/chess/src/constants/config";
import { minutesText } from "@gopvp/chess/src/constants/messages";
import type { IPoolLabelProps } from "@gopvp/common/src/types/component";

export default function ChessPoolLabel({ pool }: IPoolLabelProps) {
 const poolSeconds = msToSeconds(pool.time);
 const category = CATEGORY_META[deriveCategory(poolSeconds)];
 const CategoryIcon = category.icon;

 return (
  <Box customClass="pool-meta">
   <CategoryIcon className="bet-card-icon" size="1em" strokeWidth={2} />
   <Text customClass="description" component="span">
    {formatText(category.label)}
   </Text>
   <Text component="span" customClass="description">
    {minutesText(poolSeconds / 60)}
   </Text>
  </Box>
 );
}
