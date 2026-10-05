import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import PieceIcon from "@gopvp/chess/src/components/board/PieceIcon";
import type { IPromotionOverlayProps } from "@gopvp/chess/src/types/component";
import { promotePawnText } from "@gopvp/chess/src/constants/message";
import { PROMOTION_PIECES } from "@gopvp/chess/src/constants/board";
import { PROMOTION_LABELS } from "@gopvp/chess/src/constants/label";
import { LIGHT_SQUARE_COLOR } from "@gopvp/chess/src/constants/color";

export default function PromotionOverlay({
 playerSide,
 onSelect,
 onCancel,
}: IPromotionOverlayProps) {
 return (
  <Box customClass="gr-promotion-overlay" onClick={onCancel}>
   <Box customClass="gr-promotion-card" onClick={(e) => e.stopPropagation()}>
    <Text customClass="gr-promotion-label caption">{promotePawnText}</Text>
    <Box customClass="gr-promotion-options">
     {PROMOTION_PIECES.map((piece) => (
      <Button
       key={piece}
       type="button"
       customClass="gr-promotion-btn"
       style={{ backgroundColor: LIGHT_SQUARE_COLOR }}
       onClick={() => onSelect(piece)}
       aria-label={PROMOTION_LABELS[piece]}
      >
       <PieceIcon
        code={`${playerSide}${piece.toUpperCase()}`}
        className="gr-promotion-icon"
       />
      </Button>
     ))}
    </Box>
   </Box>
  </Box>
 );
}
