import { CATEGORY_META } from "@gopvp/chess/src/constants/config";
import { deriveCategory, msToSeconds } from "@gopvp/chess/src/utils";
import type { IMatchIconProps } from "@gopvp/common/src/types/component";

export default function ChessMatchIcon({ time }: IMatchIconProps) {
 const CategoryIcon = CATEGORY_META[deriveCategory(msToSeconds(time))].icon;
 return <CategoryIcon className="match-row-svg" strokeWidth={2} />;
}
