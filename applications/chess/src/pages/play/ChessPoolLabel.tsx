import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import { formatText } from "@gopvp/common/src/util/format";
import { deriveCategory, msToSeconds } from "@gopvp/chess/src/utils";
import { CATEGORY_ICONS } from "@gopvp/chess/src/constants/icon";
import { CATEGORY_LABELS } from "@gopvp/chess/src/constants/label";
import { minutesText } from "@gopvp/chess/src/constants/message";
import type { IPoolLabelProps } from "@gopvp/common/src/types/component";

export default function ChessPoolLabel({ pool }: IPoolLabelProps) {
 const poolSeconds = msToSeconds(pool.time);
 const category = deriveCategory(poolSeconds);
 const CategoryIcon = CATEGORY_ICONS[category];

 return (
  <Box customClass="pool-meta">
   <CategoryIcon className="bet-card-icon" size="1em" strokeWidth={2} />
   <Text customClass="description" component="span">
    {formatText(CATEGORY_LABELS[category])}
   </Text>
   <Text component="span" customClass="description">
    {minutesText(poolSeconds / 60)}
   </Text>
  </Box>
 );
}
