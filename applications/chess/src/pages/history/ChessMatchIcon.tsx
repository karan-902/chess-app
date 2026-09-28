import { CATEGORY_ICONS } from "@gopvp/chess/src/constants/icon";
import { deriveCategory, msToSeconds } from "@gopvp/chess/src/utils";
import type { IMatchIconProps } from "@gopvp/common/src/types/component";

export default function ChessMatchIcon({ time }: IMatchIconProps) {
 const CategoryIcon = CATEGORY_ICONS[deriveCategory(msToSeconds(time))];
 return <CategoryIcon className="match-row-svg" strokeWidth={2} />;
}
