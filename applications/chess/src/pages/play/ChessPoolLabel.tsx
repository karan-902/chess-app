import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import CustomChip from "@gopvp/common/src/components/Chip/Chip";
// import Text from "@gopvp/common/src/components/Text/Text";
// import { formatText } from "@gopvp/common/src/util/format";
import { deriveCategory, msToSeconds } from "@gopvp/chess/src/utils";
import { CATEGORY_ICONS } from "@gopvp/chess/src/constants/icon";
// import { CATEGORY_LABELS } from "@gopvp/chess/src/constants/label";
import { minutesText } from "@gopvp/chess/src/constants/message";
import type { IPoolLabelProps } from "@gopvp/common/src/types/component";

export default function ChessPoolLabel({ pool }: IPoolLabelProps) {
 const poolSeconds = msToSeconds(pool.time);
 const category = deriveCategory(poolSeconds);
 const CategoryIcon = CATEGORY_ICONS[category];

 return (
  <Box customClass={classNames("pool-meta", category.toLowerCase())}>
   <Box customClass="pool-mode">
    <Box customClass="pool-mode-icon">
     <CategoryIcon size="1em" strokeWidth={2} />
    </Box>
   </Box>
   <CustomChip
    customClass="minute-chip"
    label={minutesText(poolSeconds / 60)}
   />
  </Box>
 );
}
